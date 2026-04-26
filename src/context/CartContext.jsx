import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

function readCart(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeCart(storageKey, lines) {
  localStorage.setItem(storageKey, JSON.stringify(lines));
}

const CartContext = createContext(null);

export function CartProvider({ children, storageKey }) {
  const [lines, setLines] = useState(() => readCart(storageKey));

  useEffect(() => {
    setLines(readCart(storageKey));
  }, [storageKey]);

  useEffect(() => {
    writeCart(storageKey, lines);
  }, [storageKey, lines]);

  useEffect(() => {
    function onStorage(e) {
      if (e.key !== storageKey || e.storageArea !== localStorage) return;
      setLines(readCart(storageKey));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const itemCount = useMemo(
    () => lines.reduce((s, l) => s + l.qty, 0),
    [lines],
  );

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.unitPrice * l.qty, 0),
    [lines],
  );

  const addToCart = useCallback((productId, qty, snapshot) => {
    const q = Math.max(1, Math.floor(Number(qty)) || 1);
    setLines((prev) => {
      const i = prev.findIndex((l) => l.productId === productId);
      if (i >= 0) {
        const next = [...prev];
        next[i] = {
          ...next[i],
          qty: next[i].qty + q,
          name: snapshot.name,
          unitPrice: snapshot.unitPrice,
        };
        return next;
      }
      return [
        ...prev,
        {
          productId,
          qty: q,
          name: snapshot.name,
          unitPrice: snapshot.unitPrice,
        },
      ];
    });
  }, []);

  const updateLineQty = useCallback((productId, qty) => {
    const q = Math.max(0, Math.floor(Number(qty)) || 0);
    setLines((prev) => {
      if (q === 0) return prev.filter((l) => l.productId !== productId);
      return prev.map((l) =>
        l.productId === productId ? { ...l, qty: q } : l,
      );
    });
  }, []);

  const removeLine = useCallback((productId) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      addToCart,
      updateLineQty,
      removeLine,
      clearCart,
    }),
    [
      lines,
      itemCount,
      subtotal,
      addToCart,
      updateLineQty,
      removeLine,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
