/**
 * Builds images/icons.svg — one <symbol> per icon the page uses.
 *
 * Geometry is lifted from an installed `lucide-react` so the shapes are the
 * real thing rather than hand-redrawn. Run it only when the icon list changes:
 *   node scripts/build-icons.mjs [path-to-lucide-react]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PKG = process.argv[2] || "/home/user/aswenna-landing/node_modules/lucide-react";
const DIR = join(PKG, "dist/esm/icons");

/** name used in content.js -> lucide icon file name */
const ICONS = {
  "droplets": "droplets", "droplet": "droplet", "cloud-rain": "cloud-rain", "cloud-sun": "cloud-sun",
  "languages": "languages", "wifi-off": "wifi-off", "message-square": "message-square",
  "message-circle": "message-circle", "shield-check": "shield-check", "map-pin": "map-pin",
  "thermometer": "thermometer", "zap": "zap", "flask": "flask-conical", "sprout": "sprout",
  "leaf": "leaf", "bug": "bug", "wheat": "wheat", "map": "map", "satellite": "satellite",
  "radar": "radar", "radio-tower": "radio-tower", "layers": "layers", "brain": "brain-circuit",
  "grid": "layout-grid", "cpu": "cpu", "waves": "waves", "gauge": "gauge", "users": "users",
  "database": "database", "scan": "scan-search", "trending-up": "trending-up",
  "calendar": "calendar-range", "signal-low": "signal-low", "phone-call": "phone-call",
  "plug": "plug", "sun": "sun-medium", "check": "check", "x": "x", "arrow-right": "arrow-right",
  "arrow-down": "arrow-down", "arrow-up": "arrow-up", "arrow-up-right": "arrow-up-right", "chevron-down": "chevron-down",
  "globe": "globe", "menu": "menu", "plus": "plus", "minus": "minus", "info": "info",
  "refresh": "refresh-cw", "rotate-ccw": "rotate-ccw", "star": "star", "send": "send",
  "hand": "hand", "mail": "mail", "phone": "phone", "building": "building-2",
  "bell": "bell", "bell-ring": "bell-ring", "battery": "battery-medium",
  "chevron-right": "chevron-right", "chevron-left": "chevron-left", "search": "search",
  "wifi": "wifi", "house": "house", "circle-check": "circle-check-big",
  "triangle-alert": "triangle-alert", "sliders": "sliders-horizontal", "ellipsis": "ellipsis",
  "clock": "clock", "list-checks": "list-checks", "pencil": "pencil", "share": "share-2",
  "chart": "chart-column", "crosshair": "crosshair", "snowflake": "snowflake",
  "umbrella": "umbrella", "wind": "wind", "banknote": "banknote",
};

const extract = (file, depth = 0) => {
  const src = readFileSync(file, "utf8");
  const start = src.indexOf("const __iconData");
  if (start === -1) {
    // Some entries are alias stubs that re-export another icon; follow them.
    const alias = /from\s+["'](\.\/[^"']+\.mjs)["']/.exec(src);
    if (alias && depth < 4) return extract(join(DIR, alias[1].replace("./", "")), depth + 1);
    throw new Error(`no icon data in ${file}`);
  }
  const open = src.indexOf("{", start);
  // walk braces to find the end of the object literal
  let brace = 0, end = open;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") brace++;
    else if (src[i] === "}") { brace--; if (brace === 0) { end = i + 1; break; } }
  }
  // eslint-disable-next-line no-new-func
  return new Function(`return ${src.slice(open, end)}`)().node;
};

const attrs = (o) =>
  Object.entries(o).filter(([k]) => k !== "key").map(([k, v]) => `${k}="${v}"`).join(" ");

const symbols = [];
const missing = [];
for (const [name, file] of Object.entries(ICONS)) {
  const path = join(DIR, `${file}.mjs`);
  if (!existsSync(path)) { missing.push(`${name} (${file})`); continue; }
  const node = extract(path);
  const body = node.map(([tag, a]) => `<${tag} ${attrs(a)}/>`).join("");
  symbols.push(`<symbol id="i-${name}" viewBox="0 0 24 24">${body}</symbol>`);
}

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true"><defs>
<style>symbol{fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}</style>
${symbols.join("\n")}
</defs></svg>`;

writeFileSync(new URL("../public/images/icons.svg", import.meta.url), sprite);
console.log(`icons: ${symbols.length} written`);
if (missing.length) console.log("MISSING:", missing.join(", "));
