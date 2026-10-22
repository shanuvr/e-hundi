const TONES = {
  amber: 'bg-amber-50 border-amber-300 text-amber-800 font-semibold',
  emerald: 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold',
  stone: 'bg-stone-100 border-stone-300 text-stone-700 font-medium',
  rose: 'bg-rose-50 border-rose-300 text-rose-800 font-semibold',
};

export function Pill({ children, tone = 'stone', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] sm:text-[10.5px] font-semibold leading-tight whitespace-nowrap shadow-2xs ${TONES[tone]} ${className}`}
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
 * Compact Data Table with balanced spacing and responsive alignment.
 */
export function DataTable({ head, rows, className = '', colWidths = [], alignRightLast = true }) {
  return (
    <div className={`-mx-3 sm:-mx-3.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}>
      <div className="inline-block min-w-full align-middle px-3 sm:px-3.5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/80">
              {head.map((h, idx) => {
                const isLast = idx === head.length - 1;
                return (
                  <th
                    key={h}
                    className={`whitespace-nowrap py-2 px-3 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.13em] text-stone-500 ${
                      colWidths[idx] || ''
                    } ${idx === 0 ? 'pl-2.5' : ''} ${
                      isLast && alignRightLast ? 'text-right pr-3.5 sm:pr-4' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-amber-500/[0.04]">
                {row.map((cell, j) => {
                  const isLast = j === row.length - 1;
                  return (
                    <td
                      key={j}
                      className={`whitespace-nowrap py-2 sm:py-2.5 px-3 ${
                        colWidths[j] || ''
                      } ${
                        j === 0
                          ? 'text-stone-900 font-semibold text-[11.5px] sm:text-xs pl-2.5 font-mono'
                          : j === 1
                          ? 'text-amber-800 font-bold text-[12px] sm:text-[12.5px]'
                          : 'text-stone-700 text-[11px] sm:text-[11.5px]'
                      } ${
                        isLast && alignRightLast ? 'text-right pr-3.5 sm:pr-4' : 'text-left'
                      }`}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
