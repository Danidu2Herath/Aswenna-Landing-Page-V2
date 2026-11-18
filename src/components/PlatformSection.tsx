import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import Phone from "./app/Phone";
import { SCREENS } from "./app/screens";
import { platform, platformScreens, appUi } from "../data/content";
import { useI18n } from "../i18n";
import { useOnScreen, useReducedMotion } from "../hooks";

/**
 * The app showcase: one device in the middle, the screen names above it with
 * the current one picked out, and arrows either side to step through.
 *
 * It advances on its own so a visitor who touches nothing still sees all ten
 * screens. Any deliberate action — an arrow, a name, a swipe — takes the
 * carousel over and holds it; the cycle resumes a while later so the thing
 * never ends up permanently stopped on screen 03 because somebody clicked
 * once and walked away.
 *
 * Every entry has a real designed screen behind it, so nothing in here is a
 * grey rectangle standing in for a screenshot.
 */
const DWELL_MS = 4600; // how long the carousel rests on each screen
const RESUME_MS = 12000; // how long a deliberate choice is held
const SWIPE_PX = 44; // horizontal travel that counts as a swipe

const COUNT = platformScreens.length;

export default function PlatformSection() {
  const { t } = useI18n();
  const reduced = useReducedMotion();

  const stage = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(stage, { threshold: 0.3 });

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState(1);

  const resumeTimer = useRef<number | undefined>(undefined);
  const touchX = useRef<number | null>(null);
  const names = useRef<HTMLUListElement>(null);

  const go = useCallback((next: number, fromUser = false) => {
    setActive((prev) => {
      const i = ((next % COUNT) + COUNT) % COUNT;
      setDir(i === (prev + 1) % COUNT ? 1 : i === (prev - 1 + COUNT) % COUNT ? -1 : i > prev ? 1 : -1);
      return i;
    });
    if (fromUser) {
      setPaused(true);
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = window.setTimeout(() => setPaused(false), RESUME_MS);
    }
  }, []);

  // The interval would otherwise close over a stale `active`, and rebuilding
  // it on every step would reset the dwell. It reads the current value here.
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (!onScreen || paused || reduced) return;
    const id = window.setInterval(() => go(activeRef.current + 1), DWELL_MS);
    return () => window.clearInterval(id);
  }, [onScreen, paused, reduced, go]);

  useEffect(() => () => window.clearTimeout(resumeTimer.current), []);

  /* Keep the active name in view inside its own strip.

     This must NOT use scrollIntoView. That method scrolls every scrollable
     ancestor, the document included, so each time the carousel advanced it
     dragged the whole page back towards the section — the page oscillated a
     couple of dozen pixels and could not be scrolled past. Setting
     scrollLeft moves the strip and nothing else. */
  useEffect(() => {
    const strip = names.current;
    if (!strip) return;
    if (strip.scrollWidth <= strip.clientWidth + 1) return; // nothing to scroll
    const btn = strip.children[active]?.firstElementChild as HTMLElement | undefined;
    if (!btn) return;
    const target = btn.offsetLeft - (strip.clientWidth - btn.offsetWidth) / 2;
    strip.scrollTo({ left: Math.max(0, target), behavior: reduced ? "auto" : "smooth" });
  }, [active, reduced]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1, true); }
  };

  const name = platformScreens[active];
  const { Screen, tab, meta, path } = SCREENS[name];
  const screenCopy = platform.screens[active];

  return (
    <section className="section section--band" id="platform">
      <div className="container">
        <SectionHead {...platform} keyBase="platform" />

        <Reveal>
          <div
            className="pcar"
            ref={stage}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onKeyDown={onKey}
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > SWIPE_PX) go(active + (dx < 0 ? 1 : -1), true);
              touchX.current = null;
            }}
            role="group"
            aria-roledescription="carousel"
            aria-label={t("platform.title", platform.title)}
            tabIndex={0}
          >
            {/* The names ride above the device. On a narrow screen the strip
                scrolls sideways and keeps the active one in view. */}
            <ul className="pcar__names" ref={names} role="tablist" aria-label={t("platform.title", platform.title)}>
              {platform.screens.map((s, i) => (
                <li key={s.name} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    tabIndex={i === active ? 0 : -1}
                    className={`pcar__name${i === active ? " is-active" : ""}`}
                    onClick={() => go(i, true)}
                  >
                    <span className="pcar__name-n">{String(i + 1).padStart(2, "0")}</span>
                    {t(`platform.screens.${i}.name`, s.name)}
                  </button>
                </li>
              ))}
            </ul>

            <div className="pcar__stage">
              <button
                type="button"
                className="pcar__arrow pcar__arrow--prev"
                onClick={() => go(active - 1, true)}
                aria-label={t("platform.prev", "Previous screen")}
              >
                <Icon name="chevron-down" />
              </button>

              <div className="pcar__device">
                {/* `key` remounts the device so each step animates in from the
                    side it arrived from. */}
                <Phone
                  key={name}
                  tab={tab}
                  size="md"
                  concept={false}
                  className={dir > 0 ? "is-next" : "is-prev"}
                  label={`${t(`${path}.title`, meta.title)} — interface design concept for the Aswenna application`}
                >
                  <Screen />
                </Phone>
              </div>

              <button
                type="button"
                className="pcar__arrow pcar__arrow--next"
                onClick={() => go(active + 1, true)}
                aria-label={t("platform.next", "Next screen")}
              >
                <Icon name="chevron-down" />
              </button>
            </div>

            <div className="pcar__caption" aria-live="polite">
              <p className="pcar__caption-text">{t(`platform.screens.${active}.text`, screenCopy.text)}</p>
              <span className="phone__concept">
                <Icon name="info" />
                {t("appUi.conceptNote", appUi.conceptNote)}
              </span>
            </div>

            <ol className="pcar__dots" aria-hidden="true">
              {platformScreens.map((s, i) => (
                <li key={s} className={`pcar__dot${i === active ? " is-active" : ""}`}>
                  {i === active && !paused && !reduced && onScreen ? (
                    <span className="pcar__dot-fill" style={{ animationDuration: `${DWELL_MS}ms` }} />
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
