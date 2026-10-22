import { MONEY } from '../data/money';

export default function Money({ value, className = '', alt }) {
  const source = MONEY[value];
  if (!source) return null;

  return (
    <img
      src={source.src}
      alt={alt ?? `₹${value} ${source.kind}`}
      draggable="false"
      decoding="async"
      loading="eager"
      className={`object-contain select-none ${className}`}
    />
  );
}