import { Bell, ChevronDown, Menu, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { findNavItem } from './nav';

export default function AdminTopBar({ onOpenMenu }) {
  const { pathname } = useLocation();
  const current = findNavItem(pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2.5 px-3.5 sm:px-5 h-13 border-b border-stone-200 bg-white/90 backdrop-blur-xl shadow-sm">
      {/* Mobile menu trigger */}
      <button
        onClick={onOpenMenu}
        aria-label="Open navigation"
        className="lg:hidden p-1.5 -ml-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Breadcrumb */}
      <div className="min-w-0 flex-1">
        <p className="text-[9px] uppercase tracking-[0.2em] text-amber-700 font-bold leading-none">Temple Console</p>
        <h1 className="font-cinzel text-xs sm:text-sm font-bold text-stone-900 truncate mt-0.5">
          {current?.label ?? 'Dashboard'}
        </h1>
      </div>

      {/* Search — desktop */}
      <div className="hidden md:flex items-center gap-2 h-8 w-52 lg:w-64 px-2.5 rounded-lg bg-stone-50 border border-stone-200 focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20 transition-all shadow-inner">
        <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <input
          type="search"
          placeholder="Search console…"
          className="w-full bg-transparent outline-none text-[11px] font-medium text-stone-900 placeholder:text-stone-400"
        />
        <kbd className="hidden lg:inline text-[9px] font-mono text-stone-400 bg-stone-200 border border-stone-300 rounded px-1 py-0.5 shadow-sm">⌘K</kbd>
      </div>

      {/* Temple switcher */}
      <button className="hidden sm:flex items-center gap-2 h-8 pl-2 pr-2.5 rounded-lg bg-stone-50 border border-stone-200 hover:border-stone-300 hover:bg-stone-100 transition-all shadow-sm cursor-pointer">
        <div className="w-4 h-4 rounded-md bg-amber-500/15 border border-amber-400/50 flex items-center justify-center text-[8px] text-amber-800 font-bold" />
        <span className="text-[11px] font-semibold text-stone-800 max-w-[8rem] truncate">Shri Mahadeva</span>
        <ChevronDown className="w-3 h-3 text-stone-400" />
      </button>

      <button
        aria-label="Notifications"
        className="relative p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(217,119,6,0.8)]" />
      </button>

      <div className="w-7 h-7 shrink-0 rounded-full bg-amber-500/15 border border-amber-400/40 shadow-sm flex items-center justify-center text-amber-800">
        <span className="font-om text-xs font-bold leading-none select-none flex items-center justify-center text-center">
          ॐ
        </span>
      </div>
    </header>
  );
}
