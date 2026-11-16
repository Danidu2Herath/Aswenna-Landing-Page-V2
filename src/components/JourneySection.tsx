import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import Plant from "./Plant";
import AppPhone from "./app/AppPhone";
import { journey } from "../data/content";
import { useI18n } from "../i18n";
import { clamp01, docTop, rafThrottle, scrollBehavior } from "../lib/util";
import { useMediaQuery, useReducedMotion } from "../hooks";

/**
 * The growth journey has two presentations, and only one is ever live.
 *
 * DESKTOP — the section pins and the crop grows as you scroll through it.
 *
 * TOUCH / NARROW / REDUCED MOTION — the "growing spine": a vertical timeline
 * with the crop in a STICKY viewer above it. The crop still grows
 * continuously with scroll, but the page is never pinned, so the visitor
 * keeps the one gesture a phone gives them.
 *
 * Sticky is not pinned. The section is an ordinary height, scrolling never
 * stalls, and flicking past it costs one swipe instead of six — which is
 * what made the pinned scrub, and then the horizontal card row, impractical
 * on a phone. Growth also reads top-to-bottom here, which is both the
 * natural direction of a phone and the direction a plant actually grows.
 *
 * The query below is matched to the breakpoint in _mobilejourney.scss so the
 * two presentations can never both be live.
 */
const SCRUB_QUERY = "(min-width: 981px) and (pointer: fine)";
const STAGES = journey.stages.length;

