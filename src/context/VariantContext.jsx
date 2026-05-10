import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";

const VariantContext = createContext({
  pathPrefix: "",
  isRich: false,
  thanksSessionKey: "vienskarisimajam_checkout_thanks_v1",
});

export function VariantProvider({ children }) {
  const { pathname } = useLocation();
  const isRich = pathname === "/rich" || pathname.startsWith("/rich/");
  const value = useMemo(
    () => ({
      pathPrefix: isRich ? "/rich" : "",
      isRich,
      thanksSessionKey: isRich
        ? "vienskarisimajam_checkout_thanks_v1_rich"
        : "vienskarisimajam_checkout_thanks_v1",
    }),
    [isRich],
  );
  return (
    <VariantContext.Provider value={value}>{children}</VariantContext.Provider>
  );
}

export function useVariant() {
  return useContext(VariantContext);
}

export function usePrefixedTo() {
  const { pathPrefix } = useVariant();
  return useCallback(
    (path) => {
      if (path == null || path === "") return path;
      if (typeof path !== "string") return path;
      if (path.startsWith("http://") || path.startsWith("https://")) return path;
      const hashIdx = path.indexOf("#");
      const rawPath = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
      const hash = hashIdx >= 0 ? path.slice(hashIdx) : "";
      const normalized =
        rawPath === "" ? "/" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
      if (!pathPrefix) return normalized + hash;
      if (normalized === "/") return `${pathPrefix}${hash}`;
      return `${pathPrefix}${normalized}${hash}`;
    },
    [pathPrefix],
  );
}
