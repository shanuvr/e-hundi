import { useId } from 'react';

export default function Diya({ className = '' }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const bowl = `bowl-${id}`;
  const rim = `rim-${id}`;
  const outer = `outer-${id}`;
  const core = `core-${id}`;
  const glow = `glow-${id}`;

  return (
    <svg
      viewBox="-6 -6 76 68"
      className={`transform-gpu will-change-transform ${className}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={bowl} x1="32" y1="34" x2="32" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f7dd9a" />
          <stop offset="0.42" stopColor="#cf9230" />
          <stop offset="1" stopColor="#7a480f" />
        </linearGradient>

        <radialGradient id={rim} cx="0.5" cy="0.35" r="0.75">
          <stop stopColor="#ffcf6b" />
          <stop offset="0.55" stopColor="#a95f14" />
          <stop offset="1" stopColor="#3d1d05" />
        </radialGradient>

        <linearGradient id={outer} x1="32" y1="42" x2="32" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff6d2" />
          <stop offset="0.32" stopColor="#fbbf24" />
          <stop offset="0.72" stopColor="#f08c12" />
          <stop offset="1" stopColor="#d4520a" stopOpacity="0.72" />
        </linearGradient>

        <linearGradient id={core} x1="32" y1="38" x2="32" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffdf2" />
          <stop offset="0.6" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#fff6d2" stopOpacity="0" />
        </linearGradient>

        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.28" stopColor="#fbbf24" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="32" cy="24" rx="30" ry="28" fill={`url(#${glow})`} />

      <g className="flame-flicker">
        <path
          d="M32 3C38.4 15 43.5 21.5 43.5 29.2c0 8-5.1 12.8-11.5 12.8S20.5 37.2 20.5 29.2C20.5 21.5 25.6 15 32 3Z"
          fill={`url(#${outer})`}
        />
        <path
          d="M32 17c2.9 6.3 4.8 9.4 4.8 12.9 0 4.3-2.1 7.1-4.8 7.1s-4.8-2.8-4.8-7.1c0-3.5 1.9-6.6 4.8-12.9Z"
          fill={`url(#${core})`}
        />
      </g>

      <path
        d="M5 34c0 14 12.1 21 27 21s27-7 27-21H5Z"
        fill={`url(#${bowl})`}
      />
      <ellipse cx="32" cy="34" rx="27" ry="5" fill={`url(#${rim})`} />
      <path
        d="M32 33.5V26"
        stroke="#2b1403"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}