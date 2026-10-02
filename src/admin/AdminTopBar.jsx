import { Bell, ChevronDown, Menu, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { findNavItem } from './nav';

export default function AdminTopBar({ onOpenMenu }) {
  const { pathname } = useLocation();
  const current = findNavItem(pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 h-16 border-b border-amber-500/20 bg-stone-900/90 backdrop-blur-xl shadow-md">
      {/* Mobile menu trigger */}
      <button
        onClick={onOpenMenu}
        aria-label="Open navigation"
        className="lg:hidden p-2 -ml-1 rounded-xl text-stone-200 hover:text-amber-200 hover:bg-stone-800 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.22em] text-amber-300/80 font-bold leading-none">Temple Console</p>
        <h1 className="font-cinzel text-sm sm:text-base font-bold text-amber-50 truncate mt-1">
          {current?.label ?? 'Dashboard'}
        </h1>
      </div>

      {/* Search — desktop */}
      <div className="hidden md:flex items-center gap-2 h-9 w-56 lg:w-72 px-3 rounded-xl bg-stone-950/90 border border-stone-700 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all shadow-inner">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="search"
          placeholder="Search settings & reports…"
          className="w-full bg-transparent outline-none text-xs font-medium text-stone-100 placeholder:text-stone-400"
        />
        <kbd className="hidden lg:inline text-[10px] font-mono text-stone-400 bg-stone-800 border border-stone-600 rounded px-1.5 py-0.5 shadow-sm">⌘K</kbd>
      </div>

      {/* Temple switcher */}
      <button className="hidden sm:flex items-center gap-2 h-9 pl-2.5 pr-2.5 rounded-xl bg-stone-950/80 border border-amber-500/25 hover:border-amber-400 hover:bg-stone-800/80 transition-all shadow-sm cursor-pointer">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-300/40 to-amber-700/30 border border-amber-400/50 flex items-center justify-center text-[9px] text-amber-200 font-bold" />
        <span className="text-xs font-semibold text-amber-100 max-w-[9rem] truncate">Shri Mahadeva</span>
        <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
      </button>

      <button
        aria-label="Notifications"
        className="relative p-2 rounded-xl text-stone-300 hover:text-amber-200 hover:bg-stone-800 transition-colors cursor-pointer"
      >
        <Bell className="w-[19px] h-[19px]" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.95)]" />
      </button>

      <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-amber-300/40 to-amber-700/30 border border-amber-400/40 shadow-sm grid place-items-center">
        <span className="font-om text-xs font-bold text-amber-100 leading-none select-none translate-x-[1px] -translate-y-[0.5px]">
          ॐ
        </span>
      </div>
    </header>
  );
}
