import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Edit3,
  ExternalLink,
  Landmark,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Plus,
  Power,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  XCircle,
} from 'lucide-react';
import { api } from '../utils/api';
import TempleFormModal from './TempleFormModal';

export default function SuperadminDashboard() {
  const navigate = useNavigate();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTemple, setSelectedTemple] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check local session
    const stored = localStorage.getItem('superadmin_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    }
    loadTemples();
  }, []);

  const loadTemples = async () => {
    setLoading(true);
    try {
      const res = await api.getTemples();
      setTemples(res.temples || []);
    } catch (err) {
      console.error('Failed to load temples:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.superadminLogout();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('superadmin_user');
    navigate('/superadmin/login');
  };

  const handleToggleStatus = async (temple) => {
    try {
      const res = await api.toggleTempleStatus(temple.id);
      setTemples((prev) =>
        prev.map((t) => (t.id === temple.id ? { ...t, is_active: res.is_active } : t))
      );
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (temple) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${temple.name}? This will remove the temple and its login credentials permanently.`
      )
    ) {
      return;
    }

    try {
      await api.deleteTemple(temple.id);
      setTemples((prev) => prev.filter((t) => t.id !== temple.id));
    } catch (err) {
      alert(err.message || 'Failed to delete temple');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered temples
  const filteredTemples = useMemo(() => {
    return temples.filter((t) => {
      const matchesSearch =
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.name_ml?.toLowerCase().includes(search.toLowerCase()) ||
        t.email?.toLowerCase().includes(search.toLowerCase()) ||
        t.city?.toLowerCase().includes(search.toLowerCase());

      if (statusFilter === 'active') return matchesSearch && t.is_active;
      if (statusFilter === 'inactive') return matchesSearch && !t.is_active;
      return matchesSearch;
    });
  }, [temples, search, statusFilter]);

  // Metric summaries
  const totalTemples = temples.length;
  const activeTemples = temples.filter((t) => t.is_active).length;
  const totalBankAccounts = temples.filter((t) => t.bank_account_number).length;
  const uniqueStates = new Set(temples.map((t) => t.state).filter(Boolean)).size;

  return (
    <div className="min-h-dvh bg-[#0c0a09] text-stone-100 flex flex-col font-sans">
      {/* Superadmin Top Bar */}
      <header className="sticky top-0 z-30 border-b border-stone-800 bg-stone-950/85 backdrop-blur-xl px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 border border-amber-400/40 flex items-center justify-center text-white shadow-md">
            <span className="font-om text-xl leading-none select-none">ॐ</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-malayalam font-bold text-lg text-stone-100 leading-tight">
                കാണിക്കവഞ്ചി
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-500/30 text-amber-300">
                Superadmin
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-medium">
              Multi-Temple Central Registry & Settlement Governance
            </p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-900/60 text-xs font-semibold text-stone-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
          >
            Temple Console (/admin)
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-900/60 text-xs font-semibold text-stone-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
          >
            Kiosk Terminal
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="h-6 w-px bg-stone-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-stone-200">
                {currentUser?.username || 'Superuser'}
              </p>
              <p className="text-[10px] text-amber-400 font-mono">Django Superadmin</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-lg border border-stone-800 bg-stone-900 hover:bg-stone-800 hover:text-rose-400 transition-colors cursor-pointer text-stone-400"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-semibold">Registered Temples</span>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <p className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-100 mt-2">
              {totalTemples}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">Across all jurisdictions</p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-semibold">Active & Live</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="font-cinzel text-2xl sm:text-3xl font-bold text-emerald-300 mt-2">
              {activeTemples}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">Accepting offerings</p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-semibold">Verified Bank Accounts</span>
              <Landmark className="w-4 h-4 text-amber-400" />
            </div>
            <p className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-300 mt-2">
              {totalBankAccounts}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">Exclusive Superadmin lock</p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-semibold">States / Regions</span>
              <MapPin className="w-4 h-4 text-amber-400" />
            </div>
            <p className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-100 mt-2">
              {uniqueStates || 1}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">Active deployment regions</p>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex flex-1 items-center gap-3 max-w-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search temples by name, email, or city…"
                className="w-full rounded-xl bg-stone-900/90 border border-stone-800 pl-9 pr-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl bg-stone-900/90 border border-stone-800 px-3 py-2.5 text-xs font-semibold text-stone-300 outline-none focus:border-amber-500 cursor-pointer transition-all"
            >
              <option value="all">All Temples ({totalTemples})</option>
              <option value="active">Active Only ({activeTemples})</option>
              <option value="inactive">Inactive ({totalTemples - activeTemples})</option>
            </select>
          </div>

          {/* Add Temple Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={loadTemples}
              title="Refresh"
              className="p-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setSelectedTemple(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 text-xs font-bold shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Temple
            </button>
          </div>
        </div>

        {/* Temples Management Table */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/40 backdrop-blur-md overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950/80 border-b border-stone-800 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                <tr>
                  <th className="py-3.5 px-4">Temple Name</th>
                  <th className="py-3.5 px-4">Login Email ID</th>
                  <th className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <Lock className="w-3.5 h-3.5" />
                      Bank Details
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-stone-500">
                      <div className="flex flex-col items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
                        <span>Loading temple records…</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTemples.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-stone-500">
                      <p className="text-sm font-semibold text-stone-400">No temples found</p>
                      <p className="text-xs text-stone-600 mt-1">
                        Try modifying your search or click &quot;Add Temple&quot; to onboard one.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTemples.map((temple) => (
                    <tr
                      key={temple.id}
                      className="hover:bg-stone-800/30 transition-colors group"
                    >
                      {/* Temple Name */}
                      <td className="py-4 px-4 min-w-[220px]">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-stone-100 group-hover:text-amber-300 transition-colors">
                              {temple.name}
                            </p>
                            {temple.name_ml && (
                              <p className="font-malayalam text-stone-400 text-[11px] mt-0.5">
                                {temple.name_ml}
                              </p>
                            )}
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              {temple.short_name && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-stone-800 text-stone-400 font-mono">
                                  {temple.short_name}
                                </span>
                              )}
                              {temple.darshan_video_url && temple.darshan_video_url !== '/video.mp4' ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono">
                                  Darshan: Custom
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-stone-800/80 text-stone-400 font-mono">
                                  Darshan: Default
                                </span>
                              )}
                              {temple.slogan_ml && (
                                <span
                                  className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950/60 border border-amber-500/30 text-amber-300 font-malayalam truncate max-w-[140px]"
                                  title={temple.slogan_ml}
                                >
                                  {temple.slogan_ml}
                                </span>
                              )}
                              <a
                                href={`/${temple.slug || temple.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-amber-400/80 hover:text-amber-300 font-mono inline-flex items-center gap-1 hover:underline"
                                title="Open Live Temple Site"
                              >
                                /{temple.slug || temple.id}
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Login Email */}
                      <td className="py-4 px-4 min-w-[180px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-stone-500" />
                            <span className="font-mono text-stone-200 text-xs">
                              {temple.email}
                            </span>
                            <button
                              onClick={() => copyToClipboard(temple.email, `email-${temple.id}`)}
                              title="Copy Login Email"
                              className="text-stone-500 hover:text-amber-300 transition-colors cursor-pointer"
                            >
                              {copiedId === `email-${temple.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-500">
                            Valid credentials for <span className="text-amber-400">/admin</span>
                          </p>
                        </div>
                      </td>

                      {/* Bank Details */}
                      <td className="py-4 px-4 min-w-[240px]">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-stone-100">
                            {temple.bank_account_holder}
                          </p>
                          <p className="text-[11px] text-stone-400">
                            <span className="text-stone-300">{temple.bank_name}</span>
                          </p>
                          <p className="text-[10px] text-stone-500 font-mono">
                            A/C: •••• {temple.bank_account_number?.slice(-4) || '----'} · IFSC:{' '}
                            <span className="text-stone-400">{temple.bank_ifsc}</span>
                          </p>
                        </div>
                      </td>

                      {/* Location & Contact */}
                      <td className="py-4 px-4 min-w-[160px]">
                        <p className="text-stone-200">
                          {temple.city ? `${temple.city}, ` : ''}
                          {temple.state}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {temple.phone || temple.whatsapp || 'No contact'}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(temple)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            temple.is_active
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              temple.is_active ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                          {temple.is_active ? 'Active' : 'Deactivated'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/${temple.slug || temple.id}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Open Temple Site & Kiosk"
                            className="p-1.5 rounded-lg border border-stone-800 bg-stone-900 hover:bg-stone-800 hover:text-amber-300 transition-colors cursor-pointer text-stone-400"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => {
                              setSelectedTemple(temple);
                              setShowModal(true);
                            }}
                            title="Edit Temple"
                            className="p-1.5 rounded-lg border border-stone-800 bg-stone-900 hover:bg-stone-800 hover:text-amber-300 transition-colors cursor-pointer text-stone-400"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(temple)}
                            title="Delete Temple"
                            className="p-1.5 rounded-lg border border-stone-800 bg-stone-900 hover:bg-stone-800 hover:text-rose-400 transition-colors cursor-pointer text-stone-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal for Add / Edit */}
      {showModal && (
        <TempleFormModal
          temple={selectedTemple}
          onClose={() => {
            setShowModal(false);
            setSelectedTemple(null);
          }}
          onSave={() => {
            setShowModal(false);
            setSelectedTemple(null);
            loadTemples();
          }}
        />
      )}
    </div>
  );
}
