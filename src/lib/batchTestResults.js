import { TEST_RESULTS_ENDPOINT } from "../config/usabilityTestEnv.js";
import { getTaskSetNumberForPhase } from "../data/usabilityTestTasks.js";
import { appendResultBackupPayload } from "./usabilityTestStorage.js";

let loggedEndpointStatus = false;

function logEndpointOnce() {
  if (!import.meta.env.DEV || loggedEndpointStatus) return;
  loggedEndpointStatus = true;
  const raw = (import.meta.env.VITE_TEST_RESULTS_ENDPOINT ?? "").trim();
  const configured = Boolean(raw);
  const preview = configured ? `${raw.slice(0, 24)}…` : "(empty)";
  console.log("[test-results] VITE_TEST_RESULTS_ENDPOINT configured:", configured, preview);
}

/** @param {string|number} taskId */
export function taskResultId(participantId, phase, variant, taskId) {
  return `${participantId}-${phase}-${variant}-${taskId}`;
}

export function phaseResultId(participantId, phase, variant) {
  return `${participantId}-phase-${phase}-${variant}`;
}

export function sessionResultId(participantId) {
  return `${participantId}-session`;
}

/**
 * @param {object[]} prevRuns
 * @param {object} row
 * @param {string} resultId
 * @returns {object[]}
 */
export function mergeTaskRunsWithDedupe(prevRuns, row, resultId) {
  const arr = [...(prevRuns ?? [])];
  const idx = arr.findIndex((r) => r.resultId === resultId);
  if (import.meta.env.DEV) {
    if (idx >= 0) {
      console.log("[test-results] duplicate task ignored", resultId);
    } else {
      console.log("[test-results] task saved locally", resultId);
    }
  }
  const stamped = { ...row, resultId };
  if (idx >= 0) arr[idx] = stamped;
  else arr.push(stamped);
  return arr;
}

/**
 * @param {object} row
 */
export function buildTaskApiPayload(row) {
  const resultId =
    row.resultId ??
    taskResultId(row.participantId, row.phase, row.variant, row.taskId);
  return {
    type: "task",
    resultId,
    participantId: row.participantId,
    testOrder: row.testOrder,
    taskSetOrder: row.taskSetOrder ?? "",
    taskSet: row.taskSet ?? "",
    phase: row.phase,
    variant: row.variant,
    taskId: row.taskId,
    taskTitle: row.taskTitle,
    taskInstruction: row.taskInstruction,
    successType: row.successType ?? "",
    targetProductId: row.targetProductId ?? "",
    targetCategoryName: row.targetCategoryName ?? "",
    targetSection: row.targetSection ?? "",
    targetQuantity: row.targetQuantity ?? "",
    maxPrice: row.maxPrice ?? "",
    minPrice: row.minPrice ?? "",
    acceptedAnswers: row.acceptedAnswers ?? "",
    submittedAnswer: row.submittedAnswer ?? "",
    attemptsCount: row.attemptsCount ?? "",
    preparedState: row.preparedState ?? "",
    expectedCheckoutData: row.expectedCheckoutData ?? "",
    enteredCheckoutData: row.enteredCheckoutData ?? "",
    checkoutDataMatched: row.checkoutDataMatched ?? "",
    taskStartedAt: row.taskStartedAt,
    taskCompletedAt: row.taskCompletedAt,
    durationSeconds: row.durationSeconds,
    completed: row.completed,
    skipped: row.skipped,
    autoCompleted: row.autoCompleted ?? "",
    clickCount: row.clickCount,
    finalUrl: row.finalUrl,
    timestamp: row.timestamp,
  };
}

export function aggregatePhaseMetrics(taskRuns, phase) {
  const rows = taskRuns.filter((r) => r.phase === phase);
  const durations = rows
    .map((r) => Number(r.durationSeconds))
    .filter((n) => Number.isFinite(n) && n >= 0);
  const avg =
    durations.length > 0
      ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 100) / 100
      : 0;
  return {
    completedTasks: rows.filter((r) => r.completed && !r.skipped).length,
    skippedTasks: rows.filter((r) => r.skipped).length,
    totalClicks: rows.reduce((a, r) => a + (Number(r.clickCount) || 0), 0),
    averageTaskDurationSeconds: avg,
  };
}

