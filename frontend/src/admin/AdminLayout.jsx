import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AdminSideBar from '../components/AdminSideBar';
import AdminTopBar from './AdminTopBar';
import { useAdmin } from './AdminContext';

export default function AdminLayout() {
  const { temple, loading } = useAdmin();
  // Drawer + rail collapse state.
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (loading && !temple) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-[#f8fafc] text-stone-900 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md animate-pulse">
          <span className="font-om text-lg leading-none">ॐ</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-amber-500/25 border-t-amber-500 animate-spin" />
          <p className="text-xs uppercase tracking-[0.2em] text-stone-600 font-semibold">Connecting Temple Console…</p>
        </div>
      </div>
    );
  }

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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3.5 border-t border-stone-200 text-[11px] text-stone-500">
            <p className="font-medium"><span className="font-malayalam font-bold text-stone-800">കാണിക്കവഞ്ചി</span> Temple Console · <span className="text-amber-700 font-semibold font-sans">v1.0 Production</span></p>
            <div className="flex items-center gap-2.5 font-medium flex-wrap text-stone-500">
              <Link to="/admin/pricing" className="hover:text-amber-800 transition-colors">Pricing</Link>
              <span>·</span>
              <Link to="/admin/terms" className="hover:text-amber-800 transition-colors">Terms</Link>
              <span>·</span>
              <Link to="/admin/privacy" className="hover:text-amber-800 transition-colors">Privacy</Link>
              <span>·</span>
              <Link to="/admin/refund-policy" className="hover:text-amber-800 transition-colors">Refund</Link>
              <span>·</span>
              <Link to="/admin/contact" className="hover:text-amber-800 transition-colors">Support</Link>
              <span>·</span>
              <span className="font-malayalam text-stone-600">ഭാണ്ഡാരം by Programers</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
