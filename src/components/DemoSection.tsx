import { useCallback, useRef, useState } from "react";
import Chip from "./Chip";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { demo } from "../data/content";
import { useI18n } from "../i18n";
import { clamp } from "../lib/util";
import { useOnScreen, useRafLoop, useReducedMotion } from "../hooks";

const START = 62;
const WATERING_RATE = 7.5; // % of moisture gained per second while watering
const DRYING_RATE = 1.6; // % lost per second otherwise
const SOIL_TOP = 150;
const SOIL_H = 150;

type StateKey = keyof typeof demo.states;

/**
 * The interactive irrigation plot.
 *
 * The valve rule lives in one place because it is hysteretic: it opens below
 * the lower threshold, closes at the upper one, and holds in between — which
 * depends on the previous state, not on the reading alone.
 *
 * The simulation keeps its moisture as a float in a ref and only pushes to
 * state when the displayed integer changes, so the ambient drift costs about
 * two renders a second instead of sixty.
 */
export default function DemoSection() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const visible = useOnScreen(panel, { threshold: 0.25 });

  const exact = useRef(START);
  const [level, setLevel] = useState(START);
  const [valve, setValve] = useState(false);
  const [auto, setAuto] = useState(true);
  const [touched, setTouched] = useState(false);

  /** Applies a new reading and the valve rule that follows from it. */
  const apply = useCallback(
    (next: number, isAuto = auto) => {
      const value = clamp(next, 0, 100);
      exact.current = value;
      const rounded = Math.round(value);
      setLevel((prev) => (prev === rounded ? prev : rounded));
      if (isAuto) {
        if (value < demo.lower) setValve(true);
        else if (value >= demo.upper) setValve(false);
      }
    },
    [auto],
  );

  useRafLoop(visible && !reduced, (dt) => {
    const seconds = Math.min(dt / 1000, 0.1);
    if (seconds <= 0) return;
    apply(exact.current + (valve ? WATERING_RATE : -DRYING_RATE) * seconds);
  });

  const mark = () => setTouched(true);

  const key: StateKey = !auto
    ? "manual"
    : level < demo.lower
      ? "dry"
      : valve
        ? "wetting"
        : level >= demo.upper
          ? "wet"
          : "ok";
  const state = demo.states[key];

  const valveLabel = valve ? t("demo.valveOpen", demo.valveOpen) : t("demo.valveClosed", demo.valveClosed);
  const wetHeight = (SOIL_H * level) / 100;

  return (
    <section className="section demo" id="demo">
      <div className="container">
        <SectionHead {...demo} keyBase="demo" />

        <Reveal>
          <div className="demo__panel" ref={panel}>
            <div className="demo__plot">
              <svg viewBox="0 0 420 330" className="demo__svg" role="img" aria-label="Cross-section of a plot">
                <defs>
                  <linearGradient id="demo-wet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--tertiary-400)" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0.95" />
                  </linearGradient>
                  <clipPath id="demo-soil">
                    <rect x="30" y="150" width="360" height="150" rx="14" />
                  </clipPath>
                </defs>

                <rect x="30" y="34" width="360" height="9" rx="4.5" fill="var(--neutral-300)" />
                <rect x="196" y="40" width="9" height="34" rx="4" fill="var(--neutral-400)" />
                <circle cx="200" cy="80" r="11" fill={valve ? "var(--brand-tertiary)" : "var(--neutral-400)"} />

                {valve ? (
                  <g className="demo__spray">
                    {[-70, -36, 0, 36, 70].map((dx, i) => (
                      <line
                        key={dx}
                        x1={200 + dx * 0.25}
                        y1={92}
                        x2={200 + dx}
                        y2={146}
                        stroke="var(--tertiary-400)"
                        strokeWidth={3}
                        strokeLinecap="round"
                        style={{ animationDelay: `${(i * 0.11).toFixed(2)}s` }}
                      />
                    ))}
                  </g>
                ) : null}

                <rect x="30" y="150" width="360" height="150" rx="14" fill="var(--neutral-200)" />
                <g clipPath="url(#demo-soil)">
                  <rect
                    x="30"
                    y={SOIL_TOP + SOIL_H - wetHeight}
                    width="360"
                    height={wetHeight}
                    fill="url(#demo-wet)"
                  />
                </g>

                {[demo.lower, demo.upper].map((v) => {
                  const y = 300 - (150 * v) / 100;
                  return (
                    <g key={v}>
                      <line
                        x1="30"
                        y1={y}
                        x2="390"
                        y2={y}
                        stroke="var(--neutral-0)"
                        strokeWidth={1.5}
                        strokeDasharray="5 5"
                        opacity="0.75"
                      />
                      <rect x="336" y={y - 10} width="48" height="20" rx="10" fill="var(--neutral-900)" opacity="0.72" />
                      <text x="360" y={y + 5} textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">
                        {v}%
                      </text>
                    </g>
                  );
                })}

                <g transform="translate(96 0)">
                  <path d="M0 150 L0 112" stroke="var(--brand-primary)" strokeWidth={5} strokeLinecap="round" />
                  <path d="M0 126 C -22 120, -32 104, -30 90 C -10 94, 0 110, 0 126 Z" fill="var(--brand-tertiary)" />
                  <path d="M0 118 C 22 112, 32 96, 30 82 C 10 86, 0 102, 0 118 Z" fill="var(--tertiary-400)" />
                </g>

                <g transform="translate(300 0)">
                  <rect x="-13" y="118" width="26" height="32" rx="7" fill="var(--neutral-900)" />
                  <circle cx="0" cy="130" r="4" fill="var(--tertiary-300)" className="demo__pulse" />
                  <path d="M0 150 L0 206" stroke="var(--neutral-700)" strokeWidth={3} strokeLinecap="round" />
                </g>

                <text x="210" y="324" textAnchor="middle" fontSize="12" fill="var(--color-text-muted)">
                  {t("demo.thresholds", demo.thresholds)}
                </text>
              </svg>
            </div>

            <div className="demo__controls">
              <div className="demo__readout">
                <span className="demo__readout-value">
                  {level}
                  <em>%</em>
                </span>
                <Chip tone={valve ? "measured" : "neutral"}>
                  <Icon name="droplets" />
                  <span>{valveLabel}</span>
                </Chip>
              </div>

              <label className="demo__field" htmlFor="demo-moisture">
                <span>{t("demo.moistureLabel", demo.moistureLabel)}</span>
                <input
                  id="demo-moisture"
                  className="demo__range"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={level}
                  aria-valuetext={`${level} per cent`}
                  onChange={(event) => {
                    mark();
                    apply(Number(event.target.value));
                  }}
                />
              </label>

              <div className="demo__mode" role="group" aria-label={t("demo.modeLabel", demo.modeLabel)}>
                <button
                  type="button"
                  className={`demo__mode-btn${auto ? " is-active" : ""}`}
                  aria-pressed={auto}
                  onClick={() => {
                    mark();
                    setAuto(true);
                    apply(exact.current, true);
                  }}
                >
                  <Icon name="zap" />
                  <span>{t("demo.autoLabel", demo.autoLabel)}</span>
                </button>
                <button
                  type="button"
                  className={`demo__mode-btn${auto ? "" : " is-active"}`}
                  aria-pressed={!auto}
                  onClick={() => {
                    mark();
                    setAuto(false);
                  }}
                >
                  <Icon name="hand" />
                  <span>{t("demo.manualLabel", demo.manualLabel)}</span>
                </button>
              </div>

              <button
                type="button"
                className={`demo__valve${valve ? " is-open" : ""}`}
                aria-pressed={valve}
                hidden={auto}
                onClick={() => {
                  mark();
                  setValve((v) => !v);
                }}
              >
                <span className="demo__valve-knob" aria-hidden="true" />
                <span>{valveLabel}</span>
              </button>

              <div
                className={`demo__state demo__state--${state.tone}`}
                aria-live={touched ? "polite" : "off"}
              >
                <strong>{t(`demo.states.${key}.title`, state.title)}</strong>
                <p>{t(`demo.states.${key}.text`, state.text)}</p>
              </div>

              <div className="demo__footer">
                <p className="demo__note">
                  <Icon name="info" />
                  <span>{t("demo.note", demo.note)}</span>
                </p>
                <button
                  type="button"
                  className="btn btn--ghost demo__reset"
                  onClick={() => {
                    mark();
                    setAuto(true);
                    setValve(false);
                    apply(START, true);
                  }}
                >
                  <Icon name="rotate-ccw" />
                  <span>{t("demo.reset", demo.reset)}</span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
