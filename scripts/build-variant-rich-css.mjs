/**
 * Generates src/variants/rich/theme.css from non-minimalist-version/src/index.css
 * by prefixing selectors with .variant-rich (keeps html / * / keyframes).
 * Run: node scripts/build-variant-rich-css.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcPath = path.join(root, "scripts", "rich-variant-source.css");
const outPath = path.join(root, "src", "variants", "rich", "theme.css");

const file = fs.readFileSync(srcPath, "utf8");
const ast = postcss.parse(file, { from: srcPath });

function prefixSelector(sel) {
  return sel
    .split(/,(?![^(]*\))/)
    .map((p) => {
      const s = p.trim();
      if (!s) return s;
      if (s.startsWith(".variant-rich")) return s;
      if (s === "html" || s.startsWith("html ")) return s;
      if (s === "*" || s.startsWith("*,") || s.startsWith("*::")) return s;
      if (s.startsWith(":where(") || s.startsWith(":is(")) return `.variant-rich ${s}`;
      if (s === ":root") return ".variant-rich";
      if (s === "body" || s === "body.mce-content-body") return ".variant-rich";
      if (s === "#root") {
        return ".variant-rich .app-wrap";
      }
      return `.variant-rich ${s}`;
    })
    .join(", ");
}

ast.walkAtRules((at) => {
  if (at.name === "keyframes") {
    at.walkRules((rule) => {
      /* keep keyframe selectors */
    });
  }
});

ast.walkRules((rule) => {
  let p = rule.parent;
  while (p) {
    if (p.type === "atrule" && p.name === "keyframes") return;
    p = p.parent;
  }
  rule.selector = prefixSelector(rule.selector);
});

let css = ast.toString();

// #root rule may now target .variant-rich .app-wrap with duplicate flex — normalize
css = css.replace(
  /\.variant-rich \.app-wrap\s*\{[^}]*min-height:\s*100vh[^}]*\}/gs,
  `.variant-rich .app-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}`,
);

const header = `/* Auto-generated — run: node scripts/build-variant-rich-css.mjs */\n`;
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${header}${css}\n`, "utf8");
console.log("Wrote", path.relative(root, outPath));
