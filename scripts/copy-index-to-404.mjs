/**
 * GitHub Pages serves 404.html for unknown paths. Copying the built
 * index.html lets the SPA boot on deep links (e.g. /BakalauraDarbs/test).
 */
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const indexHtml = join(dist, "index.html");
const notFoundHtml = join(dist, "404.html");

if (!existsSync(indexHtml)) {
  console.error("[copy-index-to-404] dist/index.html missing — run vite build first.");
  process.exit(1);
}

copyFileSync(indexHtml, notFoundHtml);
console.log("[copy-index-to-404] wrote dist/404.html");
