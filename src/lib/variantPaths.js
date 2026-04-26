/** Paths for switching A ↔ B while staying on the same logical page (minimal vs /rich/…). */
export function pathsForVariantToggle(pathname, search = "") {
  const isRich = pathname === "/rich" || pathname.startsWith("/rich/");

  let pathA;
  let pathB;

  if (isRich) {
    const rest =
      pathname === "/rich" || pathname === "/rich/"
        ? "/"
        : pathname.slice("/rich".length) || "/";
    pathA = rest + search;
    pathB = pathname + search;
  } else {
    pathA = pathname + search;
    pathB = "/rich" + (pathname === "/" ? "" : pathname) + search;
  }

  return { pathA, pathB, isRich };
}
