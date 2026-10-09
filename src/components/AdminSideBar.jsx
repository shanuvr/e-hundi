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
        `group relative flex items-center gap-2.5 rounded-lg py-2 pr-2.5 text-xs transition-all ${
          collapsed ? 'lg:justify-center lg:px-0' : 'pl-3'
        } ${
          isActive
            ? 'bg-amber-500/10 text-amber-900 font-semibold border border-amber-300 shadow-sm'
            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-transparent font-medium'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-amber-600 transition-all duration-300 ${
              isActive ? 'h-4 opacity-100 shadow-[0_0_6px_rgba(217,119,6,0.6)]' : 'h-0 opacity-0'
            }`}
          />
          <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-amber-700' : 'text-stone-400 group-hover:text-stone-700'}`} />
          <span className={`truncate tracking-normal ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
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
        className={`fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[230px] flex flex-col border-r border-stone-200 bg-white/95 backdrop-blur-xl transition-[width,transform] duration-300 ease-out shadow-sm
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          ${collapsed ? 'lg:w-[68px]' : 'lg:w-[230px]'}`}
      >
        {/* Brand */}
        <div className={`flex items-center gap-2.5 px-3.5 py-3 border-b border-stone-200/80 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 border border-amber-600/30 flex items-center justify-center shadow-sm overflow-hidden text-white">
            <span className="font-om text-sm leading-none select-none flex items-center justify-center text-center">
              ॐ
            </span>
          </div>
          <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
            <p className="font-malayalam text-sm font-bold text-stone-900 leading-tight">കാണിക്കവഞ്ചി</p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-amber-700 font-semibold leading-tight mt-0.5">Temple Console</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overscroll-contain px-2.5 py-3 space-y-3.5 [scrollbar-width:thin]">
          {ADMIN_NAV.map(({ group, items }) => (
            <div key={group}>
              <p
                className={`px-2.5 mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-stone-400 ${
                  collapsed ? 'lg:hidden' : ''
                }`}
              >
                {group}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => (
                  <NavItem key={item.to} item={item} collapsed={collapsed} onNavigate={onClose} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-stone-200/80 p-2.5 space-y-1.5 bg-stone-50/70">
          <Link
            to="/admin/login"
            onClick={onClose}
            title={collapsed ? 'Sign out' : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-stone-600 hover:text-rose-700 hover:bg-rose-50 transition-colors ${
              collapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
          >
            <LogOut className={`w-3.5 h-3.5 shrink-0 ${collapsed ? '' : 'ml-0.5'}`} />
            <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>Sign out</span>
          </Link>

          <div
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 bg-white border border-stone-200 shadow-sm ${
              collapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
          >
            <div className="w-6 h-6 shrink-0 rounded-md bg-amber-500/15 border border-amber-400/50 flex items-center justify-center text-[9px] text-amber-800 font-bold">
              SM
            </div>
            <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="truncate text-[11px] font-semibold text-stone-800 leading-tight">Shri Mahadeva Temple</p>
              <p className="text-[9px] text-stone-500 leading-tight mt-0.5 font-medium">Thiruvananthapuram</p>
            </div>
          </div>

          {/* Desktop-only collapse control */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden lg:flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
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
