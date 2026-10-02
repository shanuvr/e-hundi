export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-5">
      <div className="min-w-0">
        <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-50 tracking-wide drop-shadow-sm">{title}</h2>
        {subtitle && <p className="mt-1 text-xs sm:text-[13px] text-stone-300 max-w-2xl leading-relaxed font-normal">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
