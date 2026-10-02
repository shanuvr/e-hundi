export default function SectionCard({ title, description, icon: Icon, children, footer, className = '' }) {
  return (
    <section className={`rounded-xl bg-stone-900/90 border border-amber-500/20 shadow-md backdrop-blur-md overflow-hidden ${className}`}>
      {(title || Icon) && (
        <header className="flex items-start gap-2.5 px-4 py-3 border-b border-amber-500/15 bg-stone-900/40">
          {Icon && (
            <div className="w-7 h-7 shrink-0 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shadow-sm">
              <Icon className="w-3.5 h-3.5 text-amber-300" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-xs sm:text-[13px] font-bold text-amber-100 tracking-wide">{title}</h3>
            {description && <p className="mt-0.5 text-[11px] text-stone-300 leading-relaxed">{description}</p>}
          </div>
        </header>
      )}
      <div className="p-4">{children}</div>
      {footer && <div className="px-4 py-2.5 border-t border-amber-500/15 bg-stone-950/70">{footer}</div>}
    </section>
  );
}
