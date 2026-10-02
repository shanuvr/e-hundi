const TONES = {
  amber: 'bg-amber-400/15 border-amber-400/40 text-amber-200 font-semibold',
  emerald: 'bg-emerald-400/15 border-emerald-400/40 text-emerald-200 font-semibold',
  stone: 'bg-stone-800 border-stone-600 text-stone-200 font-medium',
  rose: 'bg-rose-400/15 border-rose-400/40 text-rose-200 font-semibold',
};

export function Pill({ children, tone = 'stone', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] whitespace-nowrap shadow-sm ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = 'emerald' }) {
  const map = {
    emerald: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]',
    amber: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]',
    rose: 'bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.9)]',
    stone: 'bg-stone-400',
  };
  return <span className={`w-1.5 h-1.5 rounded-full ${map[tone]}`} />;
}

/**
 * Compact Data Table without ugly scrollbars.
 */
export function DataTable({ head, rows, className = '' }) {
  return (
    <div className={`-mx-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}>
      <div className="inline-block min-w-full align-middle px-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-amber-500/20 bg-stone-950/40">
              {head.map((h, idx) => (
                <th
                  key={h}
                  className={`whitespace-nowrap py-2.5 px-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-200/90 ${
                    idx === 0 ? 'pl-2' : ''
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/80">
            {rows.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-amber-500/[0.06]">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`whitespace-nowrap py-2.5 px-2.5 ${
                      j === 0
                        ? 'text-stone-100 font-semibold text-xs pl-2 font-mono'
                        : j === 2
                        ? 'text-amber-300 font-bold text-xs'
                        : 'text-stone-200 text-xs'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
