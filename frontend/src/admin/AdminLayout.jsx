import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSideBar from '../components/AdminSideBar';
import AdminTopBar from './AdminTopBar';

export default function AdminLayout() {
  // Drawer + rail collapse state.
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-dvh bg-[#f8fafc] text-stone-900">
      {/* Ambient background glows for subtle warm depth */}
      <div className="pointer-events-none fixed -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-amber-400/[0.04] blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-amber-500/[0.03] blur-[140px]" />

      <AdminSideBar
        open={navOpen}
        onClose={() => setNavOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      <div className={`transition-[padding] duration-300 ${collapsed ? 'lg:pl-[68px]' : 'lg:pl-[230px]'}`}>
        <AdminTopBar onOpenMenu={() => setNavOpen(true)} />

        <main className="relative px-3.5 sm:px-5 py-4 sm:py-5 max-w-[1360px]">
          <Outlet />
        </main>

        <footer className="relative px-3.5 sm:px-5 py-4 max-w-[1360px]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 pt-3.5 border-t border-stone-200 text-[11px] text-stone-500">
            <p className="font-medium"><span className="font-malayalam font-bold text-stone-800">കാണിക്കവഞ്ചി</span> Temple Console · <span className="text-amber-700 font-semibold font-sans">v1.0 Production</span></p>
            <p className="font-malayalam text-stone-600 font-medium">ഭാണ്ഡാരം by Programers</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
