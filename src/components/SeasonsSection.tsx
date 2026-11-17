import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { seasons } from "../data/content";
import { useI18n } from "../i18n";
import { useMediaQuery, useOnScreen, useReducedMotion } from "../hooks";

/**
 * The four stages of a season, as rows that open one at a time.
 *
 * Left alone, the stack cycles itself so a visitor who never moves the
 * pointer still sees all four. Hovering or clicking a row takes the cycle
 * over and holds it; a moment after the pointer leaves, the cycle resumes
 * from wherever the visitor left it.
 *
 * Hover does not exist on a touch screen, so there it is a tap, and a tap
 * holds for longer because there is no "pointer left" event to resume on.
 * Hover is also held for a moment before it commits: without that, dragging
 * the pointer across the stack flickers through every row on the way.
 */
const HOVER_DELAY = 110; // settle time before a hover commits
const DWELL_MS = 4200; // how long the cycle rests on each stage
const RESUME_MS = 1400; // after the pointer leaves, before the cycle restarts
const TAP_RESUME_MS = 9000; // a tap has no "leave", so it holds much longer

const COUNT = seasons.stages.length;

export default function SeasonsSection() {
  const { t } = useI18n();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();

  const root = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(root, { threshold: 0.25 });

  const [open, setOpen] = useState(0);
  const [paused, setPaused] = useState(false);

  const hoverTimer = useRef<number | undefined>(undefined);
  const resumeTimer = useRef<number | undefined>(undefined);

  /** Stops the cycle, then schedules it to start again after `after` ms. */
  const hold = useCallback((after: number) => {
    setPaused(true);
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), after);
  }, []);

  // The cycle. It only runs while the section is on screen, so it costs
  // nothing for the rest of the page, and never while a visitor is reading.
  useEffect(() => {
    if (!onScreen || paused || reduced) return;
    const id = window.setInterval(() => setOpen((i) => (i + 1) % COUNT), DWELL_MS);
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
    hoverTimer.current = window.setTimeout(() => setOpen(i), HOVER_DELAY);
  };

  const leave = () => {
    window.clearTimeout(hoverTimer.current);
    if (canHover) hold(RESUME_MS);
  };

  const click = (i: number) => {
    setOpen(i);
    hold(canHover ? RESUME_MS : TAP_RESUME_MS);
  };

  return (
    <section className="section" id="seasons">
      <div className="container">
        <SectionHead {...seasons} center={false} keyBase="seasons" />

        <div className="stages" ref={root} onMouseLeave={leave}>
          {seasons.stages.map((s, i) => {
            const isOpen = i === open;
            return (
              <Reveal delay={i * 60} key={s.title}>
                <div
                  className={`stage${isOpen ? " is-open" : ""}`}
                  onMouseEnter={() => enter(i)}
                >
                  {isOpen ? (
                    <>
                      <img className="stage__photo" src={s.photo} alt="" aria-hidden="true" loading="lazy" />
                      <span className="stage__veil" aria-hidden="true" />
                    </>
                  ) : null}

                  <h3>
                    <button
                      type="button"
                      className="stage__btn"
                      aria-expanded={isOpen}
                      aria-controls={`stage-${i}`}
                      onClick={() => click(i)}
                    >
                      <span className="stage__n">{String(i + 1).padStart(2, "0")}</span>
                      <span className="stage__title">{t(`seasons.stages.${i}.title`, s.title)}</span>
                      <span className="stage__when">{t(`seasons.stages.${i}.when`, s.when)}</span>
                      <span className="stage__sign" aria-hidden="true">
                        <Icon name={isOpen ? "minus" : "plus"} />
                      </span>
                    </button>
                  </h3>

                  <div className="stage__body" id={`stage-${i}`} hidden={!isOpen}>
                    <p className="stage__text">{t(`seasons.stages.${i}.text`, s.text)}</p>
                    <div className="stage__does">
                      <strong>{t(`seasons.stages.${i}.callout.label`, s.callout.label)}</strong>
                      <span>{t(`seasons.stages.${i}.callout.text`, s.callout.text)}</span>
                      <a className="stage__link" href={s.href}>
                        {s.link}
                        <Icon name="arrow-right" />
                      </a>
                    </div>
                  </div>

                  {/* A thin bar that drains while this stage is the open one,
                      so the cycle is legible rather than surprising. */}
                  {isOpen && !paused && !reduced && onScreen ? (
                    <span
                      className="stage__timer"
                      aria-hidden="true"
                      key={`t${i}`}
                      style={{ animationDuration: `${DWELL_MS}ms` }}
                    />
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
