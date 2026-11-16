# Publishing Aswenna, and what to do after

A practical sequence, in the order it pays off. Nothing here needs a budget
except where it says so.

---

## 1. Before you publish — the blocking list

These four things will embarrass you if they ship as they are.

| | What | Where |
| --- | --- | --- |
| ☐ | **Set the real domain** in `.env` and rebuild. Every canonical, Open Graph and sitemap URL comes from it; right now it says `https://aswenna.lk`. | `.env` |
| ☐ | **Activate the contact form.** Submit it once on the live site and click the confirmation email FormSubmit sends to info@veyra.lk. Until then every enquiry fails. | see README |
| ☐ | **Replace the Veyra logo.** It is a placeholder shape. | `public/images/logos/veyra-placeholder.svg` |
| ☐ | **Have a native speaker read the Sinhala and Tamil.** Only interface chrome is translated, and nobody on this side can see an error in it. | `src/i18n/si.ts`, `ta.ts` |

Then, worth ten minutes each:

- Send the live URL to yourself on **WhatsApp** and check the preview card. That
  is how most of this audience will first see the link, not Google.
- Open it on a **real mid-range Android phone on mobile data**, not on a desktop
  simulator. The site is built for low coverage; confirm it.
- Click every nav link and every footer link.

## 2. Where to host it

`npm run build` makes a `dist/` folder of static files. In rough order of
suitability:

1. **Cloudflare Pages** — free, a global edge network with a point of presence
   in Colombo, free SSL, deploys on `git push`. Fastest option for Sri Lankan
   visitors.
2. **Netlify** or **Vercel** — same idea, equally easy, marginally further away.
3. **Your own nginx** — only if you already run one. You gain nothing and take
   on TLS renewal.

Settings for any of them: build command `npm run build`, output directory
`dist`, and add `VITE_SITE_URL` as an environment variable so previews and
production can differ.

## 3. Domain and email

- Buy the domain through a registrar that supports **DNSSEC** and gives you
  free DNS hosting. `.lk` domains go through LK Domain Registry.
- Point the apex and `www` at the host, and make one of them redirect to the
  other. Pick one and never change it — a site that answers on both dilutes
  every link it ever earns.
- Make sure **info@veyra.lk actually receives mail and someone reads it daily**
  before you put it on a public page. An unanswered enquiry is worse than no
  form.
- Add **SPF and DMARC** records for veyra.lk. Without them, the form relay's
  mail is more likely to land in spam.

## 4. Turn on measurement before you promote anything

You cannot improve what you did not measure from day one.

- **Google Search Console** — verify by DNS TXT, submit
  `https://your-domain/sitemap.xml`. This is the only tool that tells you what
  people actually search for before they land on you. Check it weekly.
- **Analytics** — use **Plausible** or **Umami** rather than Google Analytics:
  a few kilobytes instead of ~45 KB, no cookie banner needed in most
  jurisdictions, and a dashboard that someone non-technical will actually open.
- **Set one goal**: contact-form submissions. Everything else is vanity.

## 5. The improvements that will move the needle, ranked

**1. Pre-render the page.** The biggest single technical win. Right now a
crawler or a slow phone gets an empty `<div>` until the JavaScript runs. Add
`vite-plugin-prerender`, or render `<App/>` to static markup at build time.
Expect a faster first paint on 3G and more reliable indexing. ~1 hour.

**2. Compress the photographs properly.** The hero is 164 KB, the market photo
260 KB, the land-mapping photo 206 KB. Generate 640/1024/2000-wide variants and
use `srcset`, and serve AVIF with a WebP fallback. On a Dialog connection
outside Colombo this is the difference between four seconds and one. ~2 hours.

**3. Self-host the fonts.** Four Google Fonts families cost a DNS lookup, a TLS
handshake and a render-blocking stylesheet on a connection where each of those
is expensive. Download them, subset Latin + Sinhala + Tamil, serve them from
your own origin with `font-display: swap`. ~1 hour.

**4. Write three real pages.** A landing page alone has nothing for Google to
rank on anything except your own name. Three articles that answer what farmers
and officers actually type — *"what is the right soil moisture for paddy in the
Maha season"*, *"how LoRaWAN works where there is no mobile signal"*, *"how to
read a soil test report"* — will out-perform any amount of tuning on this one
page. Write them in Sinhala as well as English. This is the highest-value
non-technical work available to you.

**5. Add a short demo video.** Thirty seconds of the irrigation demo and the
app screens, with Sinhala voice-over. It is what you will post everywhere else.

**6. Publish a one-page PDF.** Agricultural offices, universities and donors
forward PDFs; they do not forward URLs. Make it the same content, download it
from the site, and track the downloads.

## 6. Getting the first users — Sri Lanka specifically

Search traffic will take months. These will not.

- **Go through the Department of Agriculture's extension network.** The ARPAs
  and agriculture instructors in each divisional secretariat already talk to the
  farmers you want. One officer who likes this reaches hundreds of people you
  cannot. The extension-officer dashboard in the platform section exists for
  exactly this conversation — lead with it.
- **Farmer organisations (govi sanvidhana) and producer co-operatives.** The
  shared village station in the pricing tiers is designed around their
  economics, not an individual smallholder's. That is the pitch.
- **Universities.** IIT is already on the page. Peradeniya, Ruhuna and
  Rajarata's agriculture faculties run field trials and have students who need
  project partners. An academic collaboration gives you both pilot plots and
  credibility.
- **WhatsApp, not Twitter.** Sri Lankan agricultural communities organise in
  WhatsApp and Viber groups. Make the link and the PDF easy to forward, and
  make the OG card legible at thumbnail size — it already is.
- **Facebook, not LinkedIn.** For this audience, Facebook groups are where the
  conversation happens. Post the demo video there.
- **Agritech and climate-adaptation funding calls.** ADB, FAO, World Bank
  climate-smart-agriculture programmes and the Sri Lankan startup ecosystem
  (ICTA, Hatch, Lankan Angel Network) all fund pilots. The roadmap section is
  already written in the language those applications expect.

A note on honesty, because it is also strategy: the page says clearly that this
is a research project and not a deployed service. Keep it that way. Overclaiming
to an extension officer who then finds a gap costs you the whole network behind
them, and that network is the only distribution channel that matters here.

## 7. What to check each week

1. Search Console: impressions, average position, which queries.
2. Analytics: visitors, which sections they reach, where they leave.
3. Contact form: submissions, and **how long you took to reply**.

If submissions are flat but traffic is rising, the page is not converting —
change the first screen and the call to action, not the colours. If traffic is
flat, you have a distribution problem, not a website problem, and section 6 is
where to spend the week.
