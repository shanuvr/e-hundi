export function Button({ children, variant = 'primary', icon: Icon, className = '', ...rest }) {
  const variants = {
    primary:
      'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 font-bold border border-yellow-200/50 shadow-[0_6px_20px_rgba(217,119,6,0.3)] hover:brightness-110 active:scale-[0.98]',
    ghost:
      'bg-stone-800/80 text-stone-100 border border-stone-600 hover:border-amber-400/50 hover:bg-stone-700/80 hover:text-amber-100 shadow-sm',
    outline:
      'bg-stone-950/50 text-amber-200 font-medium border border-amber-400/40 hover:bg-amber-400/15 hover:border-amber-400/60 shadow-sm',
    danger: 'bg-rose-500/20 text-rose-200 font-semibold border border-rose-400/40 hover:bg-rose-500/30 shadow-sm',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${variants[variant]} ${className}`}
      {...rest}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

export function UploadBox({ label, hint, height = 'h-28' }) {
  return (
    <button
      type="button"
      className={`group w-full ${height} rounded-2xl border-2 border-dashed border-amber-400/30 bg-stone-950/70 hover:border-amber-400 hover:bg-amber-400/[0.06] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-inner`}
    >
      <div className="w-9 h-9 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-amber-300 transition-colors"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 16V4m0 0L7 9m5-5l5 5" />
          <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
      </div>
      <span className="text-xs font-semibold text-stone-100 group-hover:text-amber-200 transition-colors">{label}</span>
      {hint && <span className="text-[11px] text-stone-300">{hint}</span>}
    </button>
  );
}

export function SwatchRow({ colors }) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <div key={c.hex} className="group">
          <div
            className="w-9 h-9 rounded-lg border border-stone-600 shadow-inner transition-transform group-hover:scale-105"
            style={{ backgroundColor: c.hex }}
          />
          <p className="mt-1 text-center text-[10px] text-stone-300 font-mono font-medium">{c.name}</p>
        </div>
      ))}
    </div>
  );
}
