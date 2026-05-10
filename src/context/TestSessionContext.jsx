import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  isGoogleFormConfigured,
  isTestResultsEndpointConfigured,
} from "../config/usabilityTestEnv.js";
import {
  GOOGLE_FORM_BASE_URL,
  FORM_ORDER_ENTRY,
  FORM_PARTICIPANT_ENTRY,
  FORM_PHASE1_VARIANT_ENTRY,
  FORM_PHASE2_VARIANT_ENTRY,
} from "../config/usabilityTestEnv.js";
import { getProductById } from "../data/products.js";
import {
  getTaskCount,
  getTasksForPhase,
  getTaskSetNumberForPhase,
} from "../data/usabilityTestTasks.js";
import {
  buildPhaseApiPayload,
  buildSessionApiPayload,
  mergePhaseResults,
  mergeTaskRunsWithDedupe,
  taskResultId,
} from "../lib/batchTestResults.js";
import { answerMatchesAccepted } from "../lib/normalizeAnswer.js";
import {
  downloadSessionCsvOnly,
  downloadSessionJsonOnly,
} from "../lib/usabilityTestExport.js";
import {
  clearAllCartAndCheckoutStorage,
  clearRawSession,
  readRawSession,
  writeRawSession,
} from "../lib/usabilityTestStorage.js";
import {
  checkoutEnteredMatchesExpected,
  evaluateAutoTaskSuccess,
  getEnteredCheckoutSnapshot,
} from "../lib/usabilityTaskSuccess.js";
import { UsabilityTestChrome } from "../components/UsabilityTestChrome.jsx";
import { useCart } from "./CartContext.jsx";

const TestSessionContext = createContext(null);

function genParticipantId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "P-";
  for (let i = 0; i < 6; i += 1) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

function variantsFromOrder(testOrder) {
  if (testOrder === "AB") {
    return { phase1Variant: "A", phase2Variant: "B" };
  }
  return { phase1Variant: "B", phase2Variant: "A" };
}

function homePathForVariant(v) {
  return v === "A" ? "/" : "/rich";
}

function pickTestOrder(searchParams) {
  const o = searchParams.get("order");
  if (o === "AB" || o === "BA") return o;
  return Math.random() < 0.5 ? "AB" : "BA";
}

function pickTaskSetOrder(searchParams) {
  const t = (searchParams.get("taskSetOrder") ?? "").trim();
  if (t === "12" || t === "21") return t;
  return Math.random() < 0.5 ? "12" : "21";
}

function targetLabelFromEvent(ev) {
  const el = ev.target;
  if (!el || typeof el !== "object") return "";
  if (el.getAttribute?.("aria-label")) return el.getAttribute("aria-label");
  if (el.textContent && el.textContent.trim()) {
    return el.textContent.trim().slice(0, 120);
  }
  if (el.tagName) return el.tagName.toLowerCase();
  return "";
}

function migrateSessionShape(s) {
  if (!s) return s;
  let next = { ...s };
  if (next.taskSetOrder !== "12" && next.taskSetOrder !== "21") {
    next = { ...next, taskSetOrder: "12" };
  }
  const tc = getTaskCount();
  if (!next.testUi) {
    if (next.activeMeasurement?.taskStartedAt) {
      return { ...next, testUi: "active" };
    }
    return { ...next, testUi: "intro" };
  }
  if (typeof next.currentTaskIndex === "number" && next.currentTaskIndex >= tc) {
    return { ...next, currentTaskIndex: tc - 1 };
  }
  return next;
}

