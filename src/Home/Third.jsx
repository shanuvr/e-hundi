import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Unlock, Video, Sparkles, Share2 } from 'lucide-react';
import Mandala from '../components/Mandala';
import Label from '../components/Label';

const makeReceipt = () =>
  `EH-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;

const formatStamp = (d) =>
  d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

/** The "payment successful" pop. Dismiss it to reveal the Darshan screen behind. */
function SuccessDialog({ amount, templeName, receipt, paidAt, onViewDarshan, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute inset-0 z-[100] flex items-center justify-center p-4 transform-gpu"
      role="dialog"
      aria-modal="true"
      aria-label="Payment successful"
    >
      {/* Crisp Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-[6px] transition-opacity" 
        onClick={onViewDarshan} 
      />

      {/* 120 FPS GPU Accelerated Modal Card */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 22 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 15 }}
        transition={{ 
          type: 'spring', 
          stiffness: 340, 
          damping: 28, 
          mass: 0.75,
          delay: 0.05 
        }}
        className="relative w-full max-w-[290px] rounded-3xl px-6 pb-5 pt-7 text-center bg-gradient-to-b from-stone-900/98 via-stone-900/95 to-stone-950/98 border border-amber-400/50 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(245,158,11,0.3)] transform-gpu will-change-transform"
      >
        {/* Subtle Warm Top Glow */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-36 h-20 -translate-y-1/2 rounded-full bg-amber-400/25 blur-2xl pointer-events-none" />

        {/* Success Icon & Animated Checkmark */}
        <div className="relative mx-auto w-[74px] h-[74px] mb-3">
          <motion.span
            className="absolute inset-0 rounded-full border border-amber-300/60 pointer-events-none"
            initial={{ scale: 0.7, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          />
          <svg viewBox="0 0 52 52" className="w-full h-full transform-gpu" fill="none">
            <circle cx="26" cy="26" r="24" fill="rgba(251,191,36,0.12)" stroke="#b45309" strokeWidth="1.5" />
            <motion.circle
              cx="26"
              cy="26"
              r="24"
              stroke="#fde68a"
              strokeWidth="2.2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
            />
            <motion.path
              d="M15.5 27.5l7.5 7.5 14-15.5"
              stroke="#fff7d6"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, delay: 0.35, ease: 'easeOut' }}
            />
          </svg>
        </div>

        <p className="relative font-malayalam text-lg text-amber-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">സമർപ്പണം പൂർത്തിയായി</p>
        <p className="relative mt-0.5 text-[9px] uppercase tracking-[0.3em] text-emerald-400 font-semibold">
          Payment Successful
        </p>

        <div className="relative mt-3.5 font-cinzel font-bold text-3xl text-amber-50 tabular-nums drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          <span className="text-base opacity-55">₹</span>
          {amount}
        </div>
        <p className="relative mt-1 px-2 text-[10px] leading-snug text-amber-200/60">{templeName}</p>

        <div className="relative mt-3 rounded-xl bg-black/45 border border-amber-400/25 px-3 py-2">
          <p className="text-[8.5px] uppercase tracking-[0.2em] text-amber-200/50 font-medium">Receipt No.</p>
          <p className="text-[11px] font-semibold tracking-wide text-amber-100">{receipt}</p>
          <p className="mt-0.5 text-[9px] text-amber-200/50">{formatStamp(paidAt)}</p>
        </div>

        <div className="relative mt-4 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onViewDarshan}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-semibold font-malayalam text-sm cursor-pointer shadow-[0_4px_16px_rgba(217,119,6,0.35)] transition-transform"
          >
            ദർശനം കാണുക
          </motion.button>
          <button
            onClick={onReset}
            className="w-full py-2 rounded-xl bg-amber-400/10 border border-amber-300/20 text-amber-200/85 text-[11px] font-semibold uppercase tracking-[0.15em] cursor-pointer transition-colors hover:bg-amber-400/20 active:scale-95"
          >
            Make Another Offering
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Third({ onBack, onReset, amount = 0, templeName = 'Shri Siddhivinayak Temple' }) {
  // The offering is already settled by the time this screen plays, so the receipt
  // is fixed for the lifetime of the screen and the success pop is up front.
  const [receipt] = useState(makeReceipt);
  const [paidAt] = useState(() => new Date());
  const [showDone, setShowDone] = useState(true);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setShowDone(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const share = async () => {
    const text = `I offered ₹${amount} at ${templeName} through E-Hundi. Receipt ${receipt}.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'E-Hundi Offering', text });
        return;
      }
      await navigator.clipboard.writeText(text);
    } catch {
      /* user dismissed the share sheet, or clipboard is unavailable */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="relative w-full h-full flex flex-col justify-between items-center p-3 sm:p-6 transform-gpu"
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between z-10 shrink-0 pt-0.5">
        <button
          onClick={onBack}
          aria-label="Back"
          className="p-2 sm:p-2.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/30 backdrop-blur-md cursor-pointer transition-colors hover:bg-amber-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-200 font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
          Darshan
        </span>
        <div className="w-8 sm:w-9 flex justify-center">
          <Unlock className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Blessing line */}
      <div className="relative z-10 w-full flex flex-col items-center px-2 pt-0.5 shrink-0">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-malayalam font-medium text-center text-[13.5px] sm:text-[14.5px] leading-tight text-amber-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] max-w-[330px]"
        >
          നിങ്ങളുടെ സമർപ്പണം ദൈവം സ്വീകരിച്ചു
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-0.5 text-[8.5px] uppercase tracking-[0.25em] text-amber-200/80 font-medium"
        >
          Your Offering Has Been Received
        </motion.p>
      </div>

      {/* Darshan medallion, unlocked */}
      <div className="relative z-10 w-full flex-1 min-h-0 flex items-center justify-center py-2">
        <div className="relative w-[190px] h-[190px] sm:w-[220px] sm:h-[220px] flex items-center justify-center">
          <Mandala className="absolute inset-0 w-full h-full opacity-70" />
          <motion.div
            className="absolute w-36 h-36 rounded-full bg-amber-500/30 blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            className="relative font-om text-5xl sm:text-6xl text-amber-100 select-none"
            animate={{
              filter: [
                'drop-shadow(0 0 8px rgba(251,191,36,0.6))',
                'drop-shadow(0 0 22px rgba(245,158,11,0.95))',
                'drop-shadow(0 0 8px rgba(251,191,36,0.6))',
              ],
            }}
            transition={{ duration: 2.6, repeat: Infinity }}
          >
            ॐ
          </motion.span>

          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.35 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Watch darshan"
            className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 border border-amber-100/60 shadow-[0_0_28px_rgba(245,158,11,0.6)] flex items-center justify-center cursor-pointer"
          >
            <Video className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Receipt summary */}
      <div className="relative z-10 w-full shrink-0">
        <Label>Offering Summary</Label>
        <div className="w-full overflow-hidden rounded-2xl bg-black/40 border border-amber-400/30 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-amber-400/15">
            <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-700/20 border border-amber-400/30 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-amber-100">{templeName}</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-amber-200/45">Digital Hundi</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-amber-200/55">Total Offering</span>
            <span className="font-cinzel font-bold text-2xl text-amber-50 tabular-nums">
              <span className="text-sm opacity-60">₹</span>
              {amount}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-2 bg-black/25 border-t border-amber-400/15">
            <span className="text-[9px] uppercase tracking-[0.2em] text-amber-200/40">Receipt</span>
            <span className="truncate text-[10.5px] font-medium tracking-wide text-amber-100/80">
              {receipt} · {formatStamp(paidAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 w-full mt-2.5 shrink-0 flex items-center gap-2">
        <motion.button
          onClick={onReset}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-2.5 sm:py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-semibold font-malayalam text-sm sm:text-base border border-yellow-200/50 shadow-[0_8px_25px_rgba(217,119,6,0.35)] cursor-pointer"
        >
          മറ്റൊരു സമർപ്പണം
        </motion.button>
        <motion.button
          onClick={share}
          whileTap={{ scale: 0.92 }}
          aria-label="Share your offering"
          className="w-[46px] shrink-0 py-2.5 sm:py-3 rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-400/30 backdrop-blur-md hover:bg-amber-500/20 transition-colors flex items-center justify-center cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showDone && (
          <SuccessDialog
            amount={amount}
            templeName={templeName}
            receipt={receipt}
            paidAt={paidAt}
            onViewDarshan={() => setShowDone(false)}
            onReset={onReset}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
