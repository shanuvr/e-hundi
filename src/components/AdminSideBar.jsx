import { NavLink, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { ADMIN_NAV } from '../admin/nav';

function NavItem({ item, collapsed, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl py-2.5 pr-3 text-sm transition-all ${
          collapsed ? 'lg:justify-center lg:px-0' : 'pl-3.5'
        } ${
          isActive
            ? 'bg-gradient-to-r from-amber-500/25 to-amber-500/10 text-amber-100 font-semibold border border-amber-400/40 shadow-[0_2px_12px_rgba(245,158,11,0.15)]'
            : 'text-stone-300 hover:text-amber-100 hover:bg-stone-800/70 border border-transparent font-medium'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-amber-400 transition-all duration-300 ${
              isActive ? 'h-5 opacity-100 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'h-0 opacity-0'
            }`}
          />
          <Icon className={`w-[19px] h-[19px] shrink-0 transition-colors ${isActive ? 'text-amber-300' : 'text-stone-400 group-hover:text-amber-300'}`} />
          <span className={`truncate tracking-wide ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function AdminSideBar({ open, onClose, collapsed, onToggleCollapse }) {
  return (
    <>
      {/* Scrim for mobile drawer */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[264px] flex flex-col border-r border-amber-500/20 bg-stone-900/95 backdrop-blur-2xl transition-[width,transform] duration-300 ease-out shadow-2xl
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          ${collapsed ? 'lg:w-[76px]' : 'lg:w-[264px]'}`}
      >
        {/* Brand */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-amber-500/15 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-amber-400/35 to-amber-700/25 border border-amber-400/50 grid place-items-center shadow-[0_0_18px_rgba(245,158,11,0.35)] overflow-hidden">
            <span className="font-om text-xl text-amber-200 leading-none select-none translate-x-[1.5px] -translate-y-[1px]">
              ॐ
            </span>
          </div>
          <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
            <p className="font-cinzel text-sm font-bold tracking-wider text-amber-100 leading-tight">E-HUNDI</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-amber-300/80 font-semibold leading-tight mt-0.5">Temple Console</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 space-y-5 [scrollbar-width:thin] [scrollbar-color:rgba(217,119,6,0.2)_transparent]">
          {ADMIN_NAV.map(({ group, items }) => (
            <div key={group}>
              <p
                className={`px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200/70 ${
                  collapsed ? 'lg:hidden' : ''
                }`}
              >
                {group}
              </p>
              <div className="space-y-1">
                {items.map((item) => (
                  <NavItem key={item.to} item={item} collapsed={collapsed} onNavigate={onClose} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-amber-500/15 p-3 space-y-2 bg-stone-950/40">
          <Link
            to="/admin/login"
            onClick={onClose}
            title={collapsed ? 'Sign out' : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-stone-400 hover:text-rose-200 hover:bg-rose-500/10 transition-colors ${
              collapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
          >
            <LogOut className={`w-[18px] h-[18px] shrink-0 ${collapsed ? '' : 'ml-0.5'}`} />
            <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>Sign out</span>
          </Link>

          <div
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 bg-stone-900 border border-amber-500/25 shadow-sm ${
              collapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
          >
            <div className="w-7 h-7 shrink-0 rounded-lg bg-gradient-to-br from-amber-300/30 to-amber-700/25 border border-amber-400/40 flex items-center justify-center text-[10px] text-amber-200 font-bold">
              SM
            </div>
            <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="truncate text-xs font-semibold text-amber-100 leading-tight">Shri Mahadeva Temple</p>
              <p className="text-[10px] text-stone-300 leading-tight mt-0.5 font-medium">Thiruvananthapuram</p>
            </div>
          </div>

          {/* Desktop-only collapse control */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden lg:flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs text-stone-500 hover:text-amber-200/90 hover:bg-white/[0.04] transition-colors ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-4 h-4 shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className={collapsed ? 'hidden' : ''}>Collapse</span>
          </button>
        </div>
      </aside>
    </>
  );
}
