const CONTROL =
  'w-full rounded-xl bg-stone-950/90 border border-stone-600/90 px-3.5 py-2.5 text-sm text-stone-100 placeholder:text-stone-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner';

function Field({ label, hint, max, current, children, className = '' }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label className="text-[13px] font-semibold text-stone-100 tracking-wide">{label}</label>
        {max !== undefined && current !== undefined && (
          <span className={`text-xs tabular-nums font-mono ${current > max ? 'text-amber-400 font-bold' : 'text-stone-300'}`}>
            {current}/{max}
          </span>
        )}
      </div>
      {children}
      {hint && <p className="mt-1.5 text-xs text-stone-300 leading-relaxed">{hint}</p>}
    </div>
  );
}

/**
 * Design-only form primitives with high readability and contrast.
 */
export function TextInput({ label, hint, max, current, className, ...rest }) {
  return (
    <Field label={label} hint={hint} max={max} current={current} className={className}>
      <input type="text" className={CONTROL} {...rest} />
    </Field>
  );
}

export function TextArea({ label, hint, rows = 3, max, current, className, ...rest }) {
  return (
    <Field label={label} hint={hint} max={max} current={current} className={className}>
      <textarea rows={rows} className={`${CONTROL} resize-none leading-relaxed`} {...rest} />
    </Field>
  );
}

export function Select({ label, hint, options = [], className, ...rest }) {
  const fallback = options[0]?.value ?? '';
  return (
    <Field label={label} hint={hint} className={className}>
      <div className="relative">
        <select className={`${CONTROL} appearance-none pr-9 cursor-pointer`} defaultValue={fallback} {...rest}>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-stone-900 text-stone-100 py-1 font-medium">
              {o.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </Field>
  );
}

export function Toggle({ label, hint, defaultChecked = false, className = '' }) {
  return (
    <label
      className={`flex items-start gap-3.5 cursor-pointer group
        has-[:checked]:[&_.tg-track]:bg-amber-400
        has-[:checked]:[&_.tg-track]:border-amber-300
        has-[:checked]:[&_.tg-knob]:translate-x-4
        has-[:checked]:[&_.tg-knob]:bg-stone-950 ${className}`}
    >
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only" />
      <span className="relative shrink-0 w-9 h-5 mt-0.5">
        <span className="tg-track absolute inset-0 rounded-full bg-stone-800 border border-stone-500 transition-colors shadow-inner" />
        <span className="tg-knob absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-stone-200 transition-transform duration-200 shadow-sm" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-stone-100 group-hover:text-amber-200 transition-colors">
          {label}
        </span>
        {hint && <span className="block mt-0.5 text-xs text-stone-300 leading-relaxed font-normal">{hint}</span>}
      </span>
    </label>
  );
}

export { CONTROL };

