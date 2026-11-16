import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { engine } from "../data/content";
import { useI18n } from "../i18n";
import { pad2 } from "../lib/util";
import { useOnScreen, useRafLoop, useReducedMotion } from "../hooks";

const RADIUS = 40; // ring radius, as a percentage of the box
const DWELL_MS = 2600; // how long the loop rests on each stage
const RESUME_MS = 6000; // how long a manual choice is held before the loop restarts
const TRAIL_DEG = 54; // length of the comet trail behind the packet

const COUNT = engine.stages.length;
const STEP = 360 / COUNT;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TRAIL_LEN = (TRAIL_DEG / 360) * CIRCUMFERENCE;

const pointAt = (deg: number, r = RADIUS) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
};

/**
 * The five-stage loop. A packet travels the ring and each stage lights as it
 * passes.
 *
 * Choosing a stage by hand does not stop the loop for good: the choice is
 * held for RESUME_MS and then the rotation picks up again from there. An
 * animation that a visitor can accidentally switch off permanently is a
 * dead diagram, and most people never click it a second time to find out.
 * Hovering still pauses it outright, because that is a deliberate "let me
 * read this" and it ends the moment the pointer leaves.
 */
export default function EngineSection() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const ring = useRef<HTMLDivElement>(null);
  const visible = useOnScreen(ring, { threshold: 0.2 });

  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  // Animation state lives in refs: none of it should trigger a render.
  const angle = useRef(0);
  const current = useRef(0);
  const sinceStep = useRef(0);
  const holdUntil = useRef(0);
  const hovered = useRef(false);
  const interacted = useRef(false);

  const trail = useRef<SVGCircleElement>(null);
  const packet = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (trail.current) {
      trail.current.style.strokeDasharray = `${TRAIL_LEN} ${CIRCUMFERENCE - TRAIL_LEN}`;
    }
  }, []);

  const select = useCallback((i: number, fromUser = false) => {
    const next = ((i % COUNT) + COUNT) % COUNT;
    angle.current = next * STEP;
    setActive(next);
    if (fromUser) {
      interacted.current = true;
      sinceStep.current = 0;
      // Hold here, then hand control back to the loop.
      holdUntil.current = performance.now() + RESUME_MS;
      setHeld(true);
    }
  }, []);

  useRafLoop(visible && !reduced, (dt, now) => {
    const holding = now < holdUntil.current;
    if (held !== holding) setHeld(holding);

    if (!hovered.current && !holding) {
      sinceStep.current += dt;
      if (sinceStep.current >= DWELL_MS) {
        sinceStep.current = 0;
        setActive((prev) => {
          const next = (prev + 1) % COUNT;
          angle.current = next * STEP;
          return next;
        });
      }
    }

    // Always travel forwards around the ring.
    let delta = angle.current - (current.current % 360);
    if (delta < -1) delta += 360;
    current.current += delta * 0.08;

    const pos = pointAt(current.current);
    packet.current?.setAttribute("cx", pos.x.toFixed(2));
    packet.current?.setAttribute("cy", pos.y.toFixed(2));
    if (trail.current) {
      trail.current.style.strokeDashoffset = String(
        CIRCUMFERENCE - (current.current / 360) * CIRCUMFERENCE,
      );
    }
  });

  const stage = engine.stages[active];

  return (
    <section className="section section--dark engine" id="engine" data-dark>
      <div className="container">
        <SectionHead {...engine} display keyBase="engine" />

        <div className="eloop">
          <Reveal className="eloop__ring-wrap">
            <div
              className={`eloop__ring${held ? " is-held" : ""}`}
              ref={ring}
              onMouseEnter={() => {
                hovered.current = true;
              }}
              onMouseLeave={() => {
                hovered.current = false;
              }}
            >
              <svg viewBox="0 0 100 100" className="eloop__svg" aria-hidden="true">
                <circle cx="50" cy="50" r={RADIUS} className="eloop__track" />
                <circle
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  className="eloop__trail"
                  transform="rotate(-90 50 50)"
                  ref={trail}
                />
                <circle cx="50" cy="10" r={2.1} className="eloop__packet" ref={packet} />
              </svg>

              {engine.stages.map((s, i) => {
                const pos = pointAt(i * STEP);
                return (
                  <button
                    type="button"
                    key={s.name}
                    className={`eloop__node${i === active ? " is-active" : ""}`}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    aria-pressed={i === active}
                    onClick={() => select(i, true)}
                    onFocus={() => select(i, true)}
                  >
                    <span className="eloop__node-icon">
                      <Icon name={s.icon} />
                    </span>
                    <span className="eloop__node-name">{t(`engine.stages.${i}.name`, s.name)}</span>
                  </button>
                );
              })}

              <div className="eloop__centre" aria-live={interacted.current ? "polite" : "off"}>
                <span className="eloop__centre-step">
                  Stage {pad2(active + 1)} / {pad2(COUNT)}
                </span>
                <h3 className="eloop__centre-name" key={active}>
                  {t(`engine.stages.${active}.name`, stage.name)}
                </h3>
                <p className="eloop__centre-text">{t(`engine.stages.${active}.text`, stage.text)}</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="eloop__aside" delay={120}>
            <ol className="eloop__list">
              {engine.stages.map((s, i) => (
                <li key={s.name}>
                  <button
                    type="button"
                    className={`eloop__row${i === active ? " is-active" : ""}`}
                    aria-pressed={i === active}
                    onClick={() => select(i, true)}
                  >
                    <span className="eloop__row-n">{pad2(i + 1)}</span>
                    <span className="eloop__row-name">{t(`engine.stages.${i}.name`, s.name)}</span>
                  </button>
                </li>
              ))}
            </ol>

            {/* Says out loud that the loop takes itself back, so a visitor who
                clicked a stage knows the diagram has not stalled. */}
            <p className={`eloop__note${held ? " is-held" : ""}`}>
              <Icon name="refresh" />
              <span>
                {reduced
                  ? t("engine.note", engine.note)
                  : held
                    ? t("engine.heldNote", engine.heldNote)
                    : t("engine.note", engine.note)}
              </span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
