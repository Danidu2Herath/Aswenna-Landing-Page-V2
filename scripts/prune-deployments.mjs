/**
 * Deletes old PRODUCTION deployments of the Cloudflare Pages project, keeping
 * the newest one. Every deploy gets its own <hash>.<project>.pages.dev address;
 * this stops them piling up. Preview deployments are never touched, so open PRs
 * keep their preview.
 *
 *   CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_PROJECT_NAME
 *   KEEP=1       how many production deployments to keep (default 1)
 *   DRY_RUN=1    list what would be deleted without deleting
 *
 * Run by the deploy job after a production deploy. Needs a token with
 * Account > Cloudflare Pages > Edit.
 */
const {
  CLOUDFLARE_API_TOKEN: token,
  CLOUDFLARE_ACCOUNT_ID: account,
  CLOUDFLARE_PROJECT_NAME: project,
  CLOUDFLARE_API_BASE: base = "https://api.cloudflare.com/client/v4",
} = process.env;
const keep = Math.max(1, Number(process.env.KEEP ?? 1));
const dryRun = process.env.DRY_RUN === "1";

if (!token || !account || !project) {
  console.error("prune: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_PROJECT_NAME are required");
  process.exit(1);
}

const root = `${base}/accounts/${account}/pages/projects/${project}/deployments`;
const call = async (url, init = {}) => {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}` } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    throw new Error(`${init.method ?? "GET"} ${res.status} ${JSON.stringify(body.errors ?? body)}`);
  }
  return body;
};

/* Collect every production deployment, paging until a short page comes back. */
const all = [];
for (let page = 1; ; page++) {
  const { result } = await call(`${root}?env=production&per_page=25&page=${page}`);
  all.push(...result);
  if (result.length < 25) break;
}

const production = all
  .filter((d) => d.environment === "production")
  .sort((a, b) => new Date(b.created_on) - new Date(a.created_on));

const stale = production.slice(keep);
console.log(`prune: ${production.length} production deployment(s), keeping ${Math.min(keep, production.length)}, deleting ${stale.length}${dryRun ? " (dry run)" : ""}`);

let failed = 0;
for (const d of stale) {
  const label = `${d.id.slice(0, 8)} (${d.created_on})`;
  if (dryRun) {
    console.log(`  would delete ${label}`);
    continue;
  }
  try {
    await call(`${root}/${d.id}?force=true`, { method: "DELETE" });
    console.log(`  deleted ${label}`);
  } catch (err) {
    failed++;
    console.warn(`  could not delete ${label}: ${err.message}`);
  }
}
if (failed) process.exitCode = 1;
