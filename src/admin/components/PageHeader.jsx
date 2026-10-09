export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 mb-3.5 sm:mb-4">
      <div className="min-w-0">
        <h2 className="font-cinzel text-base sm:text-lg font-bold text-stone-900 tracking-wide">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[11px] sm:text-xs text-stone-500 max-w-2xl leading-relaxed font-normal">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
