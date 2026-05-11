export const USABILITY_SESSION_STORAGE_KEY = "vienskarisimajam_usability_test_session_v1";
export const USABILITY_RESULT_BACKUP_KEY = "vienskarisimajam_usability_result_backup_v1";
const MAX_RESULT_BACKUP_ENTRIES = 400;
const CART_KEY_MIN = "vienskarisimajam_cart_v1";
const CART_KEY_RICH = "vienskarisimajam_cart_v1_rich";
const THANKS_MIN = "vienskarisimajam_checkout_thanks_v1";
const THANKS_RICH = "vienskarisimajam_checkout_thanks_v1_rich";

export function readRawSession() {
  try {
    const raw = localStorage.getItem(USABILITY_SESSION_STORAGE_KEY);

    if (!raw) return null;

    const data = JSON.parse(raw);

    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

export function writeRawSession(session) {
  try {
    localStorage.setItem(USABILITY_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch { }
}

export function clearRawSession() {
  try {
    localStorage.removeItem(USABILITY_SESSION_STORAGE_KEY);
  } catch { }
}

/**
 * @param {object} payload
 */
export function appendResultBackupPayload(payload) {
  try {
    const raw = localStorage.getItem(USABILITY_RESULT_BACKUP_KEY);
    let arr = [];

    if (raw) {
      const parsed = JSON.parse(raw);
      arr = Array.isArray(parsed) ? parsed : [];
    }

    arr.push(payload);

    while (arr.length > MAX_RESULT_BACKUP_ENTRIES) {
      arr.shift();
    }

    localStorage.setItem(USABILITY_RESULT_BACKUP_KEY, JSON.stringify(arr));
  } catch { }
}

export function markSessionBatchUploadFinished() {
  try {
    const s = readRawSession();

    if (!s?.sessionCompletedAt) return;

    writeRawSession({
      ...s,
      batchUploadFinishedAt: new Date().toISOString(),
    });

  } catch { }
}


export function clearAllCartAndCheckoutStorage() {
  try {
    localStorage.setItem(CART_KEY_MIN, "[]");
    localStorage.setItem(CART_KEY_RICH, "[]");
  } catch { }

  try {
    sessionStorage.removeItem(THANKS_MIN);
    sessionStorage.removeItem(THANKS_RICH);
  } catch { }
}

export { CART_KEY_MIN, CART_KEY_RICH };
