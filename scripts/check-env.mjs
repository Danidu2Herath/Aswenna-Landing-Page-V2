/**
 * Refuses to build when a secret has been put somewhere the public can read.
 *
 * Vite inlines every VITE_* value into the JavaScript bundle at build time.
 * There is no server to withhold it and no decryption step in the browser, so
 * a secret given a VITE_ prefix is published to every visitor the moment the
 * site deploys — and encrypting the .env file does not change that, because
 * the build decrypts it before inlining.
 *
 * This is the one mistake that cannot be undone by a later commit: once a key
 * ships in a bundle it must be rotated. So the build stops here instead.
 *
 *   node scripts/check-env.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/* Name fragments that mean "this value must never reach a browser". Matched
   on the name only — values are never printed by this script. */
const SECRET_WORDS = [
  "SECRET", "PASSWORD", "PASSWD", "PRIVATE", "CREDENTIAL", "TOKEN",
  "APIKEY", "API_KEY", "ACCESS_KEY", "SECRET_KEY", "AUTH", "SIGNING",
  "SIGNATURE", "SESSION", "COOKIE", "DSN", "CONNECTION_STRING",
  "DATABASE_URL", "SMTP", "STRIPE", "TWILIO", "SENDGRID", "AWS_", "GCP_",
  "SERVICE_ACCOUNT", "WEBHOOK_SECRET", "ADMIN",
];

/* Names that contain a flagged word but are genuinely public, so the build is
   not blocked by a false positive. Keep this list short and justified. */
const ALLOWED = new Set([
  // A form relay's public form id or access key is designed to be in the
  // page: it identifies the form, it does not authorise anything else.
  "VITE_CONTACT_ENDPOINT",
  "VITE_WEB3FORMS_ACCESS_KEY",
]);

const looksSecret = (name) => SECRET_WORDS.some((w) => name.toUpperCase().includes(w));

function parse(file) {
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => l.slice(0, l.indexOf("=")).replace(/^export\s+/, "").trim())
    .filter(Boolean);
}

const files = [".env", ".env.local", ".env.production", ".env.staging", ".env.development"];
const problems = [];
const serverOnly = [];

for (const f of files) {
  for (const name of parse(join(root, f))) {
    if (!name.startsWith("VITE_")) {
      serverOnly.push(`${name} (${f})`);
      continue;
    }
    if (looksSecret(name) && !ALLOWED.has(name)) problems.push({ name, file: f });
  }
}

/* Also check the shipped bundle, which is the thing that is actually served.
   A value can reach it by a route this script cannot see in a .env file. */
const distDir = join(root, "dist/assets");
if (existsSync(distDir)) {
  const { readdirSync } = await import("node:fs");
  const js = readdirSync(distDir).filter((f) => f.endsWith(".js"));
  const PATTERNS = [
    [/\bsk_live_[A-Za-z0-9]{10,}/, "a Stripe live secret key"],
    [/\bsk-[A-Za-z0-9]{20,}/, "an OpenAI-style secret key"],
    [/\bghp_[A-Za-z0-9]{20,}/, "a GitHub personal access token"],
    [/\bAKIA[0-9A-Z]{16}\b/, "an AWS access key id"],
    [/\bAIza[0-9A-Za-z_-]{30,}/, "a Google API key"],
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "a private key block"],
    [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, "a Slack token"],
  ];
  for (const f of js) {
    const src = readFileSync(join(distDir, f), "utf8");
    for (const [re, what] of PATTERNS) {
      if (re.test(src)) problems.push({ name: `${what} found in dist/assets/${f}`, file: "the built bundle" });
    }
  }
}

if (problems.length) {
  console.error("\n  BUILD STOPPED — a secret would be published.\n");
  for (const p of problems) {
    console.error(`    ${p.name}`);
    console.error(`      in ${p.file}`);
  }
  console.error(`
  Vite writes every VITE_* value into the JavaScript it serves. Anything
  above would be readable with View Source on the live site.

  What to do:
    1. Rotate the key now if this has already been built or deployed.
    2. Drop the VITE_ prefix. A name without it is never inlined, and is
       read only by server-side code.
    3. Read it from a serverless function instead of the browser.
       docs/FORM-AND-SECRETS.md section 5 has working examples.

  If a name is genuinely public — a form id, a published endpoint — add it
  to ALLOWED in scripts/check-env.mjs with a comment saying why.
`);
  process.exit(1);
}

const n = files.filter((f) => existsSync(join(root, f))).length;
console.log(
  `env: ${n} file${n === 1 ? "" : "s"} checked, no secret exposed to the client` +
    (serverOnly.length ? ` (${serverOnly.length} server-only: ${serverOnly.join(", ")})` : ""),
);
