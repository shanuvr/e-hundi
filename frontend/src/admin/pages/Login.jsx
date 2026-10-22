import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react';
import { CONTROL } from '../components/Field';

const HIGHLIGHTS = [
  'Temple profile, bilingual mantras & UPI accounts',
  'Real-time collection reports & audit tracking',
  'Multi-kiosk device pairing & live darshan video',
];

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-dvh w-full bg-[#f8fafc] text-stone-900 lg:grid lg:grid-cols-2">
      {/* Brand panel — desktop */}
      <aside className="relative hidden lg:flex flex-col justify-between border-r border-stone-200 bg-gradient-to-br from-amber-50/80 via-white to-amber-100/40 p-12 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 border border-amber-600/30 flex items-center justify-center shadow-md text-white">
            <span className="font-om text-xl leading-none select-none flex items-center justify-center text-center">
              ॐ
            </span>
          </div>
          <div>
            <p className="font-malayalam text-xl font-bold text-stone-900 leading-tight">കാണിക്കവഞ്ചി</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-amber-700 font-semibold leading-tight mt-0.5">Temple Console</p>
          </div>
        </div>

        <div className="max-w-md">
          <h1 className="font-cinzel text-3xl xl:text-4xl font-bold leading-tight text-stone-900">
            One console for every sacred offering.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-stone-600 font-normal">
            Manage your mandapam&rsquo;s identity, donation preferences, digital darshan videos, and daily offerings seamlessly.
          </p>

          <ul className="mt-8 space-y-3.5">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-stone-700 font-medium">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-malayalam text-sm text-amber-800/80 font-medium">ഭാണ്ഡാരം by Programers</p>
      </aside>

      {/* Form */}
      <main className="relative flex flex-col justify-center px-5 sm:px-8 py-12 bg-white">
        <div className="mx-auto w-full max-w-[380px]">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 border border-amber-500 flex items-center justify-center shadow-sm text-white">
              <span className="font-om text-lg leading-none select-none flex items-center justify-center text-center">
                ॐ
              </span>
            </div>
            <div>
              <p className="font-malayalam text-lg font-bold text-stone-900 leading-tight">കാണിക്കവഞ്ചി</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-amber-700 font-semibold leading-tight mt-0.5">Temple Console</p>
            </div>
          </div>

          <div className="mb-7">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-900">Temple Sign In</h2>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-500 font-normal">Sign in with your temple administrator credentials.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/admin');
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="login-id" className="block mb-1 text-xs font-semibold text-stone-700">
                Email or Administrator ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  id="login-id"
                  type="text"
                  defaultValue="temple@shrimahadeva.org"
                  placeholder="admin@temple.org"
                  autoComplete="username"
                  className={`${CONTROL} pl-9`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <label htmlFor="login-password" className="text-xs font-semibold text-stone-700">
                  Password
                </label>
                <button type="button" className="text-xs font-medium text-amber-700 hover:text-amber-800 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="bhandaaram"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`${CONTROL} pl-9 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer group pt-0.5">
              <input
                type="checkbox"
                defaultChecked
                className="w-3.5 h-3.5 shrink-0 rounded border-stone-300 bg-white accent-amber-600 cursor-pointer"
              />
              <span className="text-xs text-stone-600 group-hover:text-stone-900 transition-colors font-medium">
                Keep me signed in on this workstation
              </span>
            </label>

            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 rounded-lg py-2.5
                bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 text-xs sm:text-sm font-bold
                shadow-sm hover:brightness-105
                active:scale-[0.99] transition-all cursor-pointer"
            >
              Enter Temple Console
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-7 pt-5 border-t border-stone-200 text-center">
            <p className="text-[11px] text-stone-400 font-medium">Authorized temple trust personnel only</p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
            >
              ← Back to Kiosk Terminal
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
