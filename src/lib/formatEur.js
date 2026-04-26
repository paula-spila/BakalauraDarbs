export function formatEur(amount) {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "";
  return new Intl.NumberFormat("lv-LV", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
