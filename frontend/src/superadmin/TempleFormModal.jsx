import { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Check,
  CreditCard,
  FileText,
  Film,
  Image,
  KeyRound,
  Landmark,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Sparkles,
  UploadCloud,
  Video,
  X,
} from 'lucide-react';
import { api, getDarshanVideoUrl } from '../utils/api';

const TABS = [
  { id: 'identity', label: 'Identity & Credentials', icon: KeyRound },
  { id: 'bank', label: 'Bank Details (Mandatory)', icon: Landmark, mandatory: true },
  { id: 'contact', label: 'Contact & Location', icon: MapPin },
  { id: 'media', label: 'Darshan & Slogans', icon: Sparkles },
];

export default function TempleFormModal({ temple, onClose, onSave }) {
  const isEditing = Boolean(temple && temple.id);

  const [activeTab, setActiveTab] = useState('identity');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState('');
  const [mediaMode, setMediaMode] = useState('upload');
  const [sloganMlLimitReached, setSloganMlLimitReached] = useState(false);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    // Identity & credentials
    name: '',
    name_ml: '',
    short_name: '',
    slug: '',
    primary_language: 'ml',
    email: '',
    password: '',

    // Bank details (Mandatory)
    bank_name: '',
    bank_account_holder: '',
    bank_account_number: '',
    bank_ifsc: '',

    // Contact & Location
    phone: '',
    whatsapp: '',
    street_address: '',
    city: '',
    state: 'Kerala',
    pin_code: '',
    gstin: '',

    // Slogans & Darshan
    slogan_ml: '',
    darshan_timings: '',
    darshan_video_url: '',
    darshan_thumbnail_url: '',
    darshan_message_template: '',

    // Assets
    logo_url: '',
  });

  useEffect(() => {
    if (temple) {
      setFormData({
        name: temple.name || '',
        name_ml: temple.name_ml || '',
        short_name: temple.short_name || '',
        slug: temple.slug || '',
        primary_language: temple.primary_language || 'ml',
        email: temple.email || '',
        password: '', // blank unless changing

        bank_name: temple.bank_name || '',
        bank_account_holder: temple.bank_account_holder || '',
        bank_account_number: temple.bank_account_number || '',
        bank_ifsc: temple.bank_ifsc || '',

        phone: temple.phone || '',
        whatsapp: temple.whatsapp || '',
        street_address: temple.street_address || '',
        city: temple.city || '',
        state: temple.state || 'Kerala',
        pin_code: temple.pin_code || '',
        gstin: temple.gstin || '',

        slogan_ml: temple.slogan_ml || '',
        darshan_timings: temple.darshan_timings || '',
        darshan_video_url: temple.darshan_video_url || '',
        darshan_thumbnail_url: temple.darshan_thumbnail_url || '',
        darshan_message_template: temple.darshan_message_template || '',

        logo_url: temple.logo_url || '',
      });
    }
  }, [temple]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVideoFileChange = async (file) => {
    if (!file) return;
    setVideoUploadError('');
    if (!file.type.startsWith('video/')) {
      setVideoUploadError('Please select a valid video file (MP4, WebM, MOV, OGG).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setVideoUploadError(`Video file size (${sizeMB} MB) exceeds the 15 MB limit. Please select a video under 15 MB.`);
      return;
    }
    try {
      setUploadingVideo(true);
      const res = await api.uploadDarshanVideo(file, temple?.id);
      handleChange('darshan_video_url', res.video_url);
    } catch (err) {
      setVideoUploadError(err.message || 'Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleResetDefaultVideo = () => {
    handleChange('darshan_video_url', '');
    setVideoUploadError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side quick checks
    if (!formData.name.trim()) {
      setActiveTab('identity');
      setError('Temple name (English) is required.');
      return;
    }
    if (!formData.email.trim()) {
      setActiveTab('identity');
      setError('Login email ID is required.');
      return;
    }
    if (!isEditing && !formData.password.trim()) {
      setActiveTab('identity');
      setError('Password is required for newly created temples.');
      return;
    }

    // Mandatory Bank Details
    if (
      !formData.bank_name.trim() ||
      !formData.bank_account_holder.trim() ||
      !formData.bank_account_number.trim() ||
      !formData.bank_ifsc.trim()
    ) {
      setActiveTab('bank');
      setError('All bank details (Bank Name, Holder Name, Account Number, IFSC) are mandatory.');
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        await api.updateTemple(temple.id, formData);
      } else {
        await api.createTemple(formData);
      }
      onSave();
    } catch (err) {
      setError(err.message || 'Failed to save temple.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-100">
                {isEditing ? `Edit Temple: ${temple.name}` : 'Register New Temple'}
              </h2>
              <p className="text-xs text-stone-400">
                Configure temple profile, admin credentials, and exclusive settlement bank accounts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-stone-800 bg-stone-950/30 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  active
                    ? 'border-amber-400 text-amber-300 bg-stone-800/60'
                    : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-stone-500'}`} />
                {tab.label}
                {tab.mandatory && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: IDENTITY & CREDENTIALS */}
          {activeTab === 'identity' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">
                    Temple Name (English) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Chinmaya Sri Bhuvaneswari Navagraha Temple"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">Appears in kiosk header & receipts</span>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">
                    Temple Name (Malayalam)
                  </label>
                  <input
                    type="text"
                    value={formData.name_ml}
                    onChange={(e) => handleChange('name_ml', e.target.value)}
                    placeholder="ചിന്മയ ശ്രീ ഭുവനേശ്വരി നവഗ്രഹ ക്ഷേത്രം"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-malayalam transition-all"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">Displayed for Malayalam language donors</span>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">Short Name</label>
                  <input
                    type="text"
                    value={formData.short_name}
                    onChange={(e) => handleChange('short_name', e.target.value)}
                    placeholder="Chinmaya Sri Bhuvaneswari"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">Used where screen space is tight</span>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">Custom URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                    placeholder="e.g. chinmaya-temple"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs font-mono text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Public address: /{formData.slug || 'templename'} (auto-generated if empty)
                  </span>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">Primary Language</label>
                  <select
                    value={formData.primary_language}
                    onChange={(e) => handleChange('primary_language', e.target.value)}
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 outline-none focus:border-amber-500 transition-all cursor-pointer"
                  >
                    <option value="ml">മലയാളം (Malayalam) — Default</option>
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                  </select>
                </div>
              </div>

              {/* Login Credentials Section */}
              <div className="mt-5 pt-4 border-t border-stone-800">
                <div className="flex items-center gap-2 mb-3">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Temple Administrator Credentials
                  </h3>
                </div>
                <p className="text-xs text-stone-400 mb-3.5">
                  The temple administrator will use these credentials to sign in at <code className="text-amber-300 font-mono">/admin</code>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-stone-300">
                      Login Email ID <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="admin@temple.org"
                        className="w-full rounded-lg bg-stone-950 border border-stone-700 pl-9 pr-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-semibold text-stone-300">
                      Password {isEditing ? '(Leave blank to keep unchanged)' : <span className="text-amber-400">*</span>}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                      <input
                        type="text"
                        required={!isEditing}
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        placeholder={isEditing ? 'Enter new password to change' : '••••••••••••'}
                        className="w-full rounded-lg bg-stone-950 border border-stone-700 pl-9 pr-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BANK DETAILS (MANDATORY & EXCLUSIVE TO SUPERADMIN) */}
          {activeTab === 'bank' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-200">
                    Mandatory & Superadmin-Exclusive Settlement Details
                  </p>
                  <p className="mt-0.5 text-[11px] text-stone-300 leading-relaxed">
                    Offerings made via the Kiosk are routed directly to these bank settlement coordinates.
                    Per system security policy, temple administrators cannot edit these details in their console.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">
                    Registered Payee Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bank_account_holder}
                    onChange={(e) => handleChange('bank_account_holder', e.target.value)}
                    placeholder="e.g. CHINMAYA MISSION TEMPLE TRUST"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">Account holder name as per bank records</span>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">
                    Settlement Bank Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bank_name}
                    onChange={(e) => handleChange('bank_name', e.target.value)}
                    placeholder="e.g. ICICI Bank, State Bank of India"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">
                    Account Number <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bank_account_number}
                    onChange={(e) => handleChange('bank_account_number', e.target.value)}
                    placeholder="e.g. 002105004417"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">
                    IFSC Code <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bank_ifsc}
                    onChange={(e) => handleChange('bank_ifsc', e.target.value.toUpperCase())}
                    placeholder="e.g. ICIC0000021"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 uppercase font-mono transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & LOCATION */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 471 234 5678"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    placeholder="+91 98470 12345"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">Darshan video receipts will be dispatched to this sender</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-xs font-semibold text-stone-300">Street Address</label>
                  <input
                    type="text"
                    value={formData.street_address}
                    onChange={(e) => handleChange('street_address', e.target.value)}
                    placeholder="East Fort, Marine Drive"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">City / District</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Thiruvananthapuram"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="Kerala"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">PIN Code</label>
                  <input
                    type="text"
                    value={formData.pin_code}
                    onChange={(e) => handleChange('pin_code', e.target.value)}
                    placeholder="695001"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-300">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => handleChange('gstin', e.target.value)}
                    placeholder="32AAAAA0000A1Z5"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 uppercase font-mono transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-xs font-semibold text-stone-300">Darshan Timings (Optional)</label>
                  <input
                    type="text"
                    value={formData.darshan_timings}
                    onChange={(e) => handleChange('darshan_timings', e.target.value)}
                    placeholder="e.g. 05:30 AM – 12:00 PM · 05:00 PM – 08:30 PM"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">Displayed on temple info card only when entered</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DARSHAN, SLOGANS & ASSETS (OPTIONAL) */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  {(() => {
                    const mlLen = (formData.slogan_ml || '').length;
                    const isAtLimit = mlLen >= 121;
                    const isNearLimit = !isAtLimit && (mlLen >= 102 || mlLen >= 121 - 15);
                    const counterColor = isAtLimit
                      ? 'text-rose-500 font-bold'
                      : isNearLimit
                      ? 'text-amber-400 font-semibold'
                      : 'text-stone-400';

                    return (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-stone-300">
                            Malayalam Mantra / Slogan
                          </label>
                          <span className={`text-[10px] font-mono transition-colors ${counterColor}`}>
                            {mlLen}/121
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={121}
                          value={formData.slogan_ml}
                          onChange={(e) => {
                            if (e.target.value.length < 121) {
                              setSloganMlLimitReached(false);
                            }
                            handleChange('slogan_ml', e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (mlLen >= 121) {
                              const isControlKey = [
                                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                                'Tab', 'Escape', 'Home', 'End', 'PageUp', 'PageDown', 'Shift', 'Alt', 'Meta', 'CapsLock'
                              ].includes(e.key);
                              const isModifierCombo = (e.ctrlKey || e.metaKey) && ['a', 'c', 'x'].includes(e.key.toLowerCase());
                              const hasSelection = e.target.selectionStart !== e.target.selectionEnd;
                              if (!isControlKey && !isModifierCombo && !hasSelection) {
                                setSloganMlLimitReached(true);
                              }
                            }
                            if (e.key === 'Backspace' || e.key === 'Delete') {
                              setSloganMlLimitReached(false);
                            }
                          }}
                          onBeforeInput={(e) => {
                            if (mlLen >= 121 && e.target.selectionStart === e.target.selectionEnd) {
                              setSloganMlLimitReached(true);
                            }
                          }}
                          placeholder="നിങ്ങളുടെ സമർപ്പണം, ഭഗവാന്റെ അനുഗ്രഹം"
                          className={`w-full rounded-lg bg-stone-950 border px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none font-malayalam transition-all ${
                            sloganMlLimitReached
                              ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                              : 'border-stone-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                          }`}
                        />
                        {sloganMlLimitReached ? (
                          <span className="text-[11px] font-medium text-rose-400 mt-1 block">
                            Character limit reached
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-500 mt-1 block">
                            Displayed prominently on Devotee Kiosk welcome & offering screens
                          </span>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Darshan Video Section: Either upload video or enter stream link */}
                <div className="sm:col-span-2 rounded-xl bg-stone-950/80 border border-stone-800 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-amber-400" />
                        Darshan Video
                      </label>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Plays on offering completion screen. Either upload video (up to 15 MB) or enter stream link.
                      </p>
                    </div>

                    {formData.darshan_video_url && formData.darshan_video_url !== '/video.mp4' && (
                      <button
                        type="button"
                        onClick={handleResetDefaultVideo}
                        className="text-[11px] text-amber-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Use Default Video (/video.mp4)
                      </button>
                    )}
                  </div>

                  {/* Mode switcher: Upload vs Stream Link */}
                  <div className="flex items-center gap-2 border-b border-stone-800 pb-2.5">
                    <button
                      type="button"
                      onClick={() => setMediaMode('upload')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        mediaMode === 'upload'
                          ? 'bg-amber-500 text-stone-950 shadow-xs'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Upload Video (Max 15 MB)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaMode('stream')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        mediaMode === 'stream'
                          ? 'bg-amber-500 text-stone-950 shadow-xs'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      Enter Stream Link
                    </button>
                  </div>

                  {/* Video upload error notice */}
                  {videoUploadError && (
                    <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                      {videoUploadError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                      {mediaMode === 'upload' ? (
                        <>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                            className="hidden"
                            onChange={(e) => handleVideoFileChange(e.target.files?.[0])}
                          />
                          <div
                            onClick={() => !uploadingVideo && fileInputRef.current?.click()}
                            className="border-2 border-dashed border-stone-700 hover:border-amber-500/60 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-stone-900/40 hover:bg-stone-900/80 min-h-[140px]"
                          >
                            {uploadingVideo ? (
                              <Loader2 className="w-6 h-6 text-amber-400 animate-spin mb-1.5" />
                            ) : (
                              <UploadCloud className="w-6 h-6 text-amber-400 mb-1.5" />
                            )}
                            <p className="text-xs font-bold text-stone-200">
                              {uploadingVideo ? 'Uploading Darshan Video…' : 'Click to Upload Darshan Video'}
                            </p>
                            <p className="text-[10px] text-stone-400 mt-0.5">
                              MP4, WebM, MOV · <span className="text-amber-400 font-semibold">Strict 15 MB upload limit</span>
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <label className="block text-[11px] font-semibold text-stone-300">
                            Darshan Video Stream Link
                          </label>
                          <input
                            type="url"
                            value={formData.darshan_video_url}
                            onChange={(e) => handleChange('darshan_video_url', e.target.value)}
                            placeholder="https://cdn.temple.org/video/darshan.mp4"
                            className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono transition-all"
                          />
                          <p className="text-[10px] text-stone-500">
                            Paste an HTTPS direct MP4/WebM or HLS stream link.
                          </p>
                        </div>
                      )}

                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-stone-400">
                        <span>
                          Current:{' '}
                          {formData.darshan_video_url && formData.darshan_video_url !== '/video.mp4' ? (
                            <span className="text-amber-300 font-mono truncate inline-block max-w-[160px] align-bottom">
                              {formData.darshan_video_url.split('/').pop()}
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-medium">Default (/video.mp4)</span>
                          )}
                        </span>
                        <span className="text-stone-500 font-medium">15 MB max limit</span>
                      </div>
                    </div>

                    {/* Live Preview Player */}
                    <div className="rounded-xl border border-stone-800 bg-black/60 p-2.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-1.5 px-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200/80">
                          Darshan Video Preview
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">
                          {formData.darshan_video_url && formData.darshan_video_url !== '/video.mp4' ? 'Custom' : 'Default'}
                        </span>
                      </div>
                      <div className="w-full aspect-video rounded-lg overflow-hidden bg-black border border-stone-800 flex items-center justify-center">
                        <video
                          key={formData.darshan_video_url || 'default'}
                          src={getDarshanVideoUrl(formData.darshan_video_url)}
                          controls
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-xs font-semibold text-stone-300">
                    WhatsApp Message Template
                  </label>
                  <textarea
                    rows={2}
                    value={formData.darshan_message_template}
                    onChange={(e) => handleChange('darshan_message_template', e.target.value)}
                    placeholder="Namaste! Your offering of ₹{amount} to {temple} is received. Watch your darshan: {link}"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 leading-relaxed resize-none transition-all"
                  />
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    Use tokens: &#123;amount&#125;, &#123;temple&#125;, &#123;receipt&#125;, &#123;link&#125;
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-xs font-semibold text-stone-300">
                    Temple Logo URL (Asset)
                  </label>
                  <input
                    type="text"
                    value={formData.logo_url}
                    onChange={(e) => handleChange('logo_url', e.target.value)}
                    placeholder="https://cdn.temple.org/assets/logo.png"
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 text-xs font-bold shadow-md hover:brightness-105 active:scale-[0.98] disabled:opacity-50 cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-stone-950/30 border-t-stone-950 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {isEditing ? 'Save Changes' : 'Create Temple'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
