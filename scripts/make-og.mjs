/**
 * Renders public/images/og-cover.jpg - the 1200x630 card that WhatsApp,
 * LinkedIn, Facebook and X show when the link is shared.
 *
 *   npx --yes playwright@1 install chromium   # once, if you do not have it
 *   node scripts/make-og.mjs
 *
 * Playwright is only needed to REGENERATE the image; the committed PNG is all
 * the site itself requires, so it is not a dependency of the build.
 *
 * Built from the real site assets and tokens rather than designed separately,
 * so it cannot drift away from the page it links to.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const b64 = (p, mime) => `data:${mime};base64,${readFileSync(join(root, p)).toString("base64")}`;

const photo = b64("public/images/photos/hero-field.webp", "image/webp");
const mark = b64("public/images/logos/aswenna-mark.svg", "image/svg+xml");

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Inter:wght@400;500&display=swap">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: Inter, system-ui, sans-serif; }
  .card { position: relative; width: 1200px; height: 630px; background: #0E2715; overflow: hidden; }
  .photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .scrim {
    position: absolute; inset: 0;
    background:
      linear-gradient(105deg, rgba(14,39,21,0.95) 0%, rgba(14,39,21,0.86) 46%, rgba(14,39,21,0.42) 100%),
      radial-gradient(620px 420px at 86% 92%, rgba(47,124,71,0.42), transparent 70%);
  }
  .inner { position: relative; height: 100%; padding: 64px 72px; display: flex; flex-direction: column; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 16px; }
  .brand img { width: 56px; height: 56px; border-radius: 12px; }
  .brand b { font-family: "Plus Jakarta Sans", sans-serif; font-size: 34px; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
  .brand span { font-size: 17px; color: rgba(231,242,234,0.72); display: block; margin-top: 2px; letter-spacing: 0.01em; }
  h1 {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 72px; font-weight: 800; line-height: 1.04; letter-spacing: -0.035em;
    color: #fff; max-width: 15ch;
  }
  h1 em { font-style: normal; color: #7FC89B; }
  p { margin-top: 22px; font-size: 24px; line-height: 1.45; color: rgba(231,242,234,0.84); max-width: 34ch; }
  .foot { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .chip {
    padding: 10px 20px; border-radius: 999px; font-size: 17px; font-weight: 600;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: #EDF6EF;
  }
  .chip--solid { background: #2F7C47; border-color: #2F7C47; color: #fff; }
</style></head>
<body>
  <div class="card">
    <img class="photo" src="${photo}" alt="">
    <div class="scrim"></div>
    <div class="inner">
      <div class="brand">
        <img src="${mark}" alt="">
        <div><b>Aswenna</b><span>Agricultural Intelligence Platform</span></div>
      </div>
      <div>
        <h1>Smarter fields,<br><em>greater future.</em></h1>
        <p>IoT precision farming for Sri Lankan agriculture - soil, weather, irrigation and market intelligence.</p>
      </div>
      <div class="foot">
        <span class="chip chip--solid">Sri Lanka</span>
        <span class="chip">සිංහල · தமிழ் · English</span>
        <span class="chip">A project of Veyra Solutions</span>
      </div>
    </div>
  </div>
</body></html>`;

const tmp = join(root, "scripts/.og.html");
writeFileSync(tmp, html);

/* Resolve Playwright wherever it happens to live: a local dev dependency, or
   a global install. Fail with an instruction rather than a stack trace. */
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  try {
    const mod = await import("/opt/node-tools/node_modules/playwright/index.js");
    chromium = (mod.default ?? mod).chromium;
  } catch {
    console.error("make-og needs Playwright:  npm i -D playwright && npx playwright install chromium");
    process.exit(1);
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(`file://${tmp}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
// JPEG, not PNG: the same card is 85 KB instead of 670 KB, and a social
// card is a photograph, not a diagram.
await page.screenshot({ path: join(root, "public/images/og-cover.jpg"), type: "jpeg", quality: 86 });
await browser.close();
console.log("og: public/images/og-cover.jpg written (1200x630)");
