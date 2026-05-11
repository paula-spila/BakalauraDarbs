import { USABILITY_SESSION_STORAGE_KEY } from "./usabilityTestStorage.js";

const CSV_COLUMNS = [
  "resultId",
  "participantId",
  "testOrder",
  "taskSetOrder",
  "taskSet",
  "phase",
  "variant",
  "taskId",
  "taskTitle",
  "taskInstruction",
  "successType",
  "targetProductId",
  "targetCategoryName",
  "targetSection",
  "targetSort",
  "targetQuantity",
  "maxPrice",
  "minPrice",
  "acceptedAnswers",
  "submittedAnswer",
  "attemptsCount",
  "preparedState",
  "expectedCheckoutData",
  "enteredCheckoutData",
  "checkoutDataMatched",
  "taskStartedAt",
  "taskCompletedAt",
  "durationSeconds",
  "completed",
  "skipped",
  "autoCompleted",
  "clickCount",
  "finalUrl",
  "timestamp",
];

function csvEscape(value) {
  const s = value === null || value === undefined
    ? ""
    : typeof value === "string"
      ? value
      : String(value);

  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;

  return s;
}

function rowFromTask(t) {
  return CSV_COLUMNS.map((col) => csvEscape(t[col] ?? ""));
}

/**
 * @param {{ taskRuns?: object[], sessionMeta?: object }} session
 */
function buildTasksCsv(session) {
  const rows = [CSV_COLUMNS.join(",")];
  const runs = Array.isArray(session?.taskRuns) ? session.taskRuns : [];

  for (const t of runs) {
    if (t._attemptsOnly) continue;
    rows.push(rowFromTask(t).join(","));
  }

  return rows.join("\r\n");
}

function buildSessionJsonBlob(session) {
  return JSON.stringify(session ?? {}, null, 2);
}

function triggerDownload(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadSessionJsonOnly() {
  try {
    const raw = localStorage.getItem(USABILITY_SESSION_STORAGE_KEY);

    if (!raw) return false;

    const session = JSON.parse(raw);
    const pid = session?.participantId ?? "session";

    triggerDownload(
      `usability-test-${pid}.json`,
      buildSessionJsonBlob(session),
      "application/json;charset=utf-8",
    );

    return true;
  } catch {
    return false;
  }
}

export function downloadSessionCsvOnly() {
  try {
    const raw = localStorage.getItem(USABILITY_SESSION_STORAGE_KEY);

    if (!raw) return false;

    const session = JSON.parse(raw);
    const pid = session?.participantId ?? "session";

    triggerDownload(
      `usability-test-${pid}.csv`,
      buildTasksCsv(session),
      "text/csv;charset=utf-8",
    );

    return true;
  } catch {
    return false;
  }
}
