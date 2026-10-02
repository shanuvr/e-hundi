import { useId } from 'react';

const COUNT = 28;
const R_IN = 70;
const R_OUT = 96;
const WIDTH = 4.2;

/** A single petal pointing outward from the top of the ring, centred on (100, 100). */
const petal = `M100 ${100 - R_OUT}C${100 + WIDTH} ${100 - R_OUT * 0.74} ${100 + WIDTH} ${100 - R_IN - 2} 100 ${
  100 - R_IN
}C${100 - WIDTH} ${100 - R_IN - 2} ${100 - WIDTH} ${100 - R_OUT * 0.74} 100 ${100 - R_OUT}Z`;

/**
 * Prabhavali — the aureole of light and petals that sits directly behind a deity.
 * Rotates very slowly (see `.prabhavali-spin`) so it reads as a celestial halo;
 * a dashed or dotted ring rotating at speed would read as a loading spinner.
 */
export default function Prabhavali({ className = '' }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const petalFill = `prabhavali-${id}`;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={petalFill} x1="100" y1="4" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde68a" stopOpacity="0.6" />
          <stop offset="0.55" stopColor="#f59e0b" stopOpacity="0.22" />
          <stop offset="1" stopColor="#b45309" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      <g className="prabhavali-spin">
        {Array.from({ length: COUNT }, (_, i) => (
          <path
            key={i}
            d={petal}
            transform={`rotate(${(360 / COUNT) * i} 100 100)`}
            fill={`url(#${petalFill})`}
            stroke="#fcd34d"
            strokeOpacity="0.22"
            strokeWidth="0.45"
          />
        ))}
      </g>
    </svg>
  );
}
