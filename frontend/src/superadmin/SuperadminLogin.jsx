import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, ShieldAlert, ShieldCheck, User } from 'lucide-react';
import { api } from '../utils/api';

export default function SuperadminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('superadmin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.superadminLogin(username.trim(), password);
      if (res.success) {
        localStorage.setItem('superadmin_user', JSON.stringify(res.user));
        navigate('/superadmin');
      } else {
        setError('Superuser authentication failed');
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-[#0c0a09] text-stone-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none fixed bottom-10 right-1/4 w-80 h-80 bg-orange-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 border border-amber-400/30 shadow-[0_0_30px_rgba(245,158,11,0.25)] text-white mb-4">
            <span className="font-om text-2xl leading-none select-none">ॐ</span>
          </div>
          <p className="font-malayalam text-2xl font-bold text-amber-100">കാണിക്കവഞ്ചി</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-1.5 rounded-full bg-amber-400/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-[0.2em]">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Django Superadmin Portal
          </div>
          <p className="mt-2 text-xs text-stone-400">
            Sign in with your Django superuser credentials to manage registered temples and banking records.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-stone-300">
                Superuser Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="superadmin or admin@hundi.org"
                  className="w-full rounded-lg bg-stone-950/80 border border-stone-700/80 pl-9 pr-3 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-stone-300">
                Superuser Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg bg-stone-950/80 border border-stone-700/80 pl-9 pr-10 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 mt-2
                bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 text-xs sm:text-sm font-bold
                shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:brightness-105 active:scale-[0.99]
                disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-stone-950/30 border-t-stone-950 animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  Sign In to Superadmin
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
            <Link to="/admin" className="hover:text-amber-400 transition-colors">
              Temple Admin Portal →
            </Link>
            <Link to="/" className="hover:text-amber-400 transition-colors">
              Kiosk View →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
