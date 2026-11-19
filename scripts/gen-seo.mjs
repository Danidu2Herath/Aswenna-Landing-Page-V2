/**
 * Generates everything SEO-related that has to agree with the site content:
 *
 *   public/robots.txt      - crawl rules plus the sitemap pointer
 *   public/sitemap.xml     - the URL set for Google Search Console
 *   public/site.webmanifest
 *   index.html             - the JSON-LD block, between the seo:jsonld markers
 *
 * One source for the origin (VITE_SITE_URL in .env) and one source for the
 * copy (src/data/content.ts), so none of it can drift out of step.
 *
 *   node --experimental-strip-types scripts/gen-seo.mjs
 */
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as C from "../src/data/content.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

/* ------------------------------------------------------------------ origin */
/* The deploy platform's own environment wins, so a host that injects
   VITE_SITE_URL needs no .env file in the build image at all. */
const fromFile = (name) => {
  for (const file of [".env.local", ".env"]) {
    try {
      const m = new RegExp(`^${name}\\s*=\\s*(.+)$`, "m").exec(readFileSync(join(root, file), "utf8"));
      if (m) return m[1].trim().replace(/^["']|["']$/g, "");
    } catch {
      /* file absent - try the next one */
    }
  }
  return undefined;
};

const RAW = process.env.VITE_SITE_URL ?? fromFile("VITE_SITE_URL");
if (!RAW) {
  throw new Error(
    "VITE_SITE_URL is not set.\n" +
      "  Copy the template and fill it in:  cp .env.example .env\n" +
      "  Or set it in your host's environment variables.",
  );
}
const ORIGIN = RAW.replace(/\/+$/, "");
if (!/^https?:\/\/[^/\s]+$/.test(ORIGIN)) {
  throw new Error(`VITE_SITE_URL does not look like an origin: ${ORIGIN}`);
}

/* <lastmod> must say when the content last changed, not when the site was
   last built. A sitemap whose dates all equal the build date tells a crawler
   nothing and is discounted, so this reads the last commit that touched the
   copy and falls back to the file's own mtime outside a git checkout. */
const contentFile = join(root, "src/data/content.ts");
const contentModified = (() => {
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", contentFile], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (iso) return iso.slice(0, 10);
  } catch {
    /* not a git checkout, or git is unavailable */
  }
  return statSync(contentFile).mtime.toISOString().slice(0, 10);
})();

/* --------------------------------------------------------------- robots.txt */
/* AI crawlers are named explicitly and allowed. The project wants to be found
   and described accurately, and a crawler that cannot read the page will
   describe it from somewhere else instead. llms.txt is pointed at by name so
   a tool that looks for it does not have to guess. */
const AI_AGENTS = [
  ["GPTBot", "OpenAI - ChatGPT browsing and training"],
  ["OAI-SearchBot", "OpenAI - ChatGPT search index"],
  ["ChatGPT-User", "OpenAI - fetches a page a user asked about"],
  ["ClaudeBot", "Anthropic - Claude"],
  ["Claude-User", "Anthropic - fetches a page a user asked about"],
  ["Claude-SearchBot", "Anthropic - Claude search index"],
  ["PerplexityBot", "Perplexity"],
  ["Perplexity-User", "Perplexity - fetches a page a user asked about"],
  ["Google-Extended", "Google - Gemini and AI Overviews"],
  ["Applebot-Extended", "Apple Intelligence"],
  ["Bingbot", "Microsoft Bing and Copilot"],
  ["CCBot", "Common Crawl"],
  ["Amazonbot", "Amazon"],
  ["meta-externalagent", "Meta AI"],
  ["cohere-ai", "Cohere"],
  ["DuckAssistBot", "DuckDuckGo"],
  ["YouBot", "You.com"],
  ["Diffbot", "Diffbot"],
  ["Timpibot", "Timpi"],
];

writeFileSync(
  join(root, "public/robots.txt"),
  `# ${C.site.name} - ${C.site.tagline}
# ${C.site.description}

User-agent: *
Allow: /

# Nothing here is private; the only thing worth excluding is the build output
# of a preview deploy, which should not exist on the canonical origin anyway.
Disallow: /*.json$

# ---------------------------------------------------------------------------
# AI and answer-engine crawlers - explicitly allowed.
# A crawler that cannot read this page will describe the project from
# somewhere less accurate. /llms.txt is the short version written for them.
# ---------------------------------------------------------------------------
${AI_AGENTS.map(([ua, who]) => `# ${who}\nUser-agent: ${ua}\nAllow: /\n`).join("\n")}
Sitemap: ${ORIGIN}/sitemap.xml
`,
);

/* -------------------------------------------------------------- sitemap.xml */
/* One page, but its in-page sections are what people search for, so the
   fragments are listed too: Search Console accepts them and they can surface
   as jump links in a result. */
const SECTIONS = [
  ...C.nav,
  { href: "#platform", label: "The Aswenna platform" },
  { href: "#contact", label: "Contact" },
];

const urls = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  ...SECTIONS.map((sec) => ({ loc: `/${sec.href}`, priority: "0.7", changefreq: "monthly" })),
];

const seen = new Set();
const entries = urls
  .filter((u) => !seen.has(u.loc) && seen.add(u.loc))
  .map(
    (u) => `  <url>
    <loc>${ORIGIN}${u.loc === "/" ? "/" : u.loc.replace("//", "/")}</loc>
    <lastmod>${contentModified}</lastmod>
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

/* ------------------------------------------------------------------ llms.txt */
/* An AI tool that fetches a React page gets an empty <div> unless it runs the
   JavaScript, so the content is published a second time as plain text.
   llms.txt is the short orientation file; llms-full.txt is the whole page as
   Markdown. Both are generated from the same content.ts the page renders, so
   they cannot drift apart.

   The status section is deliberate and comes first: the predictable failure
   is a tool describing a research project as a product you can buy today. */
const heading = (c) => [c.title, c.accent].filter(Boolean).join(" ").trim();
const bullets = (xs, f) => xs.map(f).join("\n");

const STATUS = `Aswenna is an academic and agricultural **research and development
project**, not a deployed commercial service. Nothing on the site describes
something that can be bought or used today.

- Roadmap phases 01-03 describe the **planned** project scope.
- Roadmap phase 04 collects **proposed** future extensions.
- Pricing tiers are **indicative costs for a proposed pilot**, not a sales offer.
- Application screens are **interface design concepts with illustrative
  values**, not screenshots of a running system.
- Every soil or weather value is labelled either **estimated** (derived from
  regional databases for the mapped location) or **measured** (read by a device
  or a handheld probe on that plot). The two are never presented as the same
  thing.`;

writeFileSync(
  join(root, "public/llms.txt"),
  `# ${C.site.name}

> ${C.site.description}

${C.site.name} - "${C.site.tagline}" - is a project of ${C.site.parent}, built for
smallholder farming in Sri Lanka. The platform is planned in Sinhala, Tamil
and English; this page is published in English only.

## Status, before anything else

${STATUS}

## Full content

- [${C.site.name} in full, as Markdown](${ORIGIN}/llms-full.txt): every section of
  the page in plain text, generated from the same source the page renders.

## Sections

${bullets(SECTIONS, (sec) => `- [${sec.label}](${ORIGIN}/${sec.href})`)}

## Machine-readable

- [Sitemap](${ORIGIN}/sitemap.xml)
- [Crawl policy](${ORIGIN}/robots.txt): AI crawlers are named and allowed
- Structured data: JSON-LD in the page head - Organization, WebSite, WebPage,
  ResearchProject, FAQPage

## Contact

- Email: ${C.contactDetails.email}
- Phone: ${C.contactDetails.phones.map((p) => p.label).join(", ")}

_Content last updated ${contentModified}. Generated from src/data/content.ts._
`,
);

writeFileSync(
  join(root, "public/llms-full.txt"),
  `# ${C.site.name} - ${C.site.title}

> ${C.site.description}

| | |
| --- | --- |
| Tagline | ${C.site.tagline} |
| Promise | ${C.site.promise} |
| Run by | ${C.site.parent} |
| Region | Sri Lanka |
| This page | English only |
| Planned platform languages | Sinhala, Tamil, English |
| Contact | ${C.contactDetails.email} · ${C.contactDetails.phones.map((p) => p.label).join(" · ")} |
| Canonical URL | ${ORIGIN}/ |
| Content last updated | ${contentModified} |

## Status - read this first

${STATUS}

## ${heading(C.problems)}

${C.problems.sub}

${bullets(C.problems.items, (i) => `- **${i.title}** - ${i.text}`)}

## ${heading(C.soil)}

${C.soil.sub}

${bullets(C.soil.capabilities, (c) => `- **${c.title}** - ${c.text}`)}

## ${heading(C.seasons)}

${C.seasons.sub}

${C.seasons.stages
  .map(
    (s) => `### ${s.stage} · ${s.title} (${s.when})

${s.text}

${s.callout.label}: ${s.callout.text}`,
  )
  .join("\n\n")}

## ${heading(C.engine)}

${C.engine.sub}

${C.engine.stages.map((s, i) => `${i + 1}. **${s.name}** - ${s.text}`).join("\n")}

${C.engine.note}

## ${heading(C.comparison)}

${C.comparison.sub}

| ${C.comparison.withoutLabel} | ${C.comparison.withLabel} |
| --- | --- |
${bullets(C.comparison.rows, (r) => `| ${r.without} | ${r.with} |`)}

## ${heading(C.featureGroups)}

${C.featureGroups.sub}

${C.featureGroups.groups
  .map(
    (g) => `### ${g.title}

_${g.label}_

${g.note}

${bullets(g.items, (it) => `- **${it.title}** - ${it.text}`)}`,
  )
  .join("\n\n")}

## ${heading(C.hardware)}

${C.hardware.sub}

${bullets(C.hardware.components, (c) => `- ${c.name}`)}

## ${heading(C.pricing)}

${C.pricing.sub}

${C.pricing.tiers
  .map(
    (t) => `### ${t.tag} - ${t.name}

**${t.price}** (${t.unit})

${t.text}

${bullets(t.items, (i) => `- ${i}`)}`,
  )
  .join("\n\n")}

${C.pricing.note}

## ${heading(C.platform)}

${C.platform.sub}

${bullets(C.platform.screens, (s) => `- **${s.name}** - ${s.text}`)}

## ${heading(C.roadmap)}

_Not shown on the landing page. It is published here because it is the
evidence for the status note above: these are the phases that are planned
and proposed, and nothing in them is deployed._


${C.roadmap.sub}

${C.roadmap.phases
  .map(
    (ph) => `### ${ph.n} - ${ph.name} (${ph.status})

${bullets(ph.items, (i) => `- ${i}`)}`,
  )
  .join("\n\n")}

${C.roadmap.note}

## ${heading(C.faq)}

${C.faq.items.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Contact

${C.contact.text}

- Email: ${C.contactDetails.email}
- Phone: ${C.contactDetails.phones.map((p) => p.label).join(", ")}
- Enquiry form: ${ORIGIN}/#contact

${C.contact.note}

---

_Content last updated ${contentModified}, generated from src/data/content.ts. This
file carries the site's content; where the two disagree, the page is correct._
`,
);

/* ------------------------------------------------------------- webmanifest */
writeFileSync(
  join(root, "public/site.webmanifest"),
  `${JSON.stringify(
    {
      name: `${C.site.name} - ${C.site.title}`,
      short_name: C.site.name,
      description: C.site.description,
      start_url: "/",
      display: "standalone",
      background_color: "#EFF4EE",
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
    knowsLanguage: ["en", "si", "ta"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "enquiries",
      email: C.contactDetails.email,
      telephone: C.contactDetails.phones.map((ph) => ph.href.replace("tel:", "")),
      areaServed: "LK",
      availableLanguage: ["English", "Sinhala", "Tamil"],
    },
  },
  {
    "@type": "WebSite",
    "@id": `${ORIGIN}/#website`,
    url: `${ORIGIN}/`,
    name: C.site.name,
    description: C.site.description,
    /* The SITE, not the product. This page is published in English only;
       the Sinhala and Tamil the platform plans are a product capability,
       described in the content, not a translation of this page. */
    inLanguage: "en",
    publisher: { "@id": `${ORIGIN}/#organization` },
  },
  {
    "@type": "WebPage",
    "@id": `${ORIGIN}/#webpage`,
    url: `${ORIGIN}/`,
    name: `${C.site.name} - ${C.site.tagline}`,
    isPartOf: { "@id": `${ORIGIN}/#website` },
    about: { "@id": `${ORIGIN}/#project` },
    primaryImageOfPage: { "@type": "ImageObject", url: `${ORIGIN}/images/og-cover.jpg` },
    description: C.site.description,
    inLanguage: "en",
    datePublished: "2025-01-01",
    dateModified: contentModified,
    hasPart: SECTIONS.map((sec) => ({
      "@type": "WebPageElement",
      name: sec.label,
      url: `${ORIGIN}/${sec.href}`,
    })),
  },
  /* Described as a research PROJECT, not as a product on sale: phases 01-03
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

/* ------------------------------------------------- title and description */
/* Written from content.ts so the two cannot drift from the structured data,
   and so the lengths stay where a search result can show them whole. */
{
  const OPEN = "<!-- seo:head -->";
  const CLOSE = "<!-- /seo:head -->";
  const a = html.indexOf(OPEN);
  const b = html.indexOf(CLOSE);
  if (a === -1 || b === -1) throw new Error("the seo:head markers are missing from index.html");
  const esc = (t) => t.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
  if (C.site.metaTitle.length > 65) console.warn(`seo: WARNING metaTitle is ${C.site.metaTitle.length} chars; a result shows about 60`);
  if (C.site.metaDescription.length > 165) console.warn(`seo: WARNING metaDescription is ${C.site.metaDescription.length} chars; a result shows about 160`);
  html = `${html.slice(0, a + OPEN.length)}
    <title>${esc(C.site.metaTitle)}</title>
    <meta name="description" content="${esc(C.site.metaDescription)}" />
    ${html.slice(b)}`;
}
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
