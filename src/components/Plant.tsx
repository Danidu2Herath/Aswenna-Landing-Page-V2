import { useId } from "react";
import { clamp01 } from "../lib/util";

/**
 * The crop, drawn from a single 0..1 progress value — scrubbed by scroll on
 * desktop, frozen per card on mobile.
 *
 * Everything that grows is a stroked path with pathLength="1", so a dash
 * offset draws it on; everything that unfolds is scaled about its joint.
 */
const seg = (p: number, from: number, to: number) => clamp01((p - from) / (to - from));
const ease = (t: number) => t * t * (3 - 2 * t);
const grow = (p: number, from: number, to: number) => ease(seg(p, from, to));

const SOIL = 330;

function Leaf({
  x,
  y,
  angle,
  size,
  open,
  fill,
}: {
  x: number;
  y: number;
  angle: number;
  size: number;
  open: number;
  fill: string;
}) {
  if (open <= 0.001) return null;
  const s = size * open;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s.toFixed(3)})`}>
      <path
        d="M0 0 C 26 -20, 62 -14, 74 6 C 54 26, 20 24, 0 0 Z"
        fill={fill}
        opacity={(0.35 + 0.65 * open).toFixed(3)}
      />
      <path
        d="M2 1 C 24 2, 48 6, 72 6"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth={2.5}
        fill="none"
      />
    </g>
  );
}

export default function Plant({
  progress,
  label = true,
}: {
  progress: number;
  label?: boolean;
}) {
  const uid = useId().replace(/[^\w-]/g, "");
  const p = clamp01(progress);

  const seed = grow(p, 0.0, 0.08);
  const stem = grow(p, 0.1, 0.92);
  const cotyledon = grow(p, 0.18, 0.34);
  const leafA = grow(p, 0.32, 0.5);
  const leafB = grow(p, 0.44, 0.62);
  const branch = grow(p, 0.58, 0.8);
  const leafC = grow(p, 0.66, 0.86);
  const crown = grow(p, 0.82, 1.0);
  const sink = grow(p, 0.02, 0.14);
  const stemTop = SOIL - 250 * stem;

  const roots = [
    "M210 338 C 206 368, 190 388, 168 404",
    "M210 338 C 214 370, 232 390, 254 404",
    "M210 338 C 210 372, 208 396, 206 418",
  ];

  const a11y = label
    ? { role: "img", "aria-label": `Crop growth, ${Math.round(p * 100)} per cent through the season` }
    : { "aria-hidden": true as const };

  return (
    <svg viewBox="0 0 420 460" width="100%" height="100%" {...a11y}>
      <defs>
        <linearGradient
          id={`${uid}-stem`}
          gradientUnits="userSpaceOnUse"
          x1="210"
          y1="330"
          x2="210"
          y2="80"
        >
          <stop offset="0%" stopColor="var(--primary-600)" />
          <stop offset="100%" stopColor="var(--tertiary-400)" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="var(--brand-tertiary)" stopOpacity="0.30" />
          <stop offset="100%" stopColor="var(--brand-tertiary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle
        cx="210"
        cy={stemTop.toFixed(1)}
        r={(120 * stem + 40).toFixed(1)}
        fill={`url(#${uid}-glow)`}
        opacity={(0.35 + 0.5 * stem).toFixed(3)}
      />
      <rect x="40" y={SOIL} width="340" height="12" rx="6" fill="var(--primary-700)" opacity="0.55" />
      <rect x="40" y={SOIL} width="340" height="4" rx="2" fill="var(--tertiary-400)" opacity="0.5" />

      <g
        stroke="var(--primary-500)"
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
        opacity="0.75"
      >
        {roots.map((d, i) => (
          <path
            key={d}
            d={d}
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={(1 - grow(p, 0.06 + i * 0.05, 0.3 + i * 0.05)).toFixed(3)}
          />
        ))}
      </g>

      <ellipse
        cx="210"
        cy={(SOIL + 4 + 4 * sink).toFixed(1)}
        rx={(11 * seed).toFixed(2)}
        ry={(8 * seed).toFixed(2)}
        fill="var(--primary-800)"
        opacity={(1 - 0.75 * cotyledon).toFixed(3)}
      />

      <path
        d={`M210 ${SOIL} L210 ${SOIL - 250}`}
        stroke={`url(#${uid}-stem)`}
        strokeWidth={(5 + 4 * stem).toFixed(2)}
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={(1 - stem).toFixed(3)}
      />

      <Leaf x={206} y={SOIL - 46} angle={196} size={0.5} open={cotyledon} fill="var(--tertiary-400)" />
      <Leaf x={214} y={SOIL - 46} angle={-16} size={0.5} open={cotyledon} fill="var(--tertiary-300)" />
      <Leaf x={204} y={SOIL - 108} angle={202} size={0.78} open={leafA} fill="var(--brand-tertiary)" />
      <Leaf x={216} y={SOIL - 96} angle={-22} size={0.72} open={leafA} fill="var(--tertiary-400)" />
      <Leaf x={204} y={SOIL - 168} angle={208} size={0.88} open={leafB} fill="var(--tertiary-500)" />
      <Leaf x={216} y={SOIL - 156} angle={-28} size={0.82} open={leafB} fill="var(--brand-tertiary)" />

      <g stroke="var(--primary-600)" strokeWidth={4} fill="none" strokeLinecap="round">
        <path
          d={`M210 ${SOIL - 196} C 186 ${SOIL - 210}, 166 ${SOIL - 226}, 150 ${SOIL - 234}`}
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={(1 - branch).toFixed(3)}
        />
        <path
          d={`M210 ${SOIL - 214} C 234 ${SOIL - 228}, 256 ${SOIL - 242}, 272 ${SOIL - 248}`}
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={(1 - grow(p, 0.62, 0.84)).toFixed(3)}
        />
      </g>
      <Leaf x={146} y={SOIL - 238} angle={214} size={0.8} open={leafC} fill="var(--tertiary-400)" />
      <Leaf
        x={276}
        y={SOIL - 250}
        angle={-30}
        size={0.84}
        open={grow(p, 0.7, 0.9)}
        fill="var(--brand-tertiary)"
      />

      {crown > 0.001 ? (
        <g opacity={crown.toFixed(3)}>
          {([[210, -268, 26], [172, -250, 18], [250, -254, 20]] as const).map(([cx, dy, r]) => (
            <circle
              key={cx}
              cx={cx}
              cy={SOIL + dy}
              r={(r * crown).toFixed(2)}
              fill="var(--primary-600)"
              opacity="0.85"
            />
          ))}
          <circle cx="210" cy={SOIL - 268} r={(10 * crown).toFixed(2)} fill="var(--tertiary-200)" />
        </g>
      ) : null}
    </svg>
  );
}

/** Progress value that represents stage `i` of `count`. */
export const stageProgress = (i: number, count: number) => (i + 0.9) / count;
