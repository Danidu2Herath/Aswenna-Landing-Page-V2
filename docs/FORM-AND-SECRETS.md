# The contact form, credentials, and what can actually be hidden

Everything about the enquiry form: how to point it at an inbox, where each
credential belongs, and — the part most guides get wrong — what a visitor can
read out of the site no matter what you do.

Read §1 to set the form up. Read §4 before you put any key anywhere.

---

## Contents

1. [Set up the form](#1-set-up-the-form)
2. [Which service to use](#2-which-service-to-use)
3. [Where every credential lives](#3-where-every-credential-lives)
4. [What `VITE_` really means](#4-what-vite_-really-means)
5. [Holding a real secret: the serverless step](#5-holding-a-real-secret-the-serverless-step)
6. [Precautions and what to do if a key leaks](#6-precautions-and-what-to-do-if-a-key-leaks)
7. [Can anyone read our code in DevTools?](#7-can-anyone-read-our-code-in-devtools)
8. [Checklist before launch](#8-checklist-before-launch)

---

## 1. Set up the form

The site is static. There is no server of ours, so the form hands the
submission to a relay service that emails it on.

### Step 1 — create your env file

```bash
cp .env.example .env
```

`.env` is gitignored and must never be committed. `.env.example` is the
committed template with no real values in it.

### Step 2 — fill it in

```bash
VITE_SITE_URL=https://aswenna.lk
VITE_CONTACT_ENDPOINT=https://formsubmit.co/ajax/info@veyra.lk
VITE_CONTACT_TIMEOUT_MS=15000
```

| Variable | What it does |
| --- | --- |
| `VITE_SITE_URL` | canonical origin. Feeds canonical URLs, `sitemap.xml`, `robots.txt`, Open Graph and the structured data. No trailing slash. |
| `VITE_CONTACT_ENDPOINT` | where the form POSTs. Must accept a JSON body and answer 2xx. |
| `VITE_CONTACT_TIMEOUT_MS` | how long to wait before showing the error panel. |

### Step 3 — activate the inbox (required, easy to forget)

FormSubmit needs no API key, but it will not send anything until the address
is confirmed **once**:

1. Deploy the site.
2. Submit the form yourself on the live site.
3. FormSubmit emails `info@veyra.lk` — click the activation link in it.

**Until that is done every submission fails** and visitors see the error
panel. It cannot be done from localhost; FormSubmit needs the live origin.

### Step 4 — set the same variables on your host

Netlify, Vercel, Cloudflare Pages and GitHub Actions each have a place to set
build environment variables. Set them there and you do not need a `.env` file
in the build image at all — a host variable wins over the file.

- **Netlify** — Site configuration → Environment variables
- **Vercel** — Project → Settings → Environment Variables
- **Cloudflare Pages** — Settings → Environment variables → Production
- **GitHub Actions** — Settings → Secrets and variables → Actions → Variables

The build fails loudly if `VITE_SITE_URL` is missing, naming the variable and
the command that fixes it, so a misconfigured deploy cannot ship silently.

### Step 5 — verify

```bash
npm run build && npm run preview
```

Submit the form. You should get the success panel, and the enquiry should
arrive in the inbox within a minute or two.

---

## 2. Which service to use

Changing service is a one-line change to `VITE_CONTACT_ENDPOINT`. No code.

| Service | Key needed? | Notes |
| --- | --- | --- |
| **FormSubmit** (current) | No | Free, no account. The inbox address is part of the URL, so it is public. One-time activation. |
| **Formspree** | No — form ID only | `https://formspree.io/f/YOUR_FORM_ID`. The ID is public but reveals no address. Free tier is limited per month. |
| **Web3Forms** | Yes — an access key | `https://api.web3forms.com/submit`, key sent in the body. The key is public too (see §4) but reveals no address and can be rotated. |
| **Your own endpoint** | Your choice | §5. The only option that can hold a real secret. |

**If you do not want `info@veyra.lk` visible in the page source, FormSubmit is
the wrong choice** — the address is literally in the URL. Formspree or
Web3Forms hide the destination behind an opaque ID.

---

## 3. Where every credential lives

The rule: **nothing secret is ever typed into a file that git tracks.**

| What | Where it goes | Committed? |
| --- | --- | --- |
| `VITE_*` values for local work | `.env` | No — gitignored |
| `VITE_*` values for production | the host's environment variables UI | No |
| The list of variable names and what they do | `.env.example` | Yes — no real values |
| A genuine secret (SMTP password, API key with write access, database URL) | the host's **secret** store, read by a server function | No — and never in a `VITE_` variable |

`.gitignore` covers every `.env` variant (`.env`, `.env.production`,
`.env.staging`, …) rather than a hand-listed few, plus `*.pem`, `*.key`,
`id_rsa`, `secrets.json`, `credentials.json`, `service-account*.json`,
`.npmrc` and `.netrc`. The gap that bites is always the file nobody listed.

Verify any file before you create it:

```bash
git check-ignore -v .env.production
```

No output means **it is not ignored** and would be committed.

---

## 4. What `VITE_` really means

> **A `VITE_` variable is configuration, not a secret.**

Vite replaces `import.meta.env.VITE_ANYTHING` with its literal value **at
build time**. The value is baked into the JavaScript file served to every
visitor. There is no decryption step and no server to withhold it.

This is not a theory about this project. Here is a real string from the
current production bundle:

```
https://formsubmit.co/ajax/info@veyra.lk
VITE_CONTACT_TIMEOUT_MS:`15000`
VITE_SITE_URL:`https://aswenna.lk`
```

Anyone can get that with View Source and about five seconds of looking.

**That is fine for what is in there now.** A relay URL and a public contact
address are meant to be public — the inbox is on the website. What protects
that mailbox is the relay's spam handling and the honeypot, not the URL being
secret.

**It is not fine for anything else.** Never put these in a `VITE_` variable:

- an SMTP password
- a database connection string
- a Stripe, Twilio, SendGrid or cloud provider secret key
- an API key that can write, delete, charge, or send on your behalf
- a JWT signing secret
- an admin token of any kind

Each of those would be handed to every visitor, published to anyone who
mirrors the site, and archived by crawlers.

### A note on the honeypot

The form carries a hidden `_gotcha` field that bots fill and people never see.
It works against unsophisticated bots. Be aware the field name **is visible in
the bundle**, so anyone who looks can write a bot that skips it. It raises the
cost of spam; it does not stop a targeted attempt. If spam becomes a real
problem, add a CAPTCHA (hCaptcha and Cloudflare Turnstile both have free
tiers) or move to §5 and rate-limit server-side.

---

## 5. Holding a real secret: the serverless step

The moment you need a credential the public must not have — sending mail from
your own SMTP, writing to a database, calling a paid API — the static site
cannot do it. You need code that runs on a server, where the key lives in the
server's environment and never reaches the browser.

The smallest version of this is a serverless function on the host you already
deploy to. The browser posts to your own `/api/contact`; the function holds
the key and talks to the mail service.

### Cloudflare Pages

Create `functions/api/contact.js`:

```js
export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("origin") ?? "";
  // Only your own site may post here.
  if (!origin.endsWith("aswenna.lk")) {
    return new Response("Forbidden", { status: 403 });
  }

  const data = await request.json();
  if (data._gotcha) return new Response("{}", { status: 200 }); // silent on bots

  // env.MAIL_API_KEY is a Cloudflare SECRET. It is never sent to the browser.
  const res = await fetch("https://api.mailservice.example/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.MAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: env.CONTACT_INBOX,
      subject: `Aswenna enquiry — ${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
      text: JSON.stringify(data, null, 2),
    }),
  });

  return new Response(JSON.stringify({ ok: res.ok }), {
    status: res.ok ? 200 : 502,
    headers: { "Content-Type": "application/json" },
  });
}
```

Set the secret with **no** `VITE_` prefix, so it can never be inlined:

```bash
npx wrangler pages secret put MAIL_API_KEY
```

Then point the form at your own endpoint:

```bash
VITE_CONTACT_ENDPOINT=/api/contact
```

That value is public — and it does not matter, because it is just a path on
your own site.

### Netlify

Same shape. `netlify/functions/contact.js`:

```js
export default async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const data = await req.json();
  if (data._gotcha) return new Response("{}", { status: 200 });

  const res = await fetch("https://api.mailservice.example/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to: process.env.CONTACT_INBOX, text: JSON.stringify(data) }),
  });
  return new Response(JSON.stringify({ ok: res.ok }), { status: res.ok ? 200 : 502 });
};
```

Set `MAIL_API_KEY` in Netlify's environment variables and mark it secret.
`VITE_CONTACT_ENDPOINT=/.netlify/functions/contact`.

### What you gain

- The key genuinely never reaches the browser.
- You can rate-limit by IP, reject by origin, and log abuse.
- You can add a CAPTCHA check server-side, where it cannot be bypassed.
- The destination inbox stops being public.

---

## 6. Precautions and what to do if a key leaks

**Day to day**

- Never paste a secret into chat, an issue, a commit message or a screenshot.
- One key per environment. A leaked staging key should not touch production.
- Give every key the narrowest scope the job needs — send-only, never admin.
- Rotate on a schedule, and whenever someone leaves the project.
- Turn on GitHub **secret scanning** and **push protection** (Settings →
  Code security). It blocks a push that contains a recognised key format.

**Before every commit**

```bash
git status            # is a .env variant showing up?
git diff --staged     # read what you are actually committing
```

**If a key is ever committed**

1. **Rotate it first.** Revoke the old one at the provider, immediately.
   Assume it is compromised the second it touches a remote.
2. Only then clean history — `git filter-repo`, or BFG Repo-Cleaner.
3. Force-push and have every collaborator re-clone.

Deleting the file in a new commit **does not help**. The value stays in the
history and in every clone, fork and cached view. Rotation is the only fix
that works; history cleaning is tidying up afterwards.

---

## 7. Can anyone read our code in DevTools?

**Yes. You cannot prevent this, and no tool or service changes that.**

It is worth being blunt, because a lot of advice on this is wishful. For the
browser to run your JavaScript it must receive your JavaScript. The browser is
the attacker's machine. Anything it can execute, its owner can read, pause,
inspect and copy.

### What does not work

| Idea | Why it fails |
| --- | --- |
| Minify / mangle names | Already done by the build. It shortens names; the logic is fully readable, as the extract in §4 shows. |
| A commercial obfuscator | Raises reading time from minutes to maybe an hour. Deobfuscators are free and automated. Costs you real performance and makes production errors unreadable. |
| Disable right-click / F12 | Bypassed by Ctrl+U, the Network tab, `curl`, or any proxy. Only annoys ordinary visitors and breaks accessibility tooling. |
| WebAssembly | Compiled, not hidden. Decompilers exist, and any key inside is still extractable. |
| "Encrypt" the bundle | The decryption key must also be shipped. This is a lock with the key taped to it. |

### What actually works

**Put nothing in the browser that must stay private.** That is the whole
answer, and it is the one real control you have:

1. **Secrets live server-side** (§5). A key the browser never receives cannot
   be read from the browser.
2. **Never ship source maps to production.** They turn a minified bundle back
   into your original, commented source. This project does not generate them —
   verified: there are no `.map` files in `dist/`. Keep it that way, and if
   you ever need them for error tracking, upload them to the tracker privately
   rather than serving them.
3. **Enforce rules on the server, not the client.** Client-side validation is
   for helpfulness. Any limit that matters — rate limits, authorisation, who
   may see what — must be checked again by something the user does not
   control.
4. **Keep the repository private** if the source is commercially sensitive.
   That protects your *history, comments and unreleased work* — not the
   shipped bundle, which is public the moment you deploy.
5. **Add a Content-Security-Policy header.** This does not hide your code, but
   it is the highest-value security header you can add: it stops injected
   third-party scripts from running, which is the realistic attack on a
   marketing site. A starting point for this project:

   ```
   Content-Security-Policy:
     default-src 'self';
     script-src 'self' 'sha256-ZnYJX5ypMaaAhxxWhSEjbMkhO2A9yPmbzEQH3LFaITA=';
     img-src 'self' data:;
     style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
     font-src 'self' https://fonts.gstatic.com;
     connect-src 'self' https://formsubmit.co;
     frame-ancestors 'none';
     base-uri 'self';
     object-src 'none'
   ```

   This policy was tested against the built site: **zero violations**, and
   the reveal animations, the feature rows, the mesh and all 20 images still
   work.

   **About that hash.** `index.html` carries one inline script — the single
   line that adds the `js` class before the first paint. A policy without the
   hash blocks it, and because the scroll-reveal animations are scoped to
   `.js`, blocking it silently kills every animation on the page. The first
   draft of this policy did exactly that; it was caught by testing rather
   than by reading. The hash is the right fix, not `'unsafe-inline'` — adding
   `'unsafe-inline'` to `script-src` would defeat most of the point of having
   a CSP at all.

   **If you change that inline script, the hash changes and the script stops
   running.** Recompute it:

   ```bash
   npm run build
   ```

   ```bash
   node -e 'const fs=require("fs"),c=require("crypto");const m=/<script(?![^>]*\bsrc=)[^>]*>([^<]*classList[^<]*)<\/script>/.exec(fs.readFileSync("dist/index.html","utf8"));console.log("sha256-"+c.createHash("sha256").update(m[1]).digest("base64"))'
   ```

   Set it as a header on your host (`_headers` on Netlify and Cloudflare
   Pages, `vercel.json` on Vercel). Roll it out with
   `Content-Security-Policy-Report-Only` first and watch the console for a
   day — an over-tight policy breaks things quietly.

   Add these alongside it:

   ```
   X-Content-Type-Options: nosniff
   Referrer-Policy: strict-origin-when-cross-origin
   Permissions-Policy: geolocation=(), microphone=(), camera=()
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   ```

### The realistic threat

For a marketing site, nobody wants your layout code. What is actually worth
protecting is: the inbox from spam (§2, §4), a mail or API key from being used
to send on your behalf (§5), and the site from script injection (CSP above).
Those are solvable. Hiding the JavaScript is not, and effort spent on it is
effort not spent on the three that are.

---

## 8. Checklist before launch

- [ ] `.env` exists locally and is **not** tracked — `git check-ignore -v .env` prints a rule
- [ ] The same variables are set in the host's environment UI
- [ ] `VITE_SITE_URL` is the real domain, and the build was run after setting it
- [ ] The FormSubmit address has been activated by clicking the link in its email
- [ ] A test enquiry has arrived in the real inbox from the live site
- [ ] No `.map` file is served — `find dist -name "*.map"` is empty
- [ ] Security headers are set on the host, CSP tested in report-only first
- [ ] GitHub secret scanning and push protection are on
- [ ] Nothing secret is in a `VITE_` variable — if it is, it is already public, so rotate it

---

*Written for the Aswenna landing page. The commands and the bundle extract in
§4 were run against this repository, not copied from elsewhere.*
