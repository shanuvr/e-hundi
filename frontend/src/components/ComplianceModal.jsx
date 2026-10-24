import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  X, 
  ShieldCheck, 
  Info, 
  IndianRupee, 
  FileText, 
  RotateCcw, 
  Truck, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';

const POLICIES = [
  { name: 'About Us', path: '/about', icon: Info, desc: 'Platform overview & intermediary role' },
  { name: 'Pricing & Fees', path: '/pricing', icon: IndianRupee, desc: '₹0 donor fee · ₹5,000 temple setup' },
  { name: 'Contact & Helpdesk', path: '/contact', icon: Phone, desc: 'Thrissur office & 7-day dispute resolution' },
  { name: 'Terms of Service', path: '/terms', icon: FileText, desc: 'Voluntary donations & legal terms' },
  { name: 'Privacy Policy', path: '/privacy', icon: ShieldCheck, desc: 'No accounts required · PCI-DSS security' },
  { name: 'Refund & Cancellation', path: '/refund-policy', icon: RotateCcw, desc: 'Non-refundable · Failed payment redressal' },
  { name: 'Shipping & Delivery', path: '/shipping-policy', icon: Truck, desc: 'Instant digital delivery · No physical goods' },
  { name: 'Platform Disclaimer', path: '/disclaimer', icon: AlertCircle, desc: 'Intermediary status & FCRA domestic only' },
];

export default function ComplianceModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-[390px] max-h-[90dvh] flex flex-col rounded-t-[28px] sm:rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-black border border-amber-500/30 shadow-2xl text-stone-200 overflow-hidden z-10"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between shrink-0 bg-stone-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-om text-sm">
              ॐ
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-1.5">
                <span>Legal & Compliance</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-sans">
                  Razorpay Verified
                </span>
              </h3>
              <p className="text-[10px] text-stone-400">Kanikkavanji.com by Programers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Policy List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs scrollbar-thin">
          <p className="text-[11px] text-stone-400 leading-relaxed mb-3">
            Kanikkavanji is an online digital offering platform operated by <strong className="text-stone-200">Programers</strong>, Thrissur, Kerala. All official compliance policies:
          </p>

          <div className="grid grid-cols-1 gap-2">
            {POLICIES.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.path}
                  to={p.path}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/50 hover:bg-amber-500/10 border border-stone-800 hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:text-amber-300 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-200 group-hover:text-amber-200 text-xs truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 shrink-0 ml-2" />
                </Link>
              );
            })}
          </div>

          {/* Operating Entity & Contact Footer */}
          <div className="mt-4 p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-400 space-y-1.5">
            <p className="flex items-start gap-1.5 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>Programers, 4th Floor, Park House, Thrissur, Kerala 680001</span>
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-stone-800/80">
              <a href="tel:+919447151442" className="flex items-center gap-1 text-amber-400 hover:underline">
                <Phone className="w-3 h-3" />
                <span>+91 9447151442</span>
              </a>
              <a href="mailto:info@programers.in" className="flex items-center gap-1 text-amber-400 hover:underline">
                <Mail className="w-3 h-3" />
                <span>info@programers.in</span>
              </a>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
