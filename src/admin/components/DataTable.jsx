const TONES = {
  amber: 'bg-amber-50 border-amber-300 text-amber-800 font-semibold',
  emerald: 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold',
  stone: 'bg-stone-100 border-stone-300 text-stone-700 font-medium',
  rose: 'bg-rose-50 border-rose-300 text-rose-800 font-semibold',
};

export function Pill({ children, tone = 'stone', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] whitespace-nowrap shadow-2xs ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = 'emerald' }) {
  const map = {
    emerald: 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.7)]',
    amber: 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.7)]',
    rose: 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.7)]',
    stone: 'bg-stone-400',
  };
  return <span className={`w-1.5 h-1.5 rounded-full ${map[tone]}`} />;
}

/**
 * Compact Data Table without ugly scrollbars.
 */
export function DataTable({ head, rows, className = '' }) {
  return (
    <div className={`-mx-3 sm:-mx-3.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}>
      <div className="inline-block min-w-full align-middle px-3 sm:px-3.5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/80">
              {head.map((h, idx) => (
                <th
                  key={h}
                  className={`whitespace-nowrap py-2 px-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-500 ${
                    idx === 0 ? 'pl-2' : ''
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-amber-500/[0.04]">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`whitespace-nowrap py-2 px-2.5 ${
                      j === 0
                        ? 'text-stone-900 font-semibold text-[11px] pl-2 font-mono'
                        : j === 2
                        ? 'text-amber-800 font-bold text-[11.5px]'
                        : 'text-stone-700 text-[11px]'
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
