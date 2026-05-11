function appRootForPublicFiles() {
  let base = String(import.meta.env.BASE ?? "/").trim() || "/";

  if (base === "." || base === "./") base = "/";
  if (!base.startsWith("/")) base = `/${base}`;
  if (!base.endsWith("/")) base += "/";

  if (typeof window !== "undefined" && window.location.hostname.endsWith("github.io")) {
    const segs = window.location.pathname.split("/").filter(Boolean);
    if (base === "/" && segs.length >= 1) {
      base = `/${segs[0]}/`;
    }
  }

  return base;
}

export function publicUrl(path) {
  const raw = String(path ?? "").trim();

  if (!raw) return "";
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:")) return raw;

  const rel = raw.replace(/^\/+/, "");
  const base = appRootForPublicFiles();

  if (typeof window !== "undefined" && window.location?.origin) {
    try {
      return new URL(rel, new URL(base, window.location.origin)).href;
    } catch {
      /* fall through */
    }
  }

  const root = base.replace(/\/+$/, "") || "";

  if (!root || root === "/") return `/${rel}`;

  return `${root}/${rel}`;
}
