/** Two tiny charts, drawn from plain arrays - no charting library. */

const scale = (values: number[], height: number, pad = 3) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return (v: number) => pad + (height - pad * 2) * (1 - (v - min) / span);
};

export function Sparkline({ values, width = 100, height = 34 }: { values: number[]; width?: number; height?: number }) {
  if (values.length < 2) return null;
  const y = scale(values, height);
  const step = width / (values.length - 1);
  const points = values.map((v, i) => [i * step, y(v)] as const);
  const line = points.map(([x, py], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${py.toFixed(1)}`).join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const last = points[points.length - 1];

  return (
    <svg className="achart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <path className="achart__area" d={area} />
      <path className="achart__line" d={line} vectorEffect="non-scaling-stroke" />
      <circle className="achart__dot" cx={last[0]} cy={last[1]} r={2.4} />
    </svg>
  );
}

export function Bars({ values, width = 100, height = 38 }: { values: number[]; width?: number; height?: number }) {
  if (!values.length) return null;
  const max = Math.max(...values) || 1;
  const gap = width / values.length / 4;
  const barWidth = width / values.length - gap;

  return (
    <svg className="achart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      {values.map((v, i) => {
        const h = Math.max(2, (height - 2) * (v / max));
        return (
          <rect
            key={i}
            className={`achart__bar${i === values.length - 1 ? " achart__bar--on" : ""}`}
            x={i * (barWidth + gap)}
            y={height - h}
            width={barWidth}
            height={h}
            rx={1.4}
          />
        );
      })}
    </svg>
  );
}
