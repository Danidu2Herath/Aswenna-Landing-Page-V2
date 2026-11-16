/**
 * Writes the rendered page into dist/index.html.
 *
 * This is a single-page React app, so without this step the HTML a crawler
 * receives is a <head> and an empty <div id="app-root">. Google executes the
 * JavaScript and would get there eventually; Bing, social scrapers and most
 * AI crawlers are far less reliable about it, and the first paint waits for
 * a 330 kB bundle either way.
 *
 * Run after `vite build`:
 *   vite build --ssr src/entry-server.tsx --outDir dist-ssr
 *   node scripts/prerender.mjs
 *
 * The browser still mounts the real application over this markup — it is the
 * first paint and the index, not a replacement for the app. Nothing here is
 * interactive until React takes over, which is why the markup is generated
 * with renderToStaticMarkup and not hydrated: a hydration mismatch on a
 * media query would be a worse failure than rendering twice.
 */
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = join(root, "dist/index.html");

const { render } = await import(pathToFileURL(join(root, "dist-ssr/entry-server.js")).href);

/* React hoists resource hints to the front of the string. index.html already
   carries the ones that matter, and a <link> inside the body is noise. */
const body = render().replace(/^(?:<link\b[^>]*>)+/, "");

const html = readFileSync(indexPath, "utf8");
const MARKER = '<div id="app-root"></div>';
if (!html.includes(MARKER)) {
  throw new Error(`${MARKER} is missing from dist/index.html — nothing to pre-render into`);
}

writeFileSync(indexPath, html.replace(MARKER, `<div id="app-root">${body}</div>`));

/* The SSR bundle is a build artifact of this step alone. */
rmSync(join(root, "dist-ssr"), { recursive: true, force: true });

const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
console.log(`prerender: ${kb(body.length)} of markup into dist/index.html`);
