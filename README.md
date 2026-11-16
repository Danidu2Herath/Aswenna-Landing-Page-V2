# Aswenna — landing page

Marketing site for **Aswenna**, the Agricultural Intelligence Platform.
_Smarter fields, greater future._ A project of **Veyra Solutions**.

**React 19 + TypeScript + SCSS**, built with Vite. The design tokens are plain
CSS custom properties, so colour, type and spacing are still changeable at
runtime from one file.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/   (regenerates the SEO files first)
npm run preview    # serve the built site
```

`npm run build` produces a static `dist/` folder. It needs no server of its own —
any static host will do (Netlify, Vercel, Cloudflare Pages, GitHub Pages, or
plain nginx).

---

## Where things are

```
index.html             the document head: title, meta, Open Graph, JSON-LD
.env                   VITE_SITE_URL — the canonical origin, in ONE place
src/
  main.tsx             entry point; mounts <App/> inside <LanguageProvider/>
  App.tsx              the section order of the page
  data/content.ts      ALL copy, in one file — including the app-screen content
  i18n/                language provider + Sinhala and Tamil strings
  lib/util.ts          clamp, rAF throttle, motion/touch queries
  hooks/index.ts       useMediaQuery, useOnScreen, useRafLoop, useRevealOnce…
  components/          one component per section, plus the shared primitives
    app/               the mobile-application interface designs
      Phone.tsx          the device frame
      screens.tsx        the ten screens
      charts.tsx         the two mini charts
      AppPhone.tsx       device + screen + caption
  scss/
    tokens.scss       EVERY colour, size and timing. Start here.
    base.scss         reset, layout primitives, buttons, cards, chips
    components/*.scss  one stylesheet per section
    main.scss          the entry point
scripts/
  gen-seo.mjs          robots.txt, sitemap.xml, webmanifest, JSON-LD
  make-og.mjs          the 1200x630 social card
  build-icons.mjs      rebuilds public/images/icons.svg from lucide
public/images/         photos, logos, the icon sprite
```

**To change copy** → `src/data/content.ts`.
**To change colours** → `src/scss/tokens.scss`.
**To change the deployed domain** → `.env`, then `npm run build`.

---

## SEO

Everything that has to agree about the site is generated from two sources —
`.env` for the origin and `src/data/content.ts` for the copy — by
`scripts/gen-seo.mjs`, which runs automatically before every build.

It writes:

| File | What it is |
| --- | --- |
| `public/robots.txt` | crawl rules and the sitemap pointer |
| `public/sitemap.xml` | the URL set to submit to Google Search Console |
| `public/site.webmanifest` | name, theme colour, icon |
| the JSON-LD in `index.html` | Organization, WebSite, WebPage, ResearchProject, FAQPage |

The FAQ markup is generated from the real FAQ, so the six questions can appear
as rich results. The project is described as a **ResearchProject**, not as a
released `SoftwareApplication`: phases 01–03 are planned scope and phase 04 is
proposed, and the structured data must not claim more than the page does.

### Before you submit to Search Console

1. Set the real domain in `.env` and rebuild. Every canonical, Open Graph and
   sitemap URL follows from it.
2. Deploy, then verify the property in Search Console (DNS TXT record is the
   most durable method).
3. Submit `https://your-domain/sitemap.xml`.
4. Run the live URL through the Rich Results Test and the Facebook Sharing
   Debugger once, so the FAQ markup and the social card are confirmed.

### The one real SEO limitation

This is a single-page React app: the HTML served to a crawler contains the head
and the `<noscript>` block, and the body is rendered by JavaScript. Google
renders JavaScript and will index it, but Bing and most social scrapers are
less reliable, and the first paint is slower than it needs to be.

If organic search matters, pre-render the page at build time —
[`vite-plugin-prerender`](https://www.npmjs.com/package/vite-plugin-prerender)
or `react-dom/server`'s `renderToStaticMarkup` into `index.html`. The components
are all pure given the content file, so nothing in them blocks it. That is the
single highest-value SEO change left, and it is maybe an hour of work.

---

## The contact form — ACTION REQUIRED BEFORE LAUNCH

`src/components/ContactSection.tsx` posts the enquiry to a form relay, which
emails it to **info@veyra.lk**. This is a static site, so there is no server of
ours to receive the post.

```ts
const ENDPOINT = "https://formsubmit.co/ajax/info@veyra.lk";
```

**FormSubmit needs the address activated once.** Submit the form yourself on the
live site, then click the link in the confirmation email FormSubmit sends to
info@veyra.lk. **Until that is done every submission fails** and the visitor is
shown the error state with the address to email directly.

To use something else — Formspree, Web3Forms, or your own endpoint — change
`ENDPOINT` only. It must accept a POST of JSON and answer 2xx on success.

What the form does: validates in the browser and marks bad fields inline,
disables the button and says "Sending…", carries a honeypot field that bots fill
and people never see, times out after 15 seconds, and shows a **success** or a
**failure** panel. The failure panel repeats the email address so an enquiry is
never simply lost.

---

## The mobile application screens

`src/components/app/` renders ten interface designs — farmer dashboard, land
registration, soil monitoring, crop recommendations, cultivation calendar,
pests and alerts, market analytics, device monitoring, smart irrigation and the
extension-officer area dashboard.

They are **real DOM and real SVG, not screenshots**: they stay crisp at any
size, inherit the design tokens, translate with the rest of the page, and cost
a few kilobytes instead of ten image downloads. One variable (`--ph-w`) scales
a whole device, because every length inside it is in `em`.

> **Every value in them is illustrative.** Each device carries a caption that
> says so, because the content-integrity rule for this project forbids
> presenting invented numbers as measurements. The Estimated / Measured
> distinction the rest of the site uses is kept inside the mockups too. If you
> replace them with real screenshots later, keep the captions honest.

They appear in the hero (dashboard), the soil section (soil monitoring), the
growth journey (calendar), the field-first section (alerts), and the platform
section, where the list and the device are wired together — pick an entry and
that screen appears.

---

## The header over dark sections

Full "liquid glass" needs something with contrast behind it to refract. Over
the pale sage page there is nothing to catch, so a heavy blur just reads as a
smudge — which is why the header now uses a crisp, nearly opaque pill there.

Over a dark section it does the opposite: `Header.tsx` measures what is
underneath the middle of the bar on every scroll frame and adds
`header--over-dark`, which swaps in a genuinely transparent dark panel with
light text. Sections opt in with a `data-dark` attribute.

## The growth journey has two presentations

Only one is ever live, and the breakpoint is matched between CSS and JS
(`SCRUB_QUERY` in `JourneySection.tsx`, the media query in
`_mobilejourney.scss`).

- **Desktop, fine pointer, motion allowed** — the section pins and the crop
  grows continuously as you scroll through it.
- **Touch, narrow, or reduced motion** — the **growing spine**.

### The growing spine

A vertical timeline with the crop in a **sticky** viewer above it. The crop
still grows continuously with scroll — it is the same 0..1 value the desktop
scrub uses — but the page is never pinned.

Sticky is not pinned, and the difference is the whole point. The section is an
ordinary height, scrolling never stalls, and flicking past costs one swipe
instead of six. That is what made both earlier attempts impractical on a phone:
the pinned scrub took over the only gesture a phone has, and the horizontal
card row that replaced it fought the iOS edge-swipe-back. Growth also reads
top-to-bottom here, which is the natural direction of a phone and the direction
a plant actually grows.

Tapping a node scrolls until the reading anchor — the bottom edge of the sticky
viewer — sits in the **middle** of that stage. Two details matter and both were
bugs first:

- `.jspine__tail` is a **sibling** of the list, not a pseudo-element inside it.
  The list's height is the denominator of the progress calculation, so padding
  it out from the inside made every tap land one stage short.
- The viewer's background is **fully opaque**. At 97% the stage text sliding
  underneath still ghosted through and turned the crop into a double exposure.

## Languages

English, Sinhala and Tamil. The choice is remembered and sets `<html lang>`.
English is the base: `useI18n().t()` falls back to it for anything a translation
has not covered, so nothing can break by being missing.

> **The translations need a native speaker.** What is translated is interface
> chrome — navigation, buttons, the trust strip, the contact form, the footer
> headings. The long-form agricultural copy is deliberately still English.
> Machine-translating agronomy terminology into languages this site's readers
> speak natively would produce errors invisible to whoever wrote it.
> **Review every string in `src/i18n/` before launch.**

## Logos

The strip runs on a dark band for a reason: the supplied **IIT** mark has a
white wordmark that is invisible on a light background, and the supplied **ATP**
mark is black line art that is invisible on a dark one. On the dark band IIT
works as supplied and ATP is inverted to white in CSS (`.logos__item--invert`).

- `public/images/logos/aswenna-white.svg` — drawn for the dark band
- `public/images/logos/veyra-placeholder.svg` — **PLACEHOLDER**, replace it
- `public/images/logos/iit.png`, `atp.webp` — as supplied

## Accessibility

- Skip link, one `<h1>`, sequential headings, visible focus rings.
- Every interactive target meets the 24px WCAG 2.5.8 minimum.
- All text measured on the rendered page clears **WCAG AA** — 506 text blocks,
  tightest 4.35:1. Measured by sampling the real painted background under each
  text node, not by comparing declared colours.
- Live regions only become live once a person has interacted, so the ambient
  animations do not announce themselves to a screen reader.
- Everything that moves stops under `prefers-reduced-motion: reduce`.

## Content integrity

Unchanged from the brief and worth keeping:

- No invented statistics, sensor readings or agricultural claims.
- Roadmap phases are labelled **Planned** (01–03) and **Proposed** (04), never as
  deployed operations.
- The platform section says "**Proposed** interfaces" in its own sentence.
- **Estimated** (regional databases) and **Measured** (field devices) values are
  distinguished wherever they appear, inside the app mockups as well.
- The application screens are captioned as design concepts with illustrative
  values.
- The testimonials section was removed rather than shipped with invented quotes.
