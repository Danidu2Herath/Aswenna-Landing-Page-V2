import { useRef, useState } from "react";
import Icon from "./Icon";
import Reveal from "./Reveal";
import { contact, contactDetails } from "../data/content";
import { useI18n } from "../i18n";
import { env } from "../env";

/* ===========================================================================
   WHERE THE FORM SENDS
   ---------------------------------------------------------------------------
   This is a static site: there is no server of ours to post to, so the form
   hands off to Formspree, which emails the submission on.

   The relay URL is configuration, not code - it lives in .env as
   VITE_CONTACT_ENDPOINT (https://formspree.io/f/<form id>). See src/env.ts
   for why it is not, and cannot be, a secret, and .env.example for how to
   set it. The destination inbox and the allowed domains are set in the
   Formspree dashboard.
   =========================================================================== */

type View = "form" | "success" | "error";
type Field = keyof typeof contact.fields;

const TEXT_FIELDS: {
  name: Field;
  type: string;
  required: boolean;
  wide?: boolean;
}[] = [
  { name: "firstName", type: "text", required: true },
  { name: "lastName", type: "text", required: true },
  { name: "phone", type: "tel", required: true },
  { name: "district", type: "text", required: true },
  { name: "email", type: "email", required: true, wide: true },
  { name: "location", type: "text", required: false },
];

