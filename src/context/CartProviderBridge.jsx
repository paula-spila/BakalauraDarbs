import { useLocation } from "react-router-dom";
import { CartProvider } from "./CartContext.jsx";

const KEY_MIN = "vienskarisimajam_cart_v1";
const KEY_RICH = "vienskarisimajam_cart_v1_rich";

export function CartProviderBridge({ children }) {
  const { pathname } = useLocation();
  const rich = pathname === "/rich" || pathname.startsWith("/rich/");
  const storageKey = rich ? KEY_RICH : KEY_MIN;
  return (
    <CartProvider key={storageKey} storageKey={storageKey}>
      {children}
    </CartProvider>
  );
}
