export default function Sparkle({ className = '' }) {
  return (
    <svg
      viewBox="-12 -12 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0-11c1.6 6.1 3.3 7.8 9.4 9.4-6.1 1.6-7.8 3.3-9.4 9.4-1.6-6.1-3.3-7.8-9.4-9.4C-3.3-3.2-1.6-4.9 0-11Z"
        fill="#fcd34d"
        fillOpacity="0.85"
      />
    </svg>
  );
}