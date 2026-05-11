/**
 * @param {string} value
 * @returns {string}
 */
export function normalizeAnswer(value) {
  if (value == null) return "";
  let s = String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/\s+/g, " ").trim();
  return normalizePriceToken(s);
}

/**
 * @param {string} s
 */
function normalizePriceToken(s) {
  if (/[a-z]/.test(s)) return s;
  const m = s.match(/(\d+)(?:[.,](\d+))?/);
  if (!m) return s;
  const int = m[1].replace(/^0+(?=\d)/, "") || "0";
  const frac = m[2] ? m[2].replace(/0+$/, "") : "";
  if (!frac) return int;
  return `${int}.${frac}`;
}

/**
 * @param {string} input 
 * @param {string[]} accepted
 */
export function answerMatchesAccepted(input, accepted) {
  const n = normalizeAnswer(input);
  if (!n) return false;
  for (const a of accepted ?? []) {
    if (normalizeAnswer(a) === n) return true;
  }
  return false;
}