export default function ContactSection() {
  const { t } = useI18n();
  const form = useRef<HTMLFormElement>(null);
  const [view, setView] = useState<View>("form");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ text: string; tone?: "error" } | null>(
    null,
  );
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});

  /** Browser validation, surfaced inline rather than as a native bubble. */
  const validate = () => {
    const el = form.current;
    if (!el) return false;
    const next: Record<string, boolean> = {};
    let firstBad: HTMLElement | null = null;

    for (const control of el.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >("input, textarea")) {
      if (control.name === "_gotcha") continue;
      const bad = !control.checkValidity();
      next[control.name] = bad;
      if (bad && !firstBad) firstBad = control;
    }

    setInvalid(next);
    if (firstBad) {
      setStatus({
        text: t("contact.checkFields", "Please check the highlighted fields."),
        tone: "error",
      });
      firstBad.focus();
      return false;
    }
    setStatus(null);
    return true;
  };

  const markField = (control: HTMLInputElement | HTMLTextAreaElement) => {
    if (!control.value && !control.required) {
      // A cleared optional field is no longer invalid.
      setInvalid((prev) => ({ ...prev, [control.name]: false }));
      return;
    }
    setInvalid((prev) => ({
      ...prev,
      [control.name]: !control.checkValidity(),
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return; // ignore a second submit while one is in flight
    if (!validate()) return;

    // Read the form before the first await: currentTarget is only reliable
    // synchronously.
    const raw = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    ) as Record<string, string>;
    if (raw._gotcha) return; // a bot filled the honeypot

    // Trim values and drop blanks so the email lists only what was entered.
    const data: Record<string, string> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (key === "_gotcha") continue;
      const clean = typeof value === "string" ? value.trim() : "";
      if (clean) data[key] = clean;
    }

    const fullName = `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();

    // Formspree: flat JSON. `email` becomes the reply-to, `_subject` the
    // subject line, and every other key is listed in the email.
    const payload = {
      ...data,
      _subject: `Aswenna enquiry - ${fullName}`,
      page: window.location.href,
      submittedAt: new Date().toISOString(),
    };

    setBusy(true);
    setStatus({ text: t("contact.sending", contact.sending) });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), env.contactTimeoutMs);

    try {
      const res = await fetch(env.contactEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      // Formspree answers 200 {"ok":true} on success and 4xx with an
      // "errors" array when it rejects the submission.
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(
          `Relay answered ${res.status}: ${JSON.stringify(detail?.errors ?? detail)}`,
        );
      }

      form.current?.reset();
      setInvalid({});
      setStatus(null);
      setView("success");
    } catch (err) {
      // Timeout, offline, blocked, or a non-2xx answer all land here.
      console.error("Contact form failed:", err);
      setStatus(null);
      setView("error");
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  };

  const label = (name: Field, required: boolean) => (
    <label htmlFor={name}>
      <span>
        {t(`contact.fields.${name}.label`, contact.fields[name].label)}
      </span>
      {required ? (
        <>
          {" "}
          <span className="field__req" aria-hidden="true">
            *
          </span>
        </>
      ) : null}
    </label>
  );

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="contact__layout">
          <Reveal className="contact__intro">
            <span className="eyebrow">
              {t("contact.eyebrow", contact.eyebrow)}
            </span>
            <h2 className="contact__title">
              {t("contact.title", contact.title)}
            </h2>
            <p className="contact__text">{t("contact.text", contact.text)}</p>
            <p className="contact__note">{t("contact.note", contact.note)}</p>
            <ul className="contact__details">
              <li>
                <Icon name="mail" />
                <a href={`mailto:${contactDetails.email}`}>
                  {contactDetails.email}
                </a>
              </li>
              {contactDetails.phones.map((phone) => (
                <li key={phone.href}>
                  <Icon name="phone" />
                  <a href={phone.href}>{phone.label}</a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="contact__form-wrap" delay={100}>
            <form
              className="contact__form"
              ref={form}
              noValidate
              hidden={view !== "form"}
              aria-busy={busy}
              onSubmit={onSubmit}>
              {TEXT_FIELDS.map((f) => (
                <div
                  className={`field${f.wide ? " field--wide" : ""}${invalid[f.name] ? " is-invalid" : ""}`}
                  key={f.name}>
                  {label(f.name, f.required)}
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    required={f.required}
                    aria-invalid={invalid[f.name] ? true : undefined}
                    placeholder={t(
                      `contact.fields.${f.name}.placeholder`,
                      contact.fields[f.name].placeholder,
                    )}
                    onBlur={(e) => markField(e.currentTarget)}
                  />
                </div>
              ))}

              <div className={`field${invalid["size"] ? " is-invalid" : ""}`}>
                {label("size", false)}
                <div className="field__group">
                  <input
                    id="size"
                    name="size"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    aria-invalid={invalid["size"] ? true : undefined}
                    placeholder={t(
                      "contact.fields.size.placeholder",
                      contact.fields.size.placeholder,
                    )}
                    onBlur={(e) => markField(e.currentTarget)}
                  />
                  <span className="field__unit">
                    {t("contact.unitHectares", "hectares")}
                  </span>
                </div>
              </div>

              <div
                className={`field field--wide${invalid["message"] ? " is-invalid" : ""}`}>
                {label("message", false)}
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder={t(
                    "contact.fields.message.placeholder",
                    contact.fields.message.placeholder,
                  )}
                  onBlur={(e) => markField(e.currentTarget)}
                />
              </div>

              {/* Honeypot: bots fill this, people never see it. */}
              <input
                type="text"
                name="_gotcha"
                className="field__trap"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <p className="contact__consent">
                {t("contact.consent", contact.consent)}
              </p>

              <button
                type="submit"
                className="btn btn--primary btn--lg contact__submit"
                disabled={busy}>
                <span className="contact__submit-label">
                  {busy
                    ? t("contact.sending", contact.sending)
                    : t("contact.submit", contact.submit)}
                </span>
                <Icon name="send" />
              </button>

              <p
                className={`contact__status${status?.tone ? ` contact__status--${status.tone}` : ""}`}
                role="status"
                aria-live="polite"
                hidden={!status}>
                {status?.text ?? ""}
              </p>
            </form>

            <div className="contact__result" hidden={view !== "success"}>
              <span className="contact__result-icon contact__result-icon--ok">
                <Icon name="check" />
              </span>
              <strong>{t("contact.successTitle", contact.successTitle)}</strong>
              <p>{t("contact.successText", contact.successText)}</p>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setView("form")}>
                {t("contact.again", contact.again)}
              </button>
            </div>

            <div
              className="contact__result contact__result--error"
              hidden={view !== "error"}>
              <span className="contact__result-icon contact__result-icon--bad">
                <Icon name="x" />
              </span>
              <strong>{t("contact.errorTitle", contact.errorTitle)}</strong>
              <p>{t("contact.errorText", contact.errorText)}</p>
              {/* The address is repeated here so an enquiry is never simply lost. */}
              <p className="contact__result-fallback">
                <Icon name="mail" />
                <a href={`mailto:${contactDetails.email}`}>
                  {contactDetails.email}
                </a>
              </p>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setView("form")}>
                {t("contact.retry", contact.retry)}
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
