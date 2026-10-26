import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  X,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  ShieldCheck,
  Info,
  IndianRupee,
  FileText,
  RotateCcw,
  Truck,
  AlertCircle,
  ExternalLink,
  Building2,
} from 'lucide-react';
import { getLogoUrl } from '../utils/api';


const POLICIES = [
  { name: 'About Us', path: '/about', icon: Info, label: 'Platform & Intermediary Role' },
  { name: 'Pricing & Fees', path: '/pricing', icon: IndianRupee, label: '₹0 Donor Fee · ₹5,000 Setup' },
  { name: 'Contact & Helpdesk', path: '/contact', icon: Phone, label: 'Thrissur Office & Support' },
  { name: 'Terms of Service', path: '/terms', icon: FileText, label: 'Voluntary Offering Terms' },
  { name: 'Privacy Policy', path: '/privacy', icon: ShieldCheck, label: 'No Accounts · PCI-DSS' },
  { name: 'Refund Policy', path: '/refund-policy', icon: RotateCcw, label: '7-Day Failed Debit Redressal' },
  { name: 'Shipping Policy', path: '/shipping-policy', icon: Truck, label: 'Digital On-Screen Delivery' },
  { name: 'Platform Disclaimer', path: '/disclaimer', icon: AlertCircle, label: 'Intermediary Status & FCRA' },
];

