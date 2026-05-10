export function StarRow({ rating = 4, className = "" }) {
  const r = Math.min(5, Math.max(1, Math.round(Number(rating) || 4)));
  return (
    <span
      className={`star-row ${className}`.trim()}
      aria-hidden="true"
      title="Vērtējums — demonstrācija"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < r ? "star-row__s star-row__s--on" : "star-row__s"}
        >
          ★
        </span>
      ))}
    </span>
  );
}
