import { useRef, useState } from "react";
import { partners } from "../data/content";
import { useI18n } from "../i18n";
import { useReducedMotion } from "../hooks";

/**
 * The partner strip. It scrolls itself, pauses on hover and keyboard focus,
 * and stays a plain scrollable row for anyone who has asked for reduced
 * motion.
 *
 * The band is dark on purpose: the supplied IIT mark has a white wordmark
 * that vanishes on a light background, and the supplied ATP mark is black
 * line art that vanishes on a dark one. On the dark band IIT works as
 * supplied and ATP is inverted in CSS.
 */
export default function LogoStrip() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);

  const classes = [
    "logos__viewport",
    reduced ? "is-static" : "is-running",
    paused && !reduced ? "is-paused" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="logos" aria-label={t("partners.label", partners.label)}>
      <div className="container logos__head">
        <span className="logos__label">{t("partners.label", partners.label)}</span>
        <span className="logos__note">{t("partners.note", partners.note)}</span>
      </div>

      <div
        className={classes}
        ref={viewport}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <ul className="logos__track">
          {[0, 1].map((dup) =>
            partners.logos.map((logo) => (
              <li
                className={`logos__item ${logo.cls}`}
                key={`${dup}-${logo.src}`}
                aria-hidden={dup ? true : undefined}
              >
                <img src={logo.src} alt={dup ? "" : logo.alt} loading="lazy" />
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}
