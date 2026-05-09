import { TEST_RESULTS_ENDPOINT } from "../config/usabilityTestEnv.js";
import { appendResultBackupPayload } from "./usabilityTestStorage.js";
import { getTaskSetNumberForPhase } from "../data/usabilityTestTasks.js";

let loggedEndpointStatus = false;

function logEndpointOnce() {
  if (!import.meta.env.DEV || loggedEndpointStatus) return;
  loggedEndpointStatus = true;
  const raw = (import.meta.env.VITE_TEST_RESULTS_ENDPOINT ?? "").trim();
  const configured = Boolean(raw);
  const preview = configured ? `${raw.slice(0, 24)}…` : "(empty)";
  console.log("[test-results] VITE_TEST_RESULTS_ENDPOINT configured:", configured, preview);
}

export function taskResultId(participantId, phase, variant, taskSet, taskId) {
  return `${participantId}-${phase}-${variant}-${taskSet}-${taskId}`;
}

export function phaseResultId(participantId, phase, variant, taskSet) {
  return `${participantId}-phase-${phase}-${variant}-${taskSet}`;
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

export function buildTaskApiPayload(row) {
  const resultId =
    row.resultId ??
    taskResultId(row.participantId, row.phase, row.variant, row.taskSet, row.taskId);
  return {
    type: "task",
    resultId,
    participantId: row.participantId,
    testOrder: row.testOrder,
    phase: row.phase,
    variant: row.variant,
    taskSet: row.taskSet,
    taskId: row.taskId,
    taskTitle: row.taskTitle,
    taskInstruction: row.taskInstruction,
    taskStartedAt: row.taskStartedAt,
    taskCompletedAt: row.taskCompletedAt,
    durationSeconds: row.durationSeconds,
    completed: row.completed,
    skipped: row.skipped,
    clickCount: row.clickCount,
    finalUrl: row.finalUrl,
    timestamp: row.timestamp,
  };
}

export function aggregatePhaseMetrics(taskRuns, phase) {
  const rows = taskRuns.filter((r) => r.phase === phase);
  return {
    completedTasks: rows.filter((r) => r.completed && !r.skipped).length,
    skippedTasks: rows.filter((r) => r.skipped).length,
    totalClicks: rows.reduce((a, r) => a + (Number(r.clickCount) || 0), 0),
  };
}

export function buildPhaseApiPayload(session, phase, phaseCompletedAt, taskRuns) {
  const variant = phase === 1 ? session.phase1Variant : session.phase2Variant;
  const taskSet = getTaskSetNumberForPhase(phase);
  const phaseStartedAt =
    phase === 1 ? session.phase1StartedAt : session.phase2StartedAt;
  const { completedTasks, skippedTasks, totalClicks } = aggregatePhaseMetrics(
    taskRuns,
    phase,
  );
  const durMs = new Date(phaseCompletedAt) - new Date(phaseStartedAt);
  const phaseDurationSeconds = Math.round((durMs / 1000) * 100) / 100;
  const resultId = phaseResultId(session.participantId, phase, variant, taskSet);
  return {
    type: "phase",
    resultId,
    participantId: session.participantId,
    testOrder: session.testOrder,
    phase,
    variant,
    taskSet,
    phaseStartedAt,
    phaseCompletedAt,
    phaseDurationSeconds,
    completedTasks,
    skippedTasks,
    totalClicks,
    timestamp: phaseCompletedAt,
  };
}

export function buildSessionApiPayload(next) {
  const meta = next.sessionMeta ?? {};
  const totalDurationSeconds =
    typeof meta.totalDurationSeconds === "number" ? meta.totalDurationSeconds : 0;
  const resultId = sessionResultId(next.participantId);
  return {
    type: "session",
    resultId,
    participantId: next.participantId,
    testOrder: next.testOrder,
    phase1Variant: next.phase1Variant,
    phase2Variant: next.phase2Variant,
    sessionStartedAt: next.sessionStartedAt,
    phase1StartedAt: next.phase1StartedAt,
    phase1CompletedAt: next.phase1CompletedAt,
    phase2StartedAt: next.phase2StartedAt,
    phase2CompletedAt: next.phase2CompletedAt,
    sessionCompletedAt: next.sessionCompletedAt,
    totalDurationSeconds,
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
        resultId: phaseResultId(p.participantId, p.phase, p.variant, p.taskSet),
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
