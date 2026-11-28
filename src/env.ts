/* ===========================================================================
   ENVIRONMENT
   ---------------------------------------------------------------------------
   Everything that changes between a local run, a preview deploy and
   production lives in .env, which is not committed. .env.example is the
   committed template: copy it to .env and fill it in.

   READ THIS BEFORE PUTTING A SECRET HERE.

   This is a static site. Vite replaces every import.meta.env.VITE_* with its
   literal value at build time, so each one ends up in plain text inside the
   JavaScript bundle that is served to every visitor. Anyone can read them
   with View Source. A VITE_ variable is configuration, not a secret.

   That is fine for the values below - a form-relay URL and a public inbox
   address are meant to be public, and the relay is what protects the mailbox,
   not obscurity. Anything that must stay private (an SMTP password, a
   database URL, a Stripe secret key) cannot live in a static site at all: it
   needs a server or a serverless function that holds the key and that the
   browser calls.
   =========================================================================== */

/** Reads a VITE_ variable, falling back when it is absent or blank. */
function read(name: string, fallback: string): string {
  const raw = (import.meta.env[name] as string | undefined)?.trim();
  if (raw) return raw;

  // A missing value is a configuration mistake, not a runtime condition, so
  // say so loudly in development and quietly use the fallback in production
  // rather than shipping a page with a broken form.
  if (import.meta.env.DEV) {
    console.warn(
      `[env] ${name} is not set in .env - falling back to "${fallback}".`,
    );
  }
  return fallback;
}

export const env = {
  /** Canonical origin of the deployed site. No trailing slash. */
  siteUrl: read("VITE_SITE_URL", "https://aswenna.veyra.lk").replace(
    /\/+$/,
    "",
  ),

  /**
   * Where the contact form POSTs. It must accept a JSON body and answer 2xx
   * on success. FormSubmit, Formspree, Web3Forms and your own endpoint all
   * fit; changing services means changing this one value.
   */
  contactEndpoint: read(
    "VITE_CONTACT_ENDPOINT",
    "https://formsubmit.co/ajax/info@veyra.lk",
  ),
  /**
   * Web3Forms public access key. When set, the form sends a Web3Forms-shaped
   * payload (access_key, name, email, subject, message, botcheck). Leave
   * blank for FormSubmit-style relays. A public form key, not a secret.
   */
  web3formsKey: (
    (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined) ?? ""
  ).trim(),
  /** How long to wait for the relay before showing the error state, in ms. */
  contactTimeoutMs: Number(read("VITE_CONTACT_TIMEOUT_MS", "15000")) || 15000,
} as const;
