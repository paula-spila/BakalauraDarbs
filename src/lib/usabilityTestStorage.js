export const USABILITY_SESSION_STORAGE_KEY =
  "vienskarisimajam_usability_test_session_v1";

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
    localStorage.setItem(
      USABILITY_SESSION_STORAGE_KEY,
      JSON.stringify(session),
    );
  } catch {
    /* ignore */
  }
}

export function clearRawSession() {
  try {
    localStorage.removeItem(USABILITY_SESSION_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Notīra grozus, pateicības karodziņus — bez personas datu vākšanas. */
export function clearAllCartAndCheckoutStorage() {
  try {
    localStorage.setItem(CART_KEY_MIN, "[]");
    localStorage.setItem(CART_KEY_RICH, "[]");
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.removeItem(THANKS_MIN);
    sessionStorage.removeItem(THANKS_RICH);
  } catch {
    /* ignore */
  }
}

export { CART_KEY_MIN, CART_KEY_RICH };
