/**
 * Generates everything SEO-related that has to agree with the site content:
 *
 *   public/robots.txt      — crawl rules plus the sitemap pointer
 *   public/sitemap.xml     — the URL set for Google Search Console
 *   public/site.webmanifest
 *   index.html             — the JSON-LD block, between the seo:jsonld markers
 *
 * One source for the origin (VITE_SITE_URL in .env) and one source for the
 * copy (src/data/content.ts), so none of it can drift out of step.
 *
 *   node --experimental-strip-types scripts/gen-seo.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as C from "../src/data/content.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

/* ------------------------------------------------------------------ origin */
const env = readFileSync(join(root, ".env"), "utf8");
const match = /^VITE_SITE_URL\s*=\s*(.+)$/m.exec(env);
if (!match) throw new Error("VITE_SITE_URL is missing from .env");
const ORIGIN = match[1].trim().replace(/\/+$/, "");
if (!/^https?:\/\/[^/\s]+$/.test(ORIGIN)) {
  throw new Error(`VITE_SITE_URL does not look like an origin: ${ORIGIN}`);
}

const today = new Date().toISOString().slice(0, 10);

/* --------------------------------------------------------------- robots.txt */
writeFileSync(
  join(root, "public/robots.txt"),
  `# ${C.site.name} — ${C.site.tagline}
User-agent: *
Allow: /

# Nothing here is private; the only thing worth excluding is the build output
# of a preview deploy, which should not exist on the canonical origin anyway.
Disallow: /*.json$

Sitemap: ${ORIGIN}/sitemap.xml
`,
);

/* -------------------------------------------------------------- sitemap.xml */
/* One page, but its in-page sections are what people search for, so the
   fragments are listed too: Search Console accepts them and they can surface
   as jump links in a result. */
const urls = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  ...C.nav.map((n) => ({ loc: `/${n.href}`, priority: "0.7", changefreq: "monthly" })),
  { loc: "/#platform", priority: "0.8", changefreq: "monthly" },
  { loc: "/#roadmap", priority: "0.6", changefreq: "monthly" },
  { loc: "/#contact", priority: "0.8", changefreq: "monthly" },
];

const seen = new Set();
const entries = urls
  .filter((u) => !seen.has(u.loc) && seen.add(u.loc))
  .map(
    (u) => `  <url>
    <loc>${ORIGIN}${u.loc === "/" ? "/" : u.loc.replace("//", "/")}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n");

writeFileSync(
  join(root, "public/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`,
);

/* ------------------------------------------------------------- webmanifest */
writeFileSync(
  join(root, "public/site.webmanifest"),
  `${JSON.stringify(
    {
      name: `${C.site.name} — ${C.site.title}`,
      short_name: C.site.name,
      description: C.site.description,
      start_url: "/",
      display: "standalone",
      background_color: "#F4F7F4",
      theme_color: "#1D4E2B",
      icons: [{ src: "/images/logos/aswenna-mark.svg", sizes: "any", type: "image/svg+xml" }],
    },
    null,
    2,
  )}\n`,
);

/* ----------------------------------------------------------------- JSON-LD */
const graph = [
  {
    "@type": "Organization",
    "@id": `${ORIGIN}/#organization`,
    name: C.site.parent,
    url: ORIGIN,
    email: C.contactDetails.email,
    telephone: C.contactDetails.phones.map((p) => p.href.replace("tel:", "")),
    address: { "@type": "PostalAddress", addressCountry: "LK" },
    logo: { "@type": "ImageObject", url: `${ORIGIN}/images/logos/aswenna-mark.svg` },
  },
  {
    "@type": "WebSite",
    "@id": `${ORIGIN}/#website`,
    url: `${ORIGIN}/`,
    name: C.site.name,
    description: C.site.description,
    inLanguage: ["en", "si", "ta"],
    publisher: { "@id": `${ORIGIN}/#organization` },
  },
  {
    "@type": "WebPage",
    "@id": `${ORIGIN}/#webpage`,
    url: `${ORIGIN}/`,
    name: `${C.site.name} — ${C.site.tagline}`,
    isPartOf: { "@id": `${ORIGIN}/#website` },
    about: { "@id": `${ORIGIN}/#project` },
    primaryImageOfPage: { "@type": "ImageObject", url: `${ORIGIN}/images/og-cover.jpg` },
  },
  /* Described as a research PROJECT, not as a product on sale: phases 01–03
     are planned scope and phase 04 is proposed, which is exactly what the
     page says. Marking it up as a released SoftwareApplication would be a
     claim the project does not make. */
  {
    "@type": "ResearchProject",
    "@id": `${ORIGIN}/#project`,
    name: C.site.name,
    alternateName: C.site.title,
    description: C.site.description,
    url: `${ORIGIN}/`,
    parentOrganization: { "@id": `${ORIGIN}/#organization` },
    areaServed: { "@type": "Country", name: "Sri Lanka" },
    knowsAbout: [
      "precision agriculture",
      "soil moisture monitoring",
      "LoRaWAN",
      "smart irrigation",
      "crop recommendation",
      "agricultural market intelligence",
    ],
  },
  {
    "@type": "FAQPage",
    "@id": `${ORIGIN}/#faq`,
    mainEntity: C.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  },
];

const jsonld = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);

const indexPath = join(root, "index.html");
let html = readFileSync(indexPath, "utf8");
const OPEN = "<!-- seo:jsonld -->";
const CLOSE = "<!-- /seo:jsonld -->";
const a = html.indexOf(OPEN);
const b = html.indexOf(CLOSE);
if (a === -1 || b === -1) throw new Error("the seo:jsonld markers are missing from index.html");

html = `${html.slice(0, a + OPEN.length)}
    <script type="application/ld+json">
${jsonld
  .split("\n")
  .map((line) => `      ${line}`)
  .join("\n")}
    </script>
    ${html.slice(b)}`;
writeFileSync(indexPath, html);

console.log(`seo: origin ${ORIGIN}`);
console.log(`seo: sitemap ${urls.length} urls, json-ld ${graph.length} nodes, robots + manifest written`);
