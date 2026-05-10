export function CartHeaderIcon() {
  return (
    <svg
      className="site-header__cart-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 3 7.5 7H21l-1.5 12H8L6.5 7H4"
      />
      <circle cx="10" cy="20" r="1.15" fill="currentColor" />
      <circle cx="17.5" cy="20" r="1.15" fill="currentColor" />
    </svg>
  );
}
