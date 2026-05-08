/**
 * Vite env: prefix with VITE_ and define in .env (see .env.example).
 * Google Forms entry keys are typically like "entry.1234567890".
 */

export const TEST_RESULTS_ENDPOINT =
  import.meta.env.VITE_TEST_RESULTS_ENDPOINT?.trim() ?? "";

export const GOOGLE_FORM_BASE_URL =
  import.meta.env.VITE_GOOGLE_FORM_BASE_URL?.trim() ?? "";

export const FORM_PARTICIPANT_ENTRY =
  import.meta.env.VITE_FORM_PARTICIPANT_ENTRY?.trim() ?? "";

export const FORM_ORDER_ENTRY =
  import.meta.env.VITE_FORM_ORDER_ENTRY?.trim() ?? "";

export const FORM_PHASE1_VARIANT_ENTRY =
  import.meta.env.VITE_FORM_PHASE1_VARIANT_ENTRY?.trim() ?? "";

export const FORM_PHASE2_VARIANT_ENTRY =
  import.meta.env.VITE_FORM_PHASE2_VARIANT_ENTRY?.trim() ?? "";

export function isTestResultsEndpointConfigured() {
  return Boolean(TEST_RESULTS_ENDPOINT);
}

export function isGoogleFormConfigured() {
  return Boolean(
    GOOGLE_FORM_BASE_URL &&
      FORM_PARTICIPANT_ENTRY &&
      FORM_ORDER_ENTRY &&
      FORM_PHASE1_VARIANT_ENTRY &&
      FORM_PHASE2_VARIANT_ENTRY,
  );
}