export default function TempleInfoModal({ onClose, temple, templeName = '' }) {
  const [activeTab, setActiveTab] = useState('temple'); // 'temple' | 'legal'

  const tName = temple?.name || templeName || 'Temple';
  const tNameMl = temple?.name_ml || '';
  const tSlogan = temple?.slogan_ml || '';
  
  const addressParts = [
    temple?.street_address,
    temple?.city,
    temple?.state,
    temple?.pin_code,
  ]
    .map((p) => (typeof p === 'string' ? p.trim() : ''))
    .filter(Boolean);
  const locationText = addressParts.length > 0 ? addressParts.join(', ') : null;

  const phoneText = temple?.phone?.trim() || null;
  const whatsappText = temple?.whatsapp?.trim() || null;
  const emailText = temple?.email?.trim() || null;
  const darshanTimings = temple?.darshan_timings?.trim() || null;
  const gstinText = temple?.gstin?.trim() || null;

  const cleanPhone = phoneText ? phoneText.replace(/[^\d+]/g, '') : null;
  const cleanWa = whatsappText ? whatsappText.replace(/\D/g, '') : null;

  const hasAnyInfo = Boolean(
    locationText || phoneText || whatsappText || emailText || darshanTimings || gstinText
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 transform-gpu"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-[6px]"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28, mass: 0.75 }}
        className="relative w-full max-w-[340px] max-h-[88dvh] flex flex-col rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-stone-900/98 via-stone-900/95 to-stone-950/98 border border-amber-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.25)] text-stone-200 transform-gpu overflow-hidden z-10"
      >
        {/* Ambient Top Glow */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-32 h-16 -translate-y-1/2 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

        {/* Close Icon */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-amber-200 transition-colors cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Top Header */}
        <div className="flex flex-col items-center text-center shrink-0 pt-1">
          {temple?.logo_url ? (
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-400/40 shadow-[0_0_18px_rgba(245,158,11,0.3)] mb-1.5 bg-black/60 flex items-center justify-center p-1">
              <img
                src={getLogoUrl(temple.logo_url)}
                alt={tName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<span class="font-om text-xl text-amber-200">ॐ</span>';
                }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/30 to-amber-700/20 border border-amber-400/35 flex items-center justify-center font-om text-xl text-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.3)] mb-1.5">
              ॐ
            </div>
          )}
          <h3 className="font-cinzel text-xs sm:text-sm font-bold text-amber-100 leading-tight px-6 truncate max-w-full">
            {tName}
          </h3>
          {tNameMl && (
            <p className="font-malayalam text-[11px] text-amber-300/80 mt-0.5 truncate max-w-full px-4">
              {tNameMl}
            </p>
          )}
          {tSlogan && (
            <p className="font-malayalam text-[10px] text-amber-200/70 italic mt-0.5 max-w-[280px]">
              &ldquo;{tSlogan}&rdquo;
            </p>
          )}
        </div>

        {/* Two-Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-amber-400/20 mt-3 mb-2 shrink-0">
          <button
            onClick={() => setActiveTab('temple')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'temple'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Temple Info
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'legal'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal & Policies</span>
          </button>
        </div>

        {/* Tab 1: Temple Details */}
        {activeTab === 'temple' && (
          <div className="flex-1 overflow-y-auto space-y-2 text-left pr-0.5 scrollbar-thin">
            {!hasAnyInfo && (
              <div className="p-4 rounded-xl bg-black/40 border border-amber-400/15 text-center text-stone-400 text-[11px] italic my-2">
                വിവരങ്ങൾ ലഭ്യമല്ല · No contact details published yet.
              </div>
            )}

            {locationText && (
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-black/40 border border-amber-400/15">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[8.5px] uppercase tracking-[0.16em] text-amber-200/50 font-medium">Location</p>
                  <p className="text-[10px] text-stone-200 leading-tight mt-0.5">{locationText}</p>
                </div>
              </div>
            )}

            {(phoneText || whatsappText) && (
              <div className={`grid ${phoneText && whatsappText ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                {phoneText && (
                  <a
                    href={cleanPhone ? `tel:${cleanPhone}` : undefined}
                    className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-amber-400/15 hover:border-amber-400/35 transition-colors group"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[8px] uppercase tracking-[0.16em] text-amber-200/50 font-medium">Phone</p>
                      <p className="text-[9.5px] font-medium text-stone-200 group-hover:text-amber-200 truncate">{phoneText}</p>
                    </div>
                  </a>
                )}

                {whatsappText && (
                  <a
                    href={cleanWa ? `https://wa.me/${cleanWa}` : undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-amber-400/15 hover:border-emerald-400/35 transition-colors group"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[8px] uppercase tracking-[0.16em] text-amber-200/50 font-medium">WhatsApp</p>
                      <p className="text-[9.5px] font-medium text-stone-200 group-hover:text-emerald-300 truncate">{whatsappText}</p>
                    </div>
                  </a>
                )}
              </div>
            )}

            {emailText && (
              <a
                href={`mailto:${emailText}`}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 border border-amber-400/15 hover:border-amber-400/35 transition-colors group block"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] uppercase tracking-[0.16em] text-amber-200/50 font-medium">Email</p>
                  <p className="text-[9.5px] font-medium text-stone-200 group-hover:text-amber-200 truncate">{emailText}</p>
                </div>
              </a>
            )}

            {darshanTimings && (
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 border border-amber-400/15">
                <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] uppercase tracking-[0.16em] text-amber-200/50 font-medium">Darshan Timings</p>
                  <p className="text-[9px] text-stone-200 leading-tight whitespace-pre-line">{darshanTimings}</p>
                </div>
              </div>
            )}

            {gstinText && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-amber-400/15">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] uppercase tracking-[0.16em] text-amber-200/50 font-medium">GSTIN / Reg No.</p>
                  <p className="text-[9.5px] font-medium text-stone-200 truncate">{gstinText}</p>
                </div>
              </div>
            )}

            {/* Link to Legal tab */}
            <button
              onClick={() => setActiveTab('legal')}
              className="w-full text-center text-[9px] text-amber-300/80 hover:text-amber-200 underline pt-1 cursor-pointer"
            >
              View Platform Operator & Legal Policies →
            </button>
          </div>
        )}

        {/* Tab 2: Legal & Compliance Policies (for Razorpay & Devotee trust) */}
        {activeTab === 'legal' && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 scrollbar-thin text-left">
            <div className="p-2 rounded-xl bg-black/40 border border-amber-400/15 text-[10px] text-stone-300 leading-relaxed">
              <p className="font-semibold text-stone-200 flex items-center gap-1 mb-0.5">
                <Building2 className="w-3 h-3 text-amber-400" />
                <span>Programers (Platform Operator)</span>
              </p>
              <p className="text-[9px] text-stone-400">
                4th Floor, Park House, Thrissur, Kerala 680001
              </p>
              <div className="flex items-center justify-between pt-1 mt-1 border-t border-stone-800 text-[9px]">
                <a href="tel:+919447151442" className="text-amber-400 hover:underline">
                  +91 9447151442
                </a>
                <a href="mailto:info@programers.in" className="text-amber-400 hover:underline">
                  info@programers.in
                </a>
              </div>
            </div>

            <p className="text-[9.5px] font-semibold text-stone-300 uppercase tracking-wider px-1">
              Official Policies
            </p>

            <div className="grid grid-cols-1 gap-1.5">
              {POLICIES.map((p) => {
                const Icon = p.icon;
                return (
                  <Link
                    key={p.path}
                    to={p.path}
                    onClick={onClose}
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-amber-500/10 border border-amber-400/15 hover:border-amber-400/40 transition-all group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-stone-200 group-hover:text-amber-200 text-[10.5px] truncate">
                          {p.name}
                        </p>
                        <p className="text-[8.5px] text-stone-400 truncate">
                          {p.label}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-stone-500 group-hover:text-amber-400 shrink-0 ml-1.5" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-2.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-semibold font-malayalam text-xs cursor-pointer shadow-[0_4px_16px_rgba(217,119,6,0.35)] active:scale-95 transition-transform shrink-0"
        >
          ശരി / Close
        </button>
      </motion.div>
    </motion.div>
  );
}
