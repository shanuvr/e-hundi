import { useId } from 'react';

/** A single lotus petal, rooted at the common base point (100, 42). */
const PETAL = 'M100 42C86 33 86 14 100 3C114 14 114 33 100 42Z';

// Splayed from the base outwards, back-to-front so the centre petal sits on top.
const PETALS = [
  { angle: -60, scale: 0.66, opacity: 0.3 },
  { angle: -42, scale: 0.78, opacity: 0.46 },
  { angle: -23, scale: 0.9, opacity: 0.66 },
  { angle: 0, scale: 1, opacity: 0.95 },
  { angle: 23, scale: 0.9, opacity: 0.66 },
  { angle: 42, scale: 0.78, opacity: 0.46 },
  { angle: 60, scale: 0.66, opacity: 0.3 },
];

/**
 * Lotus plinth — seats the ॐ medallion on a bloom instead of leaving it floating
 * in a bare circle. Scale then rotate about the shared base keeps every petal
 * hinged at the same point, which is what makes the fan read as one flower.
 */
export default function LotusBase({ className = '' }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const petalFill = `lotus-${id}`;

  return (
    <svg
      viewBox="0 0 200 48"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={petalFill} x1="100" y1="3" x2="100" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff7d6" />
          <stop offset="0.42" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#78350f" />
        </linearGradient>
      </defs>

      {PETALS.map((p, i) => (
        <path
          key={i}
          d={PETAL}
          transform={`translate(100 42) scale(${p.scale}) translate(-100 -42) rotate(${p.angle} 100 42)`}
          fill={`url(#${petalFill})`}
          fillOpacity={p.opacity}
          stroke="#fcd34d"
          strokeOpacity={0.28}
          strokeWidth="0.5"
        />
      ))}

      {/* Plinth line the bloom rests on */}
      <path d="M24 42.5H176" stroke="#fcd34d" strokeOpacity="0.22" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
