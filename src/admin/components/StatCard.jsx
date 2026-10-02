export default function StatCard({ label, value, sub, icon: Icon, trend, tone = 'amber' }) {
  const tones = {
    amber: 'from-amber-400/20 to-amber-700/10 border-amber-400/30 text-amber-300',
    emerald: 'from-emerald-400/20 to-emerald-700/10 border-emerald-400/30 text-emerald-300',
    stone: 'from-stone-700/30 to-stone-900/30 border-stone-600 text-stone-200',
  };
  const up = trend?.startsWith('+');

  return (
    <div className="relative overflow-hidden rounded-xl bg-stone-900/90 border border-amber-500/20 shadow-md p-3.5 sm:p-4">
      <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br blur-2xl ${tones[tone]}`} />
      <div className="relative flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-amber-200/80">{label}</p>
          <p className="mt-1 font-cinzel text-xl sm:text-2xl font-bold text-amber-50 tabular-nums truncate drop-shadow-sm">{value}</p>
          {sub && <p className="mt-0.5 text-[11px] text-stone-300 font-medium truncate">{sub}</p>}
        </div>
        {Icon && (
          <div className={`w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br border flex items-center justify-center shadow-sm ${tones[tone]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      {trend && (
        <p className={`relative mt-2 text-[11px] font-bold ${up ? 'text-emerald-400' : 'text-amber-400'}`}>
          {trend} <span className="text-stone-400 font-normal">vs yesterday</span>
        </p>
      )}
    </div>
  );
}
