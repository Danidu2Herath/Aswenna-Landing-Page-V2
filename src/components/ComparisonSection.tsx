import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { comparison } from "../data/content";
import { imgSize } from "../data/imageSizes";
import { useI18n } from "../i18n";
import { useMediaQuery, useOnScreen, useReducedMotion } from "../hooks";

/**
 * One decision at a time, shown both ways.
 *
 * This was sixteen pills - eight "without" against eight "with" - which on a
 * phone became sixteen near-identical cards over 2,000px, each repeating the
 * same two labels. Nothing to look at and nothing to hold on to.
 *
 * Now the eight decisions are a list you move through, and the panel beside
 * it shows that one comparison against the photograph it belongs to. It
 * cycles on its own so a visitor who touches nothing still sees the range,
 * and hovering, focusing or tapping takes it over.
 */
const DWELL_MS = 4800;
const RESUME_MS = 1600;
const TAP_RESUME_MS = 9000;
const HOVER_DELAY = 110;

const COUNT = comparison.rows.length;

export default function ComparisonSection() {
  const { t } = useI18n();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();

  const root = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(root, { threshold: 0.25 });

  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const hoverTimer = useRef<number | undefined>(undefined);
  const resumeTimer = useRef<number | undefined>(undefined);

  const hold = useCallback((after: number) => {
    setPaused(true);
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), after);
  }, []);

  useEffect(() => {
    if (!onScreen || paused || reduced) return;
    const id = window.setInterval(() => setAt((i) => (i + 1) % COUNT), DWELL_MS);
    return () => window.clearInterval(id);
  }, [onScreen, paused, reduced]);

  useEffect(
    () => () => {
      window.clearTimeout(hoverTimer.current);
      window.clearTimeout(resumeTimer.current);
    },
    [],
  );

  const enter = (i: number) => {
    if (!canHover) return;
    setPaused(true);
    window.clearTimeout(resumeTimer.current);
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setAt(i), HOVER_DELAY);
  };

  const row = comparison.rows[at];
  const without = t("comparison.withoutLabel", comparison.withoutLabel);
  const withLabel = t("comparison.withLabel", comparison.withLabel);

  return (
    <section className="section section--alt" id="approach">
      <div className="container">
        <SectionHead {...comparison} keyBase="comparison" />

        <Reveal>
          <div
            className="cmp"
            ref={root}
            onMouseLeave={() => {
              window.clearTimeout(hoverTimer.current);
              if (canHover) hold(RESUME_MS);
            }}
          >
            {/* The eight decisions. A list on a wide screen, a scrolling
                chip row on a narrow one. */}
            <ul className="cmp__list" role="tablist" aria-label={t("comparison.title", comparison.title)}>
              {comparison.rows.map((r, i) => (
                <li key={r.label} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={i === at}
                    tabIndex={i === at ? 0 : -1}
                    className={`cmp__pick${i === at ? " is-active" : ""}`}
                    onMouseEnter={() => enter(i)}
                    onFocus={() => setAt(i)}
                    onClick={() => {
                      setAt(i);
                      hold(canHover ? RESUME_MS : TAP_RESUME_MS);
                    }}
                  >
                    <span className="cmp__pick-n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="cmp__pick-label">{t(`comparison.rows.${i}.label`, r.label)}</span>
                    {i === at && !paused && !reduced && onScreen ? (
                      <span className="cmp__pick-timer" aria-hidden="true" style={{ animationDuration: `${DWELL_MS}ms` }} />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>

            <div className="cmp__panel" aria-live="polite">
              <img
                className="cmp__photo"
                src={row.photo}
                alt=""
                aria-hidden="true"
                loading="lazy"
                key={row.photo}
                {...imgSize(row.photo)}
              />
              <span className="cmp__scrim" aria-hidden="true" />

              <div className="cmp__body" key={at}>
                <p className="cmp__decision">{t(`comparison.rows.${at}.label`, row.label)}</p>

                <div className="cmp__side cmp__side--without">
                  <span className="cmp__tag">
                    <Icon name="x" />
                    {without}
                  </span>
                  <p className="cmp__text">{t(`comparison.rows.${at}.without`, row.without)}</p>
                </div>

                <div className="cmp__side cmp__side--with">
                  <span className="cmp__tag cmp__tag--with">
                    <Icon name="check" />
                    {withLabel}
                  </span>
                  <p className="cmp__text cmp__text--with">{t(`comparison.rows.${at}.with`, row.with)}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
