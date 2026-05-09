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
import { getTasksForPhase } from "../data/usabilityTestTasks.js";
import {
  buildPhaseApiPayload,
  buildSessionApiPayload,
  mergePhaseResults,
  mergeTaskRunsWithDedupe,
  taskResultId,
} from "../lib/batchTestResults.js";
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
import { UsabilityTestPanel } from "../components/UsabilityTestPanel.jsx";
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

export function TestSessionProvider({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [session, setSession] = useState(() => readRawSession());
  const [measuring, setMeasuring] = useState(() => {
    const s = readRawSession();
    return Boolean(s?.activeMeasurement?.taskStartedAt);
  });
  const [clickCount, setClickCount] = useState(
    () => readRawSession()?.activeMeasurement?.clickCount ?? 0,
  );
  const [isCompletingTask, setIsCompletingTask] = useState(false);
  const sessionRef = useRef(session);
  const measureClicksRef = useRef(0);
  const finishingTaskRef = useRef(false);
  sessionRef.current = session;

  const commitSession = useCallback((next) => {
    sessionRef.current = next;
    writeRawSession(next);
    setSession(next);
  }, []);

  const persist = useCallback((updater) => {
    setSession((prev) => {
      const base = prev ? { ...prev } : {};
      const next = typeof updater === "function" ? updater(base) : updater;
      writeRawSession(next);
      return next;
    });
  }, []);

  const refreshFromStorage = useCallback(() => {
    setSession(readRawSession());
    const s = readRawSession();
    setMeasuring(Boolean(s?.activeMeasurement?.taskStartedAt));
    setClickCount(s?.activeMeasurement?.clickCount ?? 0);
  }, []);

  const resetEntireTest = useCallback(() => {
    clearRawSession();
    clearAllCartAndCheckoutStorage();
    clearCart();
    measureClicksRef.current = 0;
    setSession(null);
    setMeasuring(false);
    setClickCount(0);
  }, [clearCart]);

  const isTestPath =
    pathname === "/test" ||
    pathname === "/test/continue" ||
    pathname === "/test/complete";

  const awaitingPhase2Bridge =
    session &&
    session.currentPhase === 1 &&
    (session.currentTaskIndex ?? 0) >= 8 &&
    session.phase1CompletedAt &&
    !session.phase2StartedAt;

  const showPanel = Boolean(
    session &&
      !session.sessionCompletedAt &&
      !isTestPath &&
      !awaitingPhase2Bridge &&
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

  useEffect(() => {
    const active =
      Boolean(session) &&
      !session?.sessionCompletedAt &&
      !isTestPath;
    document.body.classList.toggle("usability-test-active", active);
    return () => document.body.classList.remove("usability-test-active");
  }, [session, isTestPath]);

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
      if (t && typeof t.closest === "function" && t.closest("[data-usability-panel]")) {
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

  const beginCurrentTask = useCallback(() => {
    const s = sessionRef.current;
    if (!s || s.sessionCompletedAt) return;
    const phase = s.currentPhase;
    const tasks = getTasksForPhase(phase);
    const idx = s.currentTaskIndex ?? 0;
    const task = tasks[idx];
    if (!task) return;
    const startedAt = new Date().toISOString();
    measureClicksRef.current = 0;
    setClickCount(0);
    setMeasuring(true);
    persist((prev) => ({
      ...prev,
      activeMeasurement: {
        taskId: task.id,
        taskStartedAt: startedAt,
        clickCount: 0,
        actionLog: [],
      },
    }));
  }, [persist]);

  const finishCurrentTask = useCallback(
    ({ completed, skipped }) => {
      if (finishingTaskRef.current) return;
      const s = sessionRef.current;
      if (!s?.activeMeasurement) return;
      const phase = s.currentPhase;
      const tasks = getTasksForPhase(phase);
      const idx = s.currentTaskIndex ?? 0;
      const task = tasks[idx];
      if (!task) return;

      finishingTaskRef.current = true;
      flushSync(() => setIsCompletingTask(true));
      try {
        const taskSet = phase === 1 ? 1 : 2;
        const variant = phase === 1 ? s.phase1Variant : s.phase2Variant;
        const started = s.activeMeasurement.taskStartedAt;
        const completedAt = new Date().toISOString();
        const durationMs = new Date(completedAt) - new Date(started);
        const durationSeconds = Math.round((durationMs / 1000) * 100) / 100;
        const clicks = measureClicksRef.current;
        const logSlice = (s.activeMeasurement.actionLog ?? []).slice(0, 40);
        const resultId = taskResultId(s.participantId, phase, variant, taskSet, task.id);
        const row = {
          participantId: s.participantId,
          testOrder: s.testOrder,
          phase,
          variant,
          taskSet,
          taskId: task.id,
          taskTitle: task.title,
          taskInstruction: task.instruction,
          taskStartedAt: started,
          taskCompletedAt: completedAt,
          durationSeconds,
          completed: Boolean(completed),
          skipped: Boolean(skipped),
          clickCount: clicks,
          finalUrl: window.location.href,
          timestamp: completedAt,
          expectedArea: task.expectedArea ?? "",
          actionLog: logSlice,
        };

        setMeasuring(false);
        measureClicksRef.current = 0;

        const taskRuns = mergeTaskRunsWithDedupe(s.taskRuns, row, resultId);
        const nextIdx = idx + 1;
        const isLastTaskInPhase = idx === 7;

        if (!isLastTaskInPhase) {
          const next = {
            ...s,
            taskRuns,
            currentTaskIndex: nextIdx,
            activeMeasurement: null,
          };
          commitSession(next);
          setClickCount(0);
          return;
        }

        if (phase === 1) {
          const p1Done = completedAt;
          const phase1Payload = buildPhaseApiPayload(s, 1, p1Done, taskRuns);
          const next = {
            ...s,
            taskRuns,
            currentTaskIndex: 8,
            activeMeasurement: null,
            phase1CompletedAt: p1Done,
            phaseResults: mergePhaseResults(s.phaseResults, phase1Payload),
          };
          commitSession(next);
          setClickCount(0);
          navigate("/test/continue");
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
          currentTaskIndex: 8,
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
        };
        const sessionSummary = buildSessionApiPayload(nextBase);
        const next = {
          ...nextBase,
          sessionSummary,
        };
        commitSession(next);
        setClickCount(0);
        navigate("/test/complete");
      } finally {
        finishingTaskRef.current = false;
        setIsCompletingTask(false);
      }
    },
    [commitSession, navigate],
  );

  const completeCurrentTask = useCallback(() => {
    finishCurrentTask({ completed: true, skipped: false });
  }, [finishCurrentTask]);

  const skipCurrentTask = useCallback(() => {
    finishCurrentTask({ completed: false, skipped: true });
  }, [finishCurrentTask]);

  const startNewSessionFromLanding = useCallback(
    (searchParams) => {
      const testOrder = pickTestOrder(searchParams);
      const now = new Date().toISOString();
      const { phase1Variant, phase2Variant } = variantsFromOrder(testOrder);
      const next = {
        participantId: genParticipantId(),
        testOrder,
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
      return { session: next, homePath: homePathForVariant(phase1Variant) };
    },
    [],
  );

  const applyPhaseTwoTransition = useCallback(() => {
    const s = readRawSession();
    if (!s) return { path: "/" };
    clearAllCartAndCheckoutStorage();
    clearCart();
    const now = new Date().toISOString();
    const next = {
      ...s,
      currentPhase: 2,
      currentVariant: s.phase2Variant,
      currentTaskIndex: 0,
      phase2StartedAt: now,
      activeMeasurement: null,
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
      showPanel,
      isTestResultsEndpointConfigured: isTestResultsEndpointConfigured(),
      isGoogleFormConfigured: isGoogleFormConfigured(),
      refreshFromStorage,
      resetEntireTest,
      startNewSessionFromLanding,
      applyPhaseTwoTransition,
      beginCurrentTask,
      completeCurrentTask,
      skipCurrentTask,
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
      showPanel,
      refreshFromStorage,
      resetEntireTest,
      startNewSessionFromLanding,
      applyPhaseTwoTransition,
      beginCurrentTask,
      completeCurrentTask,
      skipCurrentTask,
      buildGoogleFormUrl,
      downloadExports,
      downloadExportJson,
      downloadExportCsv,
    ],
  );

  return (
    <TestSessionContext.Provider value={value}>
      {children}
      {showPanel ? <UsabilityTestPanel /> : null}
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