export function TestSessionProvider({ children }) {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const { clearCart, lines, addToCart } = useCart();
  const [session, setSession] = useState(() => migrateSessionShape(readRawSession()));
  const [measuring, setMeasuring] = useState(() => {
    const s = migrateSessionShape(readRawSession());
    return Boolean(s?.activeMeasurement?.taskStartedAt);
  });
  const [clickCount, setClickCount] = useState(
    () => migrateSessionShape(readRawSession())?.activeMeasurement?.clickCount ?? 0,
  );
  const [isCompletingTask, setIsCompletingTask] = useState(false);
  const [instructionPeekOpen, setInstructionPeekOpen] = useState(false);
  const [answerDraft, setAnswerDraft] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [outcomeMeta, setOutcomeMeta] = useState(() => ({}));

  const sessionRef = useRef(session);
  const measureClicksRef = useRef(0);
  const finishingTaskRef = useRef(false);
  const completedIdsRef = useRef(new Set());
  const task7PreparedRef = useRef(false);
  const wrongAnswerStreakRef = useRef(0);
  sessionRef.current = session;

  const setAnswerDraftAndClearError = useCallback((next) => {
    setAnswerError("");
    setAnswerDraft(next);
  }, []);

  useEffect(() => {
    const ids = new Set(
      (session?.taskRuns ?? []).map((r) => r.resultId).filter(Boolean),
    );
    completedIdsRef.current = ids;
  }, [session?.taskRuns]);

  const commitSession = useCallback((next) => {
    const m = migrateSessionShape(next);
    sessionRef.current = m;
    writeRawSession(m);
    setSession(m);
  }, []);

  const persist = useCallback((updater) => {
    setSession((prev) => {
      const base = migrateSessionShape(prev ? { ...prev } : {});
      const next = typeof updater === "function" ? updater(base) : updater;
      const m = migrateSessionShape(next);
      writeRawSession(m);
      return m;
    });
  }, []);

  const refreshFromStorage = useCallback(() => {
    const s = migrateSessionShape(readRawSession());
    setSession(s);
    setMeasuring(Boolean(s?.activeMeasurement?.taskStartedAt));
    setClickCount(s?.activeMeasurement?.clickCount ?? 0);
  }, []);

  const resetEntireTest = useCallback(() => {
    clearRawSession();
    clearAllCartAndCheckoutStorage();
    clearCart();
    measureClicksRef.current = 0;
    task7PreparedRef.current = false;
    wrongAnswerStreakRef.current = 0;
    setSession(null);
    setMeasuring(false);
    setClickCount(0);
    setInstructionPeekOpen(false);
    setAnswerDraft("");
    setAnswerError("");
    setOutcomeMeta({});
  }, [clearCart]);

  const isTestPath =
    pathname === "/test" ||
    pathname === "/test/continue" ||
    pathname === "/test/complete";

  const awaitingPhase2Bridge = Boolean(
    session &&
      session.phase1CompletedAt &&
      !session.phase2StartedAt &&
      !session.sessionCompletedAt,
  );

  const outcomeNeedsAck = session?.testUi === "outcome";

  const showChrome = Boolean(
    session &&
      (!session.sessionCompletedAt || outcomeNeedsAck) &&
      (!awaitingPhase2Bridge || outcomeNeedsAck) &&
      !isTestPath &&
      (pathname === "/" ||
        pathname.startsWith("/veikals") ||
        pathname.startsWith("/produkts") ||
        pathname.startsWith("/grozs") ||
        pathname.startsWith("/noformesana") ||
        pathname.startsWith("/informacija") ||
        pathname.startsWith("/par-mums") ||
        pathname.startsWith("/kontakti") ||
        pathname.startsWith("/piegade") ||
        pathname.startsWith("/iepirkties") ||
        pathname.startsWith("/noteikumi") ||
        pathname.startsWith("/privatums") ||
        pathname === "/rich" ||
        pathname.startsWith("/rich/")),
  );

  const testUi = session?.testUi ?? "intro";
  const introOpen = Boolean(showChrome && testUi === "intro" && !measuring);
  const outcomeOpen = Boolean(showChrome && testUi === "outcome" && !measuring);

  useEffect(() => {
    const active =
      Boolean(session) &&
      (!session?.sessionCompletedAt || outcomeNeedsAck) &&
      (!awaitingPhase2Bridge || outcomeNeedsAck) &&
      !isTestPath;
    document.body.classList.toggle("usability-test-active", active);
    document.body.classList.toggle("usability-test-bottom", Boolean(measuring && showChrome));
    return () => {
      document.body.classList.remove("usability-test-active");
      document.body.classList.remove("usability-test-bottom");
    };
  }, [session, isTestPath, awaitingPhase2Bridge, measuring, showChrome, outcomeNeedsAck]);

  useEffect(() => {
    function onVis() {
      if (document.visibilityState === "visible") refreshFromStorage();
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [refreshFromStorage]);

  useEffect(() => {
    if (!measuring || !session?.activeMeasurement) return undefined;

    const onPointerDown = (ev) => {
      if (ev.button !== 0 && ev.button !== undefined) return;
      const t = ev.target;
      if (t && typeof t.closest === "function" && t.closest("[data-usability-chrome]")) {
        return;
      }
      measureClicksRef.current += 1;
      const nextC = measureClicksRef.current;
      setClickCount(nextC);
      persist((s) => {
        if (!s?.activeMeasurement) return s;
        const log = Array.isArray(s.activeMeasurement.actionLog)
          ? [...s.activeMeasurement.actionLog]
          : [];
        if (log.length < 80) {
          log.push({
            timestamp: new Date().toISOString(),
            eventType: "click",
            targetLabel: targetLabelFromEvent(ev),
            url: window.location.href,
          });
        }
        return {
          ...s,
          activeMeasurement: {
            ...s.activeMeasurement,
            clickCount: nextC,
            actionLog: log,
          },
        };
      });
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [measuring, session?.activeMeasurement, persist]);

  useEffect(() => {
    const s = sessionRef.current;
    if (!s || s.sessionCompletedAt || !introOpen) return;
    const tasks = getTasksForPhase(s);
    const idx = s.currentTaskIndex ?? 0;
    const task = tasks[idx];
    if (!task || task.successType !== "cartQuantity") return;
    const pid = Number(task.targetProductId);
    if (!Number.isFinite(pid)) return;
    const line = lines.find((l) => Number(l.productId) === pid);
    if (line) return;
    const p = getProductById(pid);
    if (!p) return;
    addToCart(pid, 1, { name: p.name, unitPrice: p.price });
    task7PreparedRef.current = true;
  }, [introOpen, lines, addToCart, session?.currentTaskIndex, session?.taskSetOrder]);

  const finalizeTask = useCallback(
    ({
      completed,
      skipped,
      autoCompleted,
      submittedAnswer,
      attemptsCount,
      preparedState,
    }) => {
      if (finishingTaskRef.current) return;
      const s = sessionRef.current;
      if (!s?.activeMeasurement) return;
      const phase = s.currentPhase;
      const tasks = getTasksForPhase(s);
      const idx = s.currentTaskIndex ?? 0;
      const task = tasks[idx];
      if (!task) return;

      const variant = phase === 1 ? s.phase1Variant : s.phase2Variant;
      const taskSet = getTaskSetNumberForPhase(s, phase);
      const taskSetOrder = s.taskSetOrder === "21" ? "21" : "12";
      const resultId = taskResultId(s.participantId, phase, variant, task.id);
      if (completedIdsRef.current.has(resultId)) {
        return;
      }
      finishingTaskRef.current = true;
      flushSync(() => setIsCompletingTask(true));
      try {
        const started = s.activeMeasurement.taskStartedAt;
        const completedAt = new Date().toISOString();
        const durationMs = new Date(completedAt) - new Date(started);
        const durationSeconds = Math.round((durationMs / 1000) * 100) / 100;
        const clicks = measureClicksRef.current;
        const logSlice = (s.activeMeasurement.actionLog ?? []).slice(0, 40);

        const prepForRow =
          task.successType === "cartQuantity"
            ? task7PreparedRef.current
            : Boolean(preparedState);

        const enteredSnap =
          task.successType === "checkoutFormFilled"
            ? getEnteredCheckoutSnapshot()
            : null;
        const checkoutDataMatched =
          task.successType === "checkoutFormFilled" && enteredSnap
            ? checkoutEnteredMatchesExpected(task, enteredSnap)
            : "";

        const row = {
          participantId: s.participantId,
          testOrder: s.testOrder,
          taskSetOrder,
          taskSet,
          phase,
          variant,
          taskId: task.id,
          taskTitle: task.title,
          taskInstruction: task.instruction,
          successType: task.successType,
          targetProductId: task.targetProductId ?? "",
          targetCategoryName: task.targetCategoryName ?? "",
          targetSection: task.targetSection ?? "",
          targetQuantity: task.targetQuantity ?? "",
          maxPrice: task.maxPrice ?? "",
          minPrice: task.minPrice ?? "",
          acceptedAnswers: Array.isArray(task.acceptedAnswers)
            ? task.acceptedAnswers.join("|")
            : "",
          submittedAnswer: submittedAnswer ?? "",
          attemptsCount: attemptsCount ?? 0,
          preparedState: prepForRow,
          expectedCheckoutData:
            task.successType === "checkoutFormFilled"
              ? JSON.stringify(task.checkoutTestData ?? {})
              : "",
          enteredCheckoutData:
            task.successType === "checkoutFormFilled" && enteredSnap
              ? JSON.stringify(enteredSnap)
              : "",
          checkoutDataMatched,
          taskStartedAt: started,
          taskCompletedAt: completedAt,
          durationSeconds,
          completed: Boolean(completed),
          skipped: Boolean(skipped),
          autoCompleted: Boolean(autoCompleted),
          clickCount: clicks,
          finalUrl: window.location.href,
          timestamp: completedAt,
          actionLog: logSlice,
        };

        const taskRuns = mergeTaskRunsWithDedupe(s.taskRuns, row, resultId);
        completedIdsRef.current.add(resultId);

        setMeasuring(false);
        measureClicksRef.current = 0;
        setClickCount(0);
        setInstructionPeekOpen(false);
        setAnswerDraft("");
        setAnswerError("");

        const lastInPhase = idx >= tasks.length - 1;

        const homeForCurrentVariant = homePathForVariant(
          phase === 1 ? s.phase1Variant : s.phase2Variant,
        );

        if (!lastInPhase) {
          commitSession({
            ...s,
            taskRuns,
            activeMeasurement: null,
            testUi: "outcome",
          });
          setOutcomeMeta({ skipped, completed, phase1End: false, sessionEnd: false });
          if (completed && !skipped) {
            navigate(homeForCurrentVariant, { replace: true });
          }
          return;
        }

        if (phase === 1) {
          const p1Done = completedAt;
          const phase1Payload = buildPhaseApiPayload(s, 1, p1Done, taskRuns);
          commitSession({
            ...s,
            taskRuns,
            activeMeasurement: null,
            phase1CompletedAt: p1Done,
            phaseResults: mergePhaseResults(s.phaseResults, phase1Payload),
            testUi: "outcome",
          });
          setOutcomeMeta({ phase1End: true, skipped, completed });
          if (completed && !skipped) {
            navigate(homeForCurrentVariant, { replace: true });
          }
          return;
        }

        const p2Done = completedAt;
        const startedAtMs = new Date(s.sessionStartedAt).getTime();
        const totalDurationSeconds =
          Math.round(((Date.now() - startedAtMs) / 1000) * 100) / 100;
        const phase2Payload = buildPhaseApiPayload(s, 2, p2Done, taskRuns);
        const nextBase = {
          ...s,
          taskRuns,
          activeMeasurement: null,
          phase2CompletedAt: p2Done,
          sessionCompletedAt: p2Done,
          sessionMeta: {
            ...(s.sessionMeta ?? {}),
            totalDurationSeconds,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
          },
          phaseResults: mergePhaseResults(s.phaseResults, phase2Payload),
          testUi: "outcome",
        };
        const sessionSummary = buildSessionApiPayload(nextBase);
        commitSession({
          ...nextBase,
          sessionSummary,
        });
        setOutcomeMeta({ sessionEnd: true, skipped, completed });
        if (completed && !skipped) {
          navigate(homeForCurrentVariant, { replace: true });
        }
      } finally {
        finishingTaskRef.current = false;
        setIsCompletingTask(false);
      }
    },
    [commitSession, navigate],
  );

  const beginCurrentTask = useCallback(() => {
    const s = sessionRef.current;
    if (!s || s.sessionCompletedAt || s.testUi !== "intro") return;
    const phase = s.currentPhase;
    const tasks = getTasksForPhase(s);
    const idx = s.currentTaskIndex ?? 0;
    const task = tasks[idx];
    if (!task) return;
    const startedAt = new Date().toISOString();
    measureClicksRef.current = 0;
    setClickCount(0);
    wrongAnswerStreakRef.current = 0;
    setMeasuring(true);
    setAnswerDraft("");
    setAnswerError("");
    persist((prev) => ({
      ...prev,
      testUi: "active",
      activeMeasurement: {
        taskId: task.id,
        taskStartedAt: startedAt,
        clickCount: 0,
        actionLog: [],
      },
    }));
  }, [persist]);

  const skipCurrentTask = useCallback(() => {
    if (!measuring || !sessionRef.current?.activeMeasurement) return;
    finalizeTask({
      completed: false,
      skipped: true,
      autoCompleted: false,
      submittedAnswer: "",
      attemptsCount: wrongAnswerStreakRef.current,
      preparedState: false,
    });
  }, [measuring, finalizeTask]);

  const submitAnswerInput = useCallback(() => {
    if (!measuring || !sessionRef.current?.activeMeasurement) return;
    const s = sessionRef.current;
    const tasks = getTasksForPhase(s);
    const idx = s.currentTaskIndex ?? 0;
    const task = tasks[idx];
    if (!task || task.successType !== "answerInput") return;
    const ok = answerMatchesAccepted(answerDraft, task.acceptedAnswers ?? []);
    if (!ok) {
      wrongAnswerStreakRef.current += 1;
      setAnswerError("Atbilde nav pareiza. Mēģiniet vēlreiz vai izlaidiet uzdevumu.");
      return;
    }
    const attemptsCount = wrongAnswerStreakRef.current + 1;
    const prepared =
      task.successType === "cartQuantity" ? task7PreparedRef.current : false;
    finalizeTask({
      completed: true,
      skipped: false,
      autoCompleted: true,
      submittedAnswer: answerDraft.trim(),
      attemptsCount,
      preparedState: prepared,
    });
  }, [measuring, answerDraft, finalizeTask]);

  const acknowledgeOutcome = useCallback(() => {
    const s = sessionRef.current;
    if (!s) return;
    if (outcomeMeta.phase1End) {
      commitSession({ ...s, testUi: "intro" });
      setOutcomeMeta({});
      navigate("/test/continue");
      return;
    }
    if (outcomeMeta.sessionEnd) {
      commitSession({ ...s, testUi: "intro" });
      setOutcomeMeta({});
      navigate("/test/complete");
      return;
    }
    const tasks = getTasksForPhase(s);
    const idx = s.currentTaskIndex ?? 0;
    if (idx >= tasks.length - 1) return;
    commitSession({
      ...s,
      currentTaskIndex: idx + 1,
      testUi: "intro",
      activeMeasurement: null,
    });
    setOutcomeMeta({});
  }, [commitSession, navigate, outcomeMeta]);

  useEffect(() => {
    if (!outcomeOpen || !outcomeMeta?.sessionEnd) return undefined;
    if (!isGoogleFormConfigured()) return undefined;
    const t = window.setTimeout(() => {
      acknowledgeOutcome();
    }, 2000);
    return () => window.clearTimeout(t);
  }, [outcomeOpen, outcomeMeta?.sessionEnd, acknowledgeOutcome]);

  const openInstructionPeek = useCallback(() => {
    if (measuring) setInstructionPeekOpen(true);
  }, [measuring]);

  const closeInstructionPeek = useCallback(() => {
    setInstructionPeekOpen(false);
  }, []);

  const elapsedSeconds = useCallback(() => {
    const s = sessionRef.current;
    const t = s?.activeMeasurement?.taskStartedAt;
    if (!t) return 0;
    return Math.floor((Date.now() - new Date(t).getTime()) / 1000);
  }, []);

  useEffect(() => {
    if (!measuring || isCompletingTask || !session?.activeMeasurement) return undefined;
    const s = sessionRef.current;
    const tasks = getTasksForPhase(s);
    const idx = s.currentTaskIndex ?? 0;
    const task = tasks[idx];
    if (!task || task.successType === "answerInput") return undefined;

    const cartPageOpen = pathname.includes("/grozs");
    const ok = evaluateAutoTaskSuccess({
      task,
      pathname,
      hash,
      lines,
      cartPageOpen,
    });
    if (!ok) return undefined;

    let cancelled = false;
    const t = window.setTimeout(() => {
      if (cancelled || finishingTaskRef.current) return;
      const prepared =
        task.successType === "cartQuantity" ? task7PreparedRef.current : false;
      finalizeTask({
        completed: true,
        skipped: false,
        autoCompleted: true,
        submittedAnswer: "",
        attemptsCount: 0,
        preparedState: prepared,
      });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [
    measuring,
    isCompletingTask,
    session?.activeMeasurement,
    session?.currentPhase,
    session?.taskSetOrder,
    pathname,
    hash,
    lines,
    finalizeTask,
  ]);

  const startNewSessionFromLanding = useCallback(
    (searchParams) => {
      clearAllCartAndCheckoutStorage();
      clearCart();
      task7PreparedRef.current = false;
      wrongAnswerStreakRef.current = 0;
      const testOrder = pickTestOrder(searchParams);
      const now = new Date().toISOString();
      const { phase1Variant, phase2Variant } = variantsFromOrder(testOrder);
      const taskSetOrder = pickTaskSetOrder(searchParams);
      const next = {
        participantId: genParticipantId(),
        testOrder,
        taskSetOrder,
        currentPhase: 1,
        currentVariant: phase1Variant,
        currentTaskIndex: 0,
        sessionStartedAt: now,
        phase1StartedAt: now,
        phase1CompletedAt: null,
        phase2StartedAt: null,
        phase2CompletedAt: null,
        sessionCompletedAt: null,
        phase1Variant,
        phase2Variant,
        taskRuns: [],
        phaseResults: [],
        sessionSummary: null,
        batchUploadFinishedAt: null,
        activeMeasurement: null,
        testUi: "intro",
        sessionMeta: {
          userAgent: navigator.userAgent,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        },
      };
      writeRawSession(next);
      setSession(next);
      setMeasuring(false);
      setClickCount(0);
      setOutcomeMeta({});
      return { session: next, homePath: homePathForVariant(phase1Variant) };
    },
    [clearCart],
  );

  const applyPhaseTwoTransition = useCallback(() => {
    const s = readRawSession();
    if (!s) return { path: "/" };
    clearAllCartAndCheckoutStorage();
    clearCart();
    task7PreparedRef.current = false;
    wrongAnswerStreakRef.current = 0;
    const now = new Date().toISOString();
    const next = {
      ...s,
      currentPhase: 2,
      currentVariant: s.phase2Variant,
      currentTaskIndex: 0,
      phase2StartedAt: now,
      activeMeasurement: null,
      testUi: "intro",
    };
    commitSession(next);
    setMeasuring(false);
    setClickCount(0);
    measureClicksRef.current = 0;
    return { path: homePathForVariant(s.phase2Variant) };
  }, [clearCart, commitSession]);

  const buildGoogleFormUrl = useCallback((sessionOverride) => {
    if (!isGoogleFormConfigured()) return null;
    const s = sessionOverride ?? readRawSession();
    if (!s?.participantId) return null;
    try {
      const u = new URL(GOOGLE_FORM_BASE_URL);
      u.searchParams.set("usp", "pp_url");
      u.searchParams.set(FORM_PARTICIPANT_ENTRY, s.participantId);
      u.searchParams.set(FORM_ORDER_ENTRY, s.testOrder);
      u.searchParams.set(FORM_PHASE1_VARIANT_ENTRY, s.phase1Variant);
      u.searchParams.set(FORM_PHASE2_VARIANT_ENTRY, s.phase2Variant);
      return u.toString();
    } catch {
      return null;
    }
  }, []);

  const downloadExports = useCallback(() => {
    downloadSessionJsonOnly();
    downloadSessionCsvOnly();
  }, []);

  const downloadExportJson = useCallback(() => {
    downloadSessionJsonOnly();
  }, []);

  const downloadExportCsv = useCallback(() => {
    downloadSessionCsvOnly();
  }, []);

  const value = useMemo(
    () => ({
      session,
      measuring,
      clickCount,
      isCompletingTask,
      showPanel: showChrome,
      showChrome,
      introOpen,
      outcomeOpen,
      outcomeMeta,
      instructionPeekOpen,
      answerDraft,
      setAnswerDraft: setAnswerDraftAndClearError,
      answerError,
      isTestResultsEndpointConfigured: isTestResultsEndpointConfigured(),
      isGoogleFormConfigured: isGoogleFormConfigured(),
      refreshFromStorage,
      resetEntireTest,
      startNewSessionFromLanding,
      applyPhaseTwoTransition,
      beginCurrentTask,
      acknowledgeOutcome,
      skipCurrentTask,
      submitAnswerInput,
      openInstructionPeek,
      closeInstructionPeek,
      elapsedSeconds,
      buildGoogleFormUrl,
      downloadExports,
      downloadExportJson,
      downloadExportCsv,
    }),
    [
      session,
      measuring,
      clickCount,
      isCompletingTask,
      showChrome,
      introOpen,
      outcomeOpen,
      outcomeMeta,
      instructionPeekOpen,
      answerDraft,
      answerError,
      refreshFromStorage,
      resetEntireTest,
      startNewSessionFromLanding,
      applyPhaseTwoTransition,
      beginCurrentTask,
      acknowledgeOutcome,
      skipCurrentTask,
      submitAnswerInput,
      openInstructionPeek,
      closeInstructionPeek,
      elapsedSeconds,
      buildGoogleFormUrl,
      downloadExports,
      downloadExportJson,
      downloadExportCsv,
      setAnswerDraftAndClearError,
    ],
  );

  return (
    <TestSessionContext.Provider value={value}>
      {children}
      {showChrome ? <UsabilityTestChrome /> : null}
    </TestSessionContext.Provider>
  );
}

export function useTestSession() {
  const ctx = useContext(TestSessionContext);
  if (!ctx) {
    throw new Error("useTestSession must be used within TestSessionProvider");
  }
  return ctx;
}
