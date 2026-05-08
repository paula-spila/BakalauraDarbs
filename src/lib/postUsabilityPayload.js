import { TEST_RESULTS_ENDPOINT } from "../config/usabilityTestEnv.js";

/**
 * POST JSON uz Google Apps Script Web App. Kļūdas gadījumā klusē — dati jau localStorage.
 * @param {object} body
 * @returns {Promise<boolean>} true ja veiksmīgi vai nav endpoint
 */
export async function postUsabilityPayload(body) {
  const url = TEST_RESULTS_ENDPOINT;
  if (!url) return true;
  try {
    const res = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}
