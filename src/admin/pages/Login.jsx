import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react';
import { CONTROL } from '../components/Field';

const HIGHLIGHTS = [
  'Temple profile, bilingual mantras & UPI accounts',
  'Real-time collection reports & 80G tax tracking',
  'Multi-kiosk device pairing & remote health monitoring',
];

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-dvh w-full bg-[#0d0c0a] text-stone-100 lg:grid lg:grid-cols-2">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed -top-40 -left-32 w-[600px] h-[600px] rounded-full bg-amber-500/[0.08] blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-orange-600/[0.07] blur-[120px]" />

      {/* Brand panel — desktop */}
      <aside className="relative hidden lg:flex flex-col justify-between border-r border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-stone-900/60 to-orange-500/[0.06] p-12 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-amber-400/40 to-amber-700/30 border border-amber-400/50 grid place-items-center shadow-[0_0_24px_rgba(245,158,11,0.35)]">
            <span className="font-om text-2xl text-amber-200 leading-none select-none translate-x-[1.5px] -translate-y-[1px]">
              ॐ
            </span>
          </div>
          <div>
            <p className="font-cinzel text-lg font-bold tracking-wider text-amber-100 leading-tight">E-HUNDI</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-amber-300 font-semibold leading-tight mt-0.5">Temple Console</p>
          </div>
        </div>

        <div className="max-w-md">
          <h1 className="font-cinzel text-3xl xl:text-4xl font-bold leading-tight text-amber-50">
            One console for every sacred offering.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-stone-300">
            Manage your mandapam&rsquo;s identity, donation preferences, digital darshan videos, and daily offerings seamlessly.
          </p>

          <ul className="mt-8 space-y-3.5">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-stone-200 font-medium">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-malayalam text-sm text-amber-300/70 font-medium">ഭാണ്ഡാരം by Programers</p>
      </aside>

      {/* Form */}
      <main className="relative flex flex-col justify-center px-5 sm:px-8 py-12">
        <div className="mx-auto w-full max-w-[400px]">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-amber-400/35 to-amber-700/25 border border-amber-400/50 grid place-items-center shadow-[0_0_20px_rgba(245,158,11,0.35)]">
              <span className="font-om text-xl text-amber-200 leading-none select-none translate-x-[1.5px] -translate-y-[1px]">
                ॐ
              </span>
            </div>
            <div>
              <p className="font-cinzel text-base font-bold tracking-wider text-amber-100 leading-tight">E-HUNDI</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-amber-300 font-semibold leading-tight mt-0.5">Temple Console</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-50">Temple Sign In</h2>
            <p className="mt-2 text-sm text-stone-300 font-normal">Sign in with your temple administrator credentials.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/admin');
            }}
            className="space-y-5"
          >
            <div>
              <label htmlFor="login-id" className="block mb-1.5 text-xs font-semibold text-stone-100">
                Email or Administrator ID
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  id="login-id"
                  type="text"
                  defaultValue="temple@shrimahadeva.org"
                  placeholder="admin@temple.org"
                  autoComplete="username"
                  className={`${CONTROL} pl-10`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label htmlFor="login-password" className="text-xs font-semibold text-stone-100">
                  Password
                </label>
                <button type="button" className="text-xs font-medium text-amber-300 hover:text-amber-200 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="bhandaaram"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`${CONTROL} pl-10 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-amber-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 shrink-0 rounded border-stone-600 bg-stone-900 accent-amber-500 cursor-pointer"
              />
              <span className="text-xs text-stone-300 group-hover:text-stone-100 transition-colors font-medium">
                Keep me signed in on this workstation
              </span>
            </label>

            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 rounded-xl py-3.5
                bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 text-sm font-bold
                shadow-[0_8px_24px_rgba(245,158,11,0.3)] hover:brightness-110
                active:scale-[0.99] transition-all cursor-pointer"
            >
              Enter Temple Console
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-amber-500/20 text-center">
            <p className="text-xs text-stone-400 font-medium">Authorized temple trust personnel only</p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors"
            >
              ← Back to Kiosk Terminal
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
