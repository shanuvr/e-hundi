export default function StatCard({ label, value, sub, icon: Icon, trend, tone = 'amber' }) {
  const tones = {
    amber: 'bg-amber-500/10 border-amber-300 text-amber-800',
    emerald: 'bg-emerald-500/10 border-emerald-300 text-emerald-800',
    stone: 'bg-stone-100 border-stone-200 text-stone-600',
  };
  const up = trend?.startsWith('+');

  return (
    <div className="rounded-lg bg-white border border-stone-200/90 shadow-2xs px-2.5 py-1.5 flex items-center justify-between gap-2">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-stone-400 truncate">{label}</p>
          {trend && (
            <span className={`text-[8.5px] font-bold ${up ? 'text-emerald-700' : 'text-amber-700'}`}>
              {trend}
            </span>
          )}
        </div>
        <p className="font-cinzel text-base sm:text-lg font-bold text-stone-900 tabular-nums leading-snug truncate">{value}</p>
        {sub && <p className="text-[9px] text-stone-400 font-normal truncate leading-none">{sub}</p>}
      </div>
      {Icon && (
        <div className={`w-6 h-6 shrink-0 rounded-md border flex items-center justify-center shadow-2xs ${tones[tone]}`}>
          <Icon className="w-3 h-3" />
        </div>
      )}
    </div>
  );
}
