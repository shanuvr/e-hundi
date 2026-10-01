import { useId } from 'react';

const petalPath = (r0, r1, w) =>
  `M100 ${100 - r1}C${100 + w} ${100 - r1 * 0.72} ${100 + w} ${100 - r0 - 2} 100 ${100 - r0}C${100 - w} ${100 - r0 - 2} ${100 - w} ${100 - r1 * 0.72} 100 ${100 - r1}Z`;

const RINGS = [
  { count: 16, r0: 66, r1: 95, w: 5.5, opacity: 0.5 },
  { count: 8, r0: 42, r1: 62, w: 6, opacity: 0.38 },
];

export default function Mandala({ className = '' }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const petalFill = `petal-${id}`;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={petalFill} x1="100" y1="10" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fcd34d" stopOpacity="0.55" />
          <stop offset="1" stopColor="#b45309" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <g className="mandala-spin">
        <circle cx="100" cy="100" r="97" stroke="#fbbf24" strokeOpacity="0.14" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="63" stroke="#fbbf24" strokeOpacity="0.16" strokeWidth="0.6" />
        {RINGS.map((ring) =>
          Array.from({ length: ring.count }, (_, i) => (
            <path
              key={`${ring.count}-${i}`}
              d={petalPath(ring.r0, ring.r1, ring.w)}
              transform={`rotate(${(360 / ring.count) * i} 100 100)`}
              fill={`url(#${petalFill})`}
              stroke="#fcd34d"
              strokeOpacity={ring.opacity * 0.7}
              strokeWidth="0.5"
            />
          )),
        )}
      </g>

      <g className="mandala-spin-reverse">
        {Array.from({ length: 24 }, (_, i) => (
          <circle
            key={`dot-${i}`}
            cx="100"
            cy="100"
            r="1.5"
            transform={`rotate(${i * 15} 100 100) translate(0 -80)`}
            fill="#fcd34d"
            fillOpacity="0.3"
          />
        ))}
      </g>

      <circle cx="100" cy="100" r="38" stroke="#fcd34d" strokeOpacity="0.12" strokeWidth="0.6" />
    </svg>
  );
}