export function buildPhaseApiPayload(session, phase, phaseCompletedAt, taskRuns) {
  const variant = phase === 1 ? session.phase1Variant : session.phase2Variant;
  const phaseStartedAt =
    phase === 1 ? session.phase1StartedAt : session.phase2StartedAt;
  const { completedTasks, skippedTasks, totalClicks, averageTaskDurationSeconds } =
    aggregatePhaseMetrics(taskRuns, phase);
  const durMs = new Date(phaseCompletedAt) - new Date(phaseStartedAt);
  const phaseDurationSeconds = Math.round((durMs / 1000) * 100) / 100;
  const resultId = phaseResultId(session.participantId, phase, variant);
  const taskSet = getTaskSetNumberForPhase(session, phase);
  return {
    type: "phase",
    resultId,
    participantId: session.participantId,
    testOrder: session.testOrder,
    taskSetOrder: session.taskSetOrder === "21" ? "21" : "12",
    taskSet,
    phase,
    variant,
    phaseStartedAt,
    phaseCompletedAt,
    phaseDurationSeconds,
    completedTasks,
    skippedTasks,
    totalClicks,
    averageTaskDurationSeconds,
    timestamp: phaseCompletedAt,
  };
}

export function buildSessionApiPayload(next) {
  const meta = next.sessionMeta ?? {};
  const totalDurationSeconds =
    typeof meta.totalDurationSeconds === "number" ? meta.totalDurationSeconds : 0;
  const resultId = sessionResultId(next.participantId);
  const runs = Array.isArray(next.taskRuns) ? next.taskRuns : [];
  const totalCompletedTasks = runs.filter((r) => r.completed && !r.skipped).length;
  const totalSkippedTasks = runs.filter((r) => r.skipped).length;
  const totalClicks = runs.reduce((a, r) => a + (Number(r.clickCount) || 0), 0);
  const taskSetOrder = next.taskSetOrder === "21" ? "21" : "12";
  return {
    type: "session",
    resultId,
    participantId: next.participantId,
    testOrder: next.testOrder,
    taskSetOrder,
    phase1TaskSet: getTaskSetNumberForPhase(next, 1),
    phase2TaskSet: getTaskSetNumberForPhase(next, 2),
    phase1Variant: next.phase1Variant,
    phase2Variant: next.phase2Variant,
    sessionStartedAt: next.sessionStartedAt,
    phase1StartedAt: next.phase1StartedAt,
    phase1CompletedAt: next.phase1CompletedAt,
    phase2StartedAt: next.phase2StartedAt,
    phase2CompletedAt: next.phase2CompletedAt,
    sessionCompletedAt: next.sessionCompletedAt,
    totalDurationSeconds,
    totalCompletedTasks,
    totalSkippedTasks,
    totalClicks,
    userAgent: meta.userAgent ?? navigator.userAgent,
    viewportWidth: meta.viewportWidth ?? window.innerWidth,
    viewportHeight: meta.viewportHeight ?? window.innerHeight,
    timestamp: next.sessionCompletedAt,
  };
}

export function mergePhaseResults(existing, phasePayload) {
  const ex = Array.isArray(existing) ? [...existing] : [];
  const i = ex.findIndex((p) => p.phase === phasePayload.phase);
  if (i >= 0) ex[i] = phasePayload;
  else ex.push(phasePayload);
  return ex.sort((a, b) => a.phase - b.phase);
}

/**
 * @param {object} session
 */
export function buildBatchPayload(session) {
  const tasks = (session.taskRuns ?? []).map((row) => buildTaskApiPayload(row));
  const phases = (session.phaseResults ?? []).map((p) =>
    p.resultId
      ? p
      : {
          ...p,
          resultId: phaseResultId(p.participantId, p.phase, p.variant),
        },
  );
  let sessionObj = session.sessionSummary ?? null;
  if (sessionObj && !sessionObj.resultId && session.participantId) {
    sessionObj = { ...sessionObj, resultId: sessionResultId(session.participantId) };
  }
  return {
    type: "batch",
    participantId: session.participantId,
    testOrder: session.testOrder,
    tasks,
    phases,
    session: sessionObj,
  };
}

export function submitBatchResultsNonBlocking(session, { onSettled } = {}) {
  logEndpointOnce();
  const batch = buildBatchPayload(session);
  appendResultBackupPayload(batch);

  const endpoint = TEST_RESULTS_ENDPOINT;
  if (!endpoint) {
    if (import.meta.env.DEV) {
      console.log("[test-results] batch skipped (no endpoint); backup saved");
    }
    onSettled?.("no_endpoint");
    return;
  }

  if (import.meta.env.DEV) {
    console.log(
      "[test-results] sending batch",
      batch.participantId,
      batch.tasks.length,
      batch.phases.length,
    );
  }

  Promise.resolve()
    .then(() =>
      fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(batch),
      }),
    )
    .then(() => {
      if (import.meta.env.DEV) {
        console.log("[test-results] batch send attempted");
      }
      onSettled?.("sent");
    })
    .catch((err) => {
      if (import.meta.env.DEV) {
        console.error("[test-results] batch send failed", err);
      }
      onSettled?.("failed");
    });
}
