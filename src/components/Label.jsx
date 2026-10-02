export default function Label({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 mb-2.5 ${className}`}>
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/50" />
      <span className="text-[9px] uppercase tracking-[0.3em] text-amber-200/55 font-semibold">
        {children}
      </span>
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/50" />
    </div>
  );
}