export default function JourneySection() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const wide = useMediaQuery(SCRUB_QUERY);
  const scrubbing = wide && !reduced;

  const scroller = useRef<HTMLDivElement>(null);
  const spineList = useRef<HTMLOListElement>(null);
  const spineViewer = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [spine, setSpine] = useState(0);

  /* ------------------------------------------------- the desktop scrub */
  useEffect(() => {
    if (!scrubbing) return;
    const el = scroller.current;
    if (!el) return;

    const render = rafThrottle(() => {
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const next = travel > 0 ? clamp01(-rect.top / travel) : rect.top <= 0 ? 1 : 0;
      // Quantised: 240 steps across the whole scrub is past the eye's
      // resolution and keeps React out of a per-frame render.
      setProgress((prev) => (Math.abs(prev - next) < 1 / 240 ? prev : next));
    });

    render();
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", render, { passive: true });
    return () => {
      window.removeEventListener("scroll", render);
      window.removeEventListener("resize", render);
    };
  }, [scrubbing]);

  const active = Math.min(STAGES - 1, Math.floor(progress * STAGES));
  const now = journey.stages[active];

  const jumpTo = useCallback((i: number) => {
    const el = scroller.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    if (travel <= 0) return;
    window.scrollTo({
      top: docTop(el) + travel * ((i + 0.4) / STAGES),
      behavior: scrollBehavior(),
    });
  }, []);

  /* ------------------------------------------------- the growing spine */
  /* Progress is how much of the stage list has travelled past the bottom of
     the sticky viewer. No pinning is involved: the viewer sticks, the page
     scrolls, and the crop is drawn from the same 0..1 value the desktop
     scrub uses. */
  useEffect(() => {
    if (scrubbing) return;
    const list = spineList.current;
    if (!list) return;

    const render = rafThrottle(() => {
      const viewer = spineViewer.current;
      const rect = list.getBoundingClientRect();
      const anchor = viewer ? viewer.getBoundingClientRect().bottom : window.innerHeight * 0.45;
      const travel = rect.height;
      const next = travel > 0 ? clamp01((anchor - rect.top) / travel) : 0;
      setSpine((prev) => (Math.abs(prev - next) < 1 / 160 ? prev : next));
    });

    render();
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", render, { passive: true });
    return () => {
      window.removeEventListener("scroll", render);
      window.removeEventListener("resize", render);
    };
  }, [scrubbing]);

  const spineIndex = Math.min(STAGES - 1, Math.max(0, Math.floor(spine * STAGES)));
  const spineStage = journey.stages[spineIndex];

  /**
   * Tapping a node scrolls until the reading anchor — the bottom edge of the
   * sticky viewer — sits in the MIDDLE of that stage. Landing the stage's top
   * edge on the anchor instead would leave the previous stage still active,
   * which is how the first attempt at this read as "off by one".
   */
  const goToStage = (i: number) => {
    const target = spineList.current?.children[i] as HTMLElement | undefined;
    const viewer = spineViewer.current;
    if (!target || !viewer) return;

    const stickyTop = Number.parseFloat(getComputedStyle(viewer).top) || 0;
    const anchor = stickyTop + viewer.getBoundingClientRect().height;
    const middle = target.getBoundingClientRect().height / 2;

    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - anchor + middle,
      behavior: scrollBehavior(),
    });
  };

  return (
    <section className="section--dark journey" id="journey" data-dark>
      {/* ------------------------------------------------ desktop scrub */}
      <div
        className="journey__scroller"
        ref={scroller}
        style={{ "--stages": STAGES } as React.CSSProperties}
      >
        <div className="journey__pin">
          <div className="container journey__layout">
            <div className="journey__copy">
              <SectionHead {...journey} center={false} display keyBase="journey" />

              <div className="journey__now" key={active}>
                <span className="journey__now-num">{now.n}</span>
                <h3 className="journey__now-name">{t(`journey.stages.${active}.name`, now.name)}</h3>
                <p className="journey__now-text">{t(`journey.stages.${active}.text`, now.text)}</p>
              </div>

              <ol className="journey__rail" aria-label="Growth stages">
                {journey.stages.map((s, i) => (
                  <li key={s.name}>
                    <button
                      type="button"
                      className={`journey__tick${i === active ? " is-active" : ""}${i < active ? " is-done" : ""}`}
                      aria-current={i === active ? "step" : undefined}
                      onClick={() => jumpTo(i)}
                    >
                      <span className="journey__tick-dot" aria-hidden="true" />
                      <span className="journey__tick-label">{t(`journey.stages.${i}.name`, s.name)}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="journey__visual">
              {scrubbing ? <Plant progress={Math.min(progress / 0.92, 1)} /> : null}
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------- the growing spine */}
      <div className="journey__steps">
        <div className="container">
          <SectionHead {...journey} center={false} display keyBase="journey" />
        </div>

        <div className="container jspine">
          {/* Sticky, not pinned: the page keeps scrolling underneath it. */}
          <div className="jspine__viewer" ref={spineViewer}>
            <div className="jspine__art">
              {!scrubbing ? <Plant progress={Math.min(spine / 0.92, 1)} /> : null}
            </div>
            <div className="jspine__meta">
              <span className="jspine__meta-num">{spineStage.n}</span>
              <span className="jspine__meta-name">
                {t(`journey.stages.${spineIndex}.name`, spineStage.name)}
              </span>
              <span className="jspine__bar" aria-hidden="true">
                <i style={{ transform: `scaleX(${spine.toFixed(3)})` }} />
              </span>
            </div>
          </div>

          <ol className="jspine__list" ref={spineList}>
            {journey.stages.map((s, i) => (
              <li
                className={`jspine__step${i === spineIndex ? " is-on" : ""}${i < spineIndex ? " is-done" : ""}`}
                key={s.name}
              >
                <button
                  type="button"
                  className="jspine__node"
                  aria-current={i === spineIndex ? "step" : undefined}
                  onClick={() => goToStage(i)}
                >
                  {i < spineIndex ? (
                    <Icon name="check" />
                  ) : (
                    <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  )}
                  <span className="sr-only">{t(`journey.stages.${i}.name`, s.name)}</span>
                </button>
                <div className="jspine__body">
                  <h3 className="jspine__name">{t(`journey.stages.${i}.name`, s.name)}</h3>
                  <p className="jspine__text">{t(`journey.stages.${i}.text`, s.text)}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="jspine__tail" aria-hidden="true" />
        </div>
      </div>

      {/* ------------------------------------------------- adapts panel */}
      <div className="section section--tight container">
        <Reveal>
          <div className="journey__adapts">
            <div className="journey__adapts-copy">
              <h3 className="journey__adapts-title">{t("journey.adapts.title", journey.adapts.title)}</h3>
              <p className="journey__adapts-sub">{t("journey.adapts.sub", journey.adapts.sub)}</p>
              <ul className="journey__adapts-list">
                {journey.adapts.items.map((item, i) => (
                  <li key={item}>
                    <span className="journey__tick-check">
                      <Icon name="check" />
                    </span>
                    {t(`journey.adapts.items.${i}`, item)}
                  </li>
                ))}
              </ul>
            </div>
            {/* The calendar screen replaces the decorative gradient panel:
                this is the thing that actually rewrites itself. */}
            <div className="journey__phone">
              <AppPhone screen="calendar" size="sm" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
