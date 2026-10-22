import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Diya from '../components/Diya';
import LotusBase from '../components/LotusBase';
import Prabhavali from '../components/Prabhavali';
import { MONEY } from '../data/money';
import { playTempleBell } from '../utils/audio';

export const FIRST_SCREEN_DURATION = 3500;

/** Kalasham — the sacred pot that crowns a temple doorway. Drawn inline; used once. */
function Kalasham({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="kalasham-body" x1="16" y1="10" x2="16" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde68a" />
          <stop offset="0.5" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#78350f" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="5.5" r="2" fill="#fcd34d" fillOpacity="0.9" />
      <ellipse cx="16" cy="10" rx="6" ry="2" fill="#fbbf24" fillOpacity="0.85" />
      <path
        d="M16 12c4.6 0 7.4 3.4 7.4 7.6 0 5.4-3.2 9-7.4 9s-7.4-3.6-7.4-9C8.6 15.4 11.4 12 16 12Z"
        fill="url(#kalasham-body)"
        stroke="#fcd34d"
        strokeOpacity="0.45"
        strokeWidth="0.7"
      />
      <ellipse cx="16" cy="28.8" rx="7.6" ry="1.8" fill="#fcd34d" fillOpacity="0.35" />
    </svg>
  );
}

export default function First({ templeName = "ചിന്മയ ശ്രീ ഭുവനേശ്വരി നവഗ്രഹ ക്ഷേത്രം", onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, FIRST_SCREEN_DURATION);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Preload screen 2 assets silently in browser background when idle
  useEffect(() => {
    const preloadAssets = () => {
      const urls = ['/hundi.webp', ...Object.values(MONEY).map((m) => m.src)];
      urls.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(preloadAssets, { timeout: 1500 });
      return () => window.cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(preloadAssets, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDevotionalTap = () => {
    playTempleBell();
    if (onComplete) onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleDevotionalTap}
      className="relative w-full h-full flex flex-col justify-between items-center p-3.5 sm:p-5 text-center cursor-pointer select-none overflow-hidden transform-gpu will-change-transform"
    >
      {/* Temple Badge, crowned by a kalasham */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col items-center z-10 pt-0.5 shrink-0 transform-gpu"
      >
        <Kalasham className="w-4 h-4 sm:w-5 sm:h-5 mb-1 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
        <div className="px-4 py-1 sm:px-5 sm:py-1.5 rounded-full bg-black/80 border border-amber-400/50 shadow-[0_4px_16px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <p className="font-malayalam text-[11px] sm:text-[13px] font-bold text-amber-100 drop-shadow-sm">
            {templeName}
          </p>
        </div>
      </motion.div>

      {/* Center Sacred Hero: ॐ on a lotus, lit by diyas */}
      <div className="flex flex-col items-center justify-center flex-1 min-h-0 z-10 py-1 sm:py-2 w-full">
        <div className="relative flex flex-col items-center mb-2 sm:mb-3">
          {/* Prabhavali + Radiant Sanctum Halo */}
          <Prabhavali className="absolute w-[200px] h-[200px] sm:w-[225px] sm:h-[225px] opacity-70 drop-shadow-[0_0_24px_rgba(245,158,11,0.28)] transform-gpu" />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-amber-500/35 via-orange-500/28 to-yellow-300/38 blur-2xl pointer-events-none transform-gpu will-change-transform"
          />

          {/* Golden Medallion */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.05 }}
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-amber-400/35 via-amber-700/25 to-black/90 border-2 border-amber-400/80 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)] backdrop-blur-md transform-gpu will-change-transform"
          >
            {/* Pulsing divine aura inside medallion for smooth 120 FPS */}
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-amber-400/20 blur-sm pointer-events-none transform-gpu"
            />
            {/* Perfectly centered sacred Om symbol */}
            <div className="relative z-10 flex items-center justify-center w-full h-full select-none pointer-events-none">
              <span className="font-om font-bold text-[46px] sm:text-[54px] leading-none text-amber-100 drop-shadow-[0_0_18px_rgba(251,191,36,0.95)] translate-y-[11px] sm:translate-y-[13px] translate-x-[1px]">
                ॐ
              </span>
            </div>
          </motion.div>

          {/* Lotus plinth — seats the ॐ instead of leaving it floating */}
          <LotusBase className="relative w-[145px] sm:w-[170px] h-auto -mt-1 drop-shadow-[0_0_18px_rgba(245,158,11,0.35)] transform-gpu" />
        </div>

        {/* Lit diyas flanking the mantra with a high-contrast dark badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-2.5 sm:gap-3 mb-2 sm:mb-3 transform-gpu"
        >
          <Diya className="w-8 h-7 sm:w-10 sm:h-9 drop-shadow-[0_0_16px_rgba(251,191,36,0.7)] transform-gpu shrink-0" />
          <div className="px-3.5 py-1 rounded-full bg-black/85 border border-amber-400/50 shadow-[0_2px_12px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <p className="font-malayalam text-[11px] sm:text-xs font-bold text-amber-100 tracking-normal drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              ॥ ഓം നമഃ ശിവായ ॥
            </p>
          </div>
          <Diya className="w-8 h-7 sm:w-10 sm:h-9 drop-shadow-[0_0_16px_rgba(251,191,36,0.7)] transform-gpu shrink-0" />
        </motion.div>

        {/* Brand Title: Crisp, bold, high-contrast gold */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-0.5 mb-2 sm:mb-3 transform-gpu flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-2.5">
            <span className="h-[1.5px] w-6 sm:w-8 bg-gradient-to-r from-transparent to-amber-300" />
            <h1 className="text-xl sm:text-2xl font-malayalam font-extrabold text-amber-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              ഇ-ഭാണ്ഡാരം
            </h1>
            <span className="h-[1.5px] w-6 sm:w-8 bg-gradient-to-l from-transparent to-amber-300" />
          </div>
          <p className="font-malayalam text-[11px] sm:text-xs font-semibold text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            ഡിജിറ്റൽ ഭാണ്ഡാര സമർപ്പണം
          </p>
        </motion.div>

        {/* Temple Plaque — dark polished brass panel with crisp golden text */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative px-4 py-3 sm:px-5 sm:py-3.5 max-w-[340px] w-full
            rounded-2xl
            bg-gradient-to-b from-stone-900/95 via-stone-950/95 to-black/98
            border border-amber-400/50
            shadow-[inset_0_1px_0_rgba(255,240,200,0.3),0_10px_30px_rgba(0,0,0,0.85)] transform-gpu"
        >
          {/* Etched inner rule */}
          <span className="pointer-events-none absolute inset-1.5 rounded-xl border border-amber-300/20" />

          <h2 className="relative font-malayalam text-xs sm:text-sm font-bold text-amber-100 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            &ldquo;നിങ്ങളുടെ സമർപ്പണം, ഭഗവാന്റെ അനുഗ്രഹം&rdquo;
          </h2>

          <div className="relative mt-2 flex justify-center">
            <motion.span
              animate={{ opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 font-malayalam text-[11px] font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] transform-gpu"
            >
              തൊഴുതു സമർപ്പിക്കുക
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Auto-advance progress bar & Footer (Always firmly anchored at bottom) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className="w-full z-20 flex flex-col items-center gap-1.5 sm:gap-2 pb-1 shrink-0 transform-gpu"
      >
        <div className="w-full max-w-[190px] h-[3px] rounded-full bg-amber-400/15 overflow-hidden relative">
          <motion.div
            className="w-full h-full rounded-full bg-gradient-to-r from-amber-600/70 via-amber-300 to-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.6)] transform-gpu will-change-transform"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{ transformOrigin: 'left center' }}
            transition={{ duration: FIRST_SCREEN_DURATION / 1000, ease: 'linear' }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.35 }}
          className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-black/50 border border-amber-400/25 shadow-sm transform-gpu"
        >
          <span className="font-malayalam text-[11px] text-amber-200 font-semibold tracking-wide">ഭാണ്ഡാരം</span>
          <span className="text-amber-400/60 font-bold">&middot;</span>
          <span className="text-[10px] tracking-wider text-amber-100/90 font-medium">by Programers</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
