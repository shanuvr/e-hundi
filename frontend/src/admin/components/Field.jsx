import { useState } from 'react';

const CONTROL =
  'w-full rounded-lg bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs';

function Field({ label, hint, max, current, limitReached, children, className = '' }) {
  const isAtLimit = max !== undefined && current !== undefined && current >= max;
  const isNearLimit =
    max !== undefined &&
    current !== undefined &&
    !isAtLimit &&
    (current >= Math.floor(max * 0.85) || current >= max - 15);

  const counterColorClass = isAtLimit
    ? 'text-rose-600 font-bold'
    : isNearLimit
    ? 'text-amber-600 font-semibold'
    : 'text-stone-400';

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <label className="text-xs font-semibold text-stone-700 tracking-wide">{label}</label>
        {max !== undefined && current !== undefined && (
          <span className={`text-[11px] tabular-nums font-mono transition-colors ${counterColorClass}`}>
            {current}/{max}
          </span>
        )}
      </div>
      {children}
      {limitReached ? (
        <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1">
          Character limit reached
        </p>
      ) : (
        hint && <p className="mt-1 text-[11px] text-stone-500 leading-relaxed">{hint}</p>
      )}
    </div>
  );
}

/**
 * Design-only form primitives with high readability and contrast.
 */
export function TextInput({
  label,
  hint,
  max,
  current,
  className,
  onKeyDown,
  onBeforeInput,
  onChange,
  ...rest
}) {
  const [limitReached, setLimitReached] = useState(false);
  const effectiveMax = max ?? rest.maxLength;
  const effectiveCurrent =
    current !== undefined ? current : rest.value !== undefined ? String(rest.value).length : undefined;

  const handleKeyDown = (e) => {
    if (effectiveMax !== undefined && effectiveCurrent !== undefined && effectiveCurrent >= effectiveMax) {
      const isControlKey = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Tab', 'Escape', 'Home', 'End', 'PageUp', 'PageDown', 'Shift', 'Alt', 'Meta', 'CapsLock'
      ].includes(e.key);
      const isModifierCombo = (e.ctrlKey || e.metaKey) && ['a', 'c', 'x'].includes(e.key.toLowerCase());
      const hasSelection = e.target.selectionStart !== e.target.selectionEnd;

      if (!isControlKey && !isModifierCombo && !hasSelection) {
        setLimitReached(true);
      }
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      setLimitReached(false);
    }

    if (onKeyDown) onKeyDown(e);
  };

  const handleBeforeInput = (e) => {
    if (effectiveMax !== undefined && effectiveCurrent !== undefined && effectiveCurrent >= effectiveMax) {
      if (e.target.selectionStart === e.target.selectionEnd) {
        setLimitReached(true);
      }
    }
    if (onBeforeInput) onBeforeInput(e);
  };

  const handleChange = (e) => {
    if (effectiveMax !== undefined && e.target.value.length < effectiveMax) {
      setLimitReached(false);
    }
    if (onChange) onChange(e);
  };

  return (
    <Field
      label={label}
      hint={hint}
      max={effectiveMax}
      current={effectiveCurrent}
      limitReached={limitReached}
      className={className}
    >
      <input
        type="text"
        maxLength={effectiveMax}
        className={`${CONTROL} ${limitReached ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
        onKeyDown={handleKeyDown}
        onBeforeInput={handleBeforeInput}
        onChange={handleChange}
        {...rest}
      />
    </Field>
  );
}

export function TextArea({
  label,
  hint,
  rows = 3,
  max,
  current,
  className,
  onKeyDown,
  onBeforeInput,
  onChange,
  ...rest
}) {
  const [limitReached, setLimitReached] = useState(false);
  const effectiveMax = max ?? rest.maxLength;
  const effectiveCurrent =
    current !== undefined ? current : rest.value !== undefined ? String(rest.value).length : undefined;

  const handleKeyDown = (e) => {
    if (effectiveMax !== undefined && effectiveCurrent !== undefined && effectiveCurrent >= effectiveMax) {
      const isControlKey = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Tab', 'Escape', 'Home', 'End', 'PageUp', 'PageDown', 'Shift', 'Alt', 'Meta', 'CapsLock'
      ].includes(e.key);
      const isModifierCombo = (e.ctrlKey || e.metaKey) && ['a', 'c', 'x'].includes(e.key.toLowerCase());
      const hasSelection = e.target.selectionStart !== e.target.selectionEnd;

      if (!isControlKey && !isModifierCombo && !hasSelection) {
        setLimitReached(true);
      }
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      setLimitReached(false);
    }

    if (onKeyDown) onKeyDown(e);
  };

  const handleBeforeInput = (e) => {
    if (effectiveMax !== undefined && effectiveCurrent !== undefined && effectiveCurrent >= effectiveMax) {
      if (e.target.selectionStart === e.target.selectionEnd) {
        setLimitReached(true);
      }
    }
    if (onBeforeInput) onBeforeInput(e);
  };

  const handleChange = (e) => {
    if (effectiveMax !== undefined && e.target.value.length < effectiveMax) {
      setLimitReached(false);
    }
    if (onChange) onChange(e);
  };

  return (
    <Field
      label={label}
      hint={hint}
      max={effectiveMax}
      current={effectiveCurrent}
      limitReached={limitReached}
      className={className}
    >
      <textarea
        rows={rows}
        maxLength={effectiveMax}
        className={`${CONTROL} resize-none leading-relaxed ${limitReached ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
        onKeyDown={handleKeyDown}
        onBeforeInput={handleBeforeInput}
        onChange={handleChange}
        {...rest}
      />
    </Field>
  );
}

export function Select({ label, hint, options = [], className, ...rest }) {
  const fallback = options[0]?.value ?? '';
  return (
    <Field label={label} hint={hint} className={className}>
      <div className="relative">
        <select className={`${CONTROL} appearance-none pr-9 cursor-pointer bg-white`} defaultValue={fallback} {...rest}>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-white text-stone-900 py-1 font-medium">
              {o.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
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
      className={`flex items-start gap-3 cursor-pointer group
        has-[:checked]:[&_.tg-track]:bg-amber-500
        has-[:checked]:[&_.tg-track]:border-amber-600
        has-[:checked]:[&_.tg-knob]:translate-x-4
        has-[:checked]:[&_.tg-knob]:bg-white ${className}`}
    >
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only" />
      <span className="relative shrink-0 w-9 h-5 mt-0.5">
        <span className="tg-track absolute inset-0 rounded-full bg-stone-200 border border-stone-300 transition-colors shadow-inner" />
        <span className="tg-knob absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 shadow-sm" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-stone-800 group-hover:text-amber-800 transition-colors">
          {label}
        </span>
        {hint && <span className="block mt-0.5 text-[11px] text-stone-500 leading-relaxed font-normal">{hint}</span>}
      </span>
    </label>
  );
}

export { CONTROL };

