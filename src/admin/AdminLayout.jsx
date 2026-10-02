import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSideBar from '../components/AdminSideBar';
import AdminTopBar from './AdminTopBar';

export default function AdminLayout() {
  // Drawer + rail collapse state.
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-dvh bg-[#0d0c0a] text-stone-100">
      {/* Ambient background glows for depth and visual richness */}
      <div className="pointer-events-none fixed -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-amber-500/[0.08] blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-orange-600/[0.07] blur-[120px]" />

      <AdminSideBar
        open={navOpen}
        onClose={() => setNavOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      <div className={`transition-[padding] duration-300 ${collapsed ? 'lg:pl-[76px]' : 'lg:pl-[264px]'}`}>
        <AdminTopBar onOpenMenu={() => setNavOpen(true)} />

        <main className="relative px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px]">
          <Outlet />
        </main>

        <footer className="relative px-4 sm:px-6 py-6 max-w-[1400px]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-5 border-t border-amber-500/20 text-xs text-stone-400">
            <p className="font-medium">E-Hundi Temple Console · <span className="text-amber-300/80">v1.0 Production</span></p>
            <p className="font-malayalam text-amber-300/70 font-medium">ഭാണ്ഡാരം by Programers</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
