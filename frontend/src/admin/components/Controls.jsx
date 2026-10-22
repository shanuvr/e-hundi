export function Button({ children, variant = 'primary', icon: Icon, className = '', ...rest }) {
  const variants = {
    primary:
      'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-bold border border-amber-400/50 shadow-xs hover:brightness-105 active:scale-[0.98]',
    ghost:
      'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200/70 hover:text-stone-900 shadow-xs',
    outline:
      'bg-white text-stone-700 font-medium border border-stone-300 hover:border-amber-400 hover:bg-amber-50/50 shadow-xs',
    danger: 'bg-rose-50 text-rose-700 font-semibold border border-rose-200 hover:bg-rose-100 shadow-xs',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${variants[variant]} ${className}`}
      {...rest}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </button>
  );
}

export function UploadBox({ label, hint, height = 'h-28' }) {
  return (
    <button
      type="button"
      className={`group w-full ${height} rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 hover:border-amber-500 hover:bg-amber-50/40 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-inner`}
    >
      <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 text-amber-700 transition-colors"
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
      <span className="text-xs font-semibold text-stone-800 group-hover:text-amber-800 transition-colors">{label}</span>
      {hint && <span className="text-[11px] text-stone-500">{hint}</span>}
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
