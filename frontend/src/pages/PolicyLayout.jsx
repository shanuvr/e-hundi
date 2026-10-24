import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Truck, 
  IndianRupee, 
  AlertCircle, 
  Info, 
  ChevronRight,
  ExternalLink 
} from 'lucide-react';

export const POLICY_NAV_LINKS = [
  { name: 'About', path: '/about', icon: Info },
  { name: 'Pricing', path: '/pricing', icon: IndianRupee },
  { name: 'Contact', path: '/contact', icon: Phone },
  { name: 'Terms of Service', path: '/terms', icon: FileText },
  { name: 'Privacy Policy', path: '/privacy', icon: ShieldCheck },
  { name: 'Refund Policy', path: '/refund-policy', icon: RotateCcw },
  { name: 'Shipping Policy', path: '/shipping-policy', icon: Truck },
  { name: 'Disclaimer', path: '/disclaimer', icon: AlertCircle },
];

export default function PolicyLayout({ title, subtitle, icon: Icon, currentPath, children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.search.includes('theme=admin');
  const targetPath = (path) => (isAdmin ? `/admin${path}` : path);

  // 1. ADMIN THEME: Rendered inside AdminLayout with Admin aesthetic
  if (isAdmin) {
    return (
      <div className="policy-theme-admin max-w-5xl space-y-4">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 mb-3.5 sm:mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 border border-amber-300/40">
                Compliance & Legal Documentation
              </span>
            </div>
            <h2 className="font-cinzel text-base sm:text-xl font-bold text-stone-900 tracking-wide flex items-center gap-2">
              {Icon && <Icon className="w-5 h-5 text-amber-700 shrink-0" />}
              <span>{title}</span>
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-[11px] sm:text-xs text-stone-500 max-w-2xl leading-relaxed font-normal">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={targetPath('/contact')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Support Desk</span>
            </Link>
          </div>
        </div>

        {/* Admin Policy Quick Switcher Bar */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-1.5 shadow-2xs overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 min-w-max">
            {POLICY_NAV_LINKS.map((item) => {
              const itemPath = targetPath(item.path);
              const active = location.pathname === itemPath || currentPath === item.path;
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={itemPath}
                  className={`text-xs px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-medium ${
                    active
                      ? 'bg-amber-500/15 text-amber-900 font-semibold border border-amber-400/30 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <ItemIcon className={`w-3.5 h-3.5 ${active ? 'text-amber-800' : 'text-stone-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content Area styled with .policy-theme-admin */}
        <div className="space-y-4 pt-1">
          {children}
        </div>
      </div>
    );
  }

  // 2. KIOSK THEME: Rendered outside Admin with sacred dark sanctum aesthetic
  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 antialiased flex flex-col relative selection:bg-amber-500 selection:text-stone-950">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/[0.04] blur-[150px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[500px] bg-orange-600/[0.03] blur-[150px]" />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transition-all">
              <span className="font-om text-base font-bold leading-none">ॐ</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-malayalam font-bold text-amber-400 tracking-wide text-base">കാണിക്കവഞ്ചി</span>
              </div>
              <span className="text-[10px] text-stone-400 tracking-tight">By Programers, Thrissur</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="text-xs px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors font-medium flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Helpdesk</span>
            </Link>
          </div>
        </div>

        {/* Quick Nav Bar */}
        <div className="bg-stone-900/60 border-t border-stone-800/50 overflow-x-auto scrollbar-none">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 py-1.5 min-w-max">
            {POLICY_NAV_LINKS.map((item) => {
              const active = currentPath === item.path;
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
                    active
                      ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm shadow-amber-500/20'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <ItemIcon className={`w-3.5 h-3.5 ${active ? 'text-stone-950' : 'text-stone-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative border-b border-stone-800 bg-gradient-to-b from-stone-900/60 to-stone-950 px-4 sm:px-6 py-10 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium tracking-wide uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Official Policy & Legal Information</span>
          </div>

          <div className="flex items-start gap-4 sm:gap-5">
            {Icon && (
              <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 shrink-0 mt-1">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-philosopher text-stone-100 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm sm:text-base text-stone-400 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="space-y-6 leading-relaxed">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-800 bg-stone-900/80 backdrop-blur-sm text-stone-400 text-xs py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-stone-100 font-semibold mb-2">
              <span className="font-malayalam text-amber-400 text-base">കാണിക്കവഞ്ചി</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-[13px] mb-3">
              Kanikkavanji is an online digital offering and donation technology platform for temples in India.
              Owned and operated by Programers, Thrissur, Kerala.
            </p>
          </div>

          <div>
            <h2 className="text-stone-200 font-semibold mb-3 tracking-wide text-xs uppercase">
              Quick Links
            </h2>
            <ul className="grid grid-cols-2 gap-2 text-[12px]">
              {POLICY_NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-stone-600" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-stone-200 font-semibold mb-3 tracking-wide text-xs uppercase">
              Registered Office & Contact
            </h2>
            <div className="space-y-2 text-[12px] text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-stone-300">Programers</strong><br />
                  4th Floor, Park House, Thrissur,<br />
                  Kerala 680001, India
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919447151442" className="hover:text-stone-200 text-stone-300">
                  +91 9447151442
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:info@programers.in" className="hover:text-stone-200 text-stone-300">
                  info@programers.in
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px]">
          <p>© {new Date().getFullYear()} Kanikkavanji.com. Owned and operated by Programers. All rights reserved.</p>
          <p>Indian Domestic Devotees Only · Razorpay Payment Gateway Partner</p>
        </div>
      </footer>
    </div>
  );
}
