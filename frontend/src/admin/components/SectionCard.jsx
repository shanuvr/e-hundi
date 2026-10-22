export default function SectionCard({ title, description, icon: Icon, action, children, footer, className = '' }) {
  return (
    <section className={`rounded-xl bg-white border border-stone-200/90 shadow-sm overflow-hidden ${className}`}>
      {(title || Icon || action) && (
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2 border-b border-stone-200/80 bg-stone-50/70">
          <div className="flex items-center gap-2 min-w-0">
            {Icon && (
              <div className="w-5 h-5 shrink-0 rounded-md bg-amber-500/10 border border-amber-400/40 flex items-center justify-center shadow-2xs">
                <Icon className="w-3 h-3 text-amber-800" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-stone-900 tracking-wide">{title}</h3>
              {description && <p className="text-[10px] text-stone-500 leading-tight">{description}</p>}
            </div>
          </div>
          {action && <div className="shrink-0 flex items-center gap-1.5">{action}</div>}
        </header>
      )}
      <div className="p-2.5 sm:p-3">{children}</div>
      {footer && <div className="px-3.5 py-1.5 border-t border-stone-200/80 bg-stone-50/90">{footer}</div>}
    </section>
  );
}
