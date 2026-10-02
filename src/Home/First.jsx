import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Diya from '../components/Diya';
import LotusBase from '../components/LotusBase';
import Prabhavali from '../components/Prabhavali';
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

export default function First({ templeName = "ശ്രീ മഹാദേവ ക്ഷേത്രം", onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, FIRST_SCREEN_DURATION);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleDevotionalTap = () => {
    playTempleBell();
    if (onComplete) onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={handleDevotionalTap}
      className="relative w-full h-full flex flex-col justify-between items-center p-5 sm:p-7 text-center cursor-pointer select-none"
    >
      {/* Temple Badge, crowned by a kalasham */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="w-full flex flex-col items-center z-10 pt-1 shrink-0"
      >
        <Kalasham className="w-5 h-5 mb-1 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
        <div className="px-5 py-1.5 rounded-b-2xl rounded-t-md bg-gradient-to-b from-amber-500/20 via-black/60 to-transparent border border-amber-400/30 border-t-0 backdrop-blur-md">
          <p className="font-malayalam text-xs sm:text-[13px] tracking-wide font-semibold text-amber-200">
            {templeName}
          </p>
        </div>
      </motion.div>

      {/* Center Sacred Hero: ॐ on a lotus, lit by diyas */}
      <div className="flex flex-col items-center justify-center my-auto z-10 py-2 w-full">
        <div className="relative flex flex-col items-center mb-4">
          {/* Prabhavali + Radiant Sanctum Halo */}
          <Prabhavali className="absolute w-[228px] h-[228px] sm:w-[252px] sm:h-[252px] opacity-70 drop-shadow-[0_0_26px_rgba(245,158,11,0.28)]" />
          <motion.div
            animate={{ scale: [1, 1.22, 1], opacity: [0.32, 0.68, 0.32] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-amber-500/35 via-orange-500/28 to-yellow-300/38 blur-2xl pointer-events-none"
          />

          {/* Golden Medallion */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.1 }}
            className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-amber-400/30 via-amber-600/20 to-black/75 border-2 border-amber-400/70 flex items-center justify-center shadow-[0_0_45px_rgba(245,158,11,0.5)] backdrop-blur-md"
          >
            <motion.svg
              viewBox="0 0 100 100"
              className="w-24 h-24 sm:w-28 sm:h-28 select-none"
              animate={{
                filter: [
                  'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))',
                  'drop-shadow(0 0 22px rgba(245, 158, 11, 1))',
                  'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))',
                ],
              }}
              transition={{ duration: 2.6, repeat: Infinity }}
            >
              <text
                x="50"
                y="59"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-om font-bold text-[56px] fill-amber-200"
              >
                ॐ
              </text>
            </motion.svg>
          </motion.div>

          {/* Lotus plinth — seats the ॐ instead of leaving it floating */}
          <LotusBase className="relative w-[168px] sm:w-[190px] h-auto -mt-1 drop-shadow-[0_0_18px_rgba(245,158,11,0.35)]" />
        </div>

        {/* Lit diyas flanking the mantra */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-center gap-3 sm:gap-4 mb-3.5"
        >
          <Diya className="w-10 h-9 sm:w-12 sm:h-11 drop-shadow-[0_0_18px_rgba(251,191,36,0.65)]" />
          <p className="font-malayalam text-[11px] sm:text-xs tracking-[0.2em] font-semibold text-amber-300/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            ॥ ഓം നമഃ ശിവായ ॥
          </p>
          <Diya className="w-10 h-9 sm:w-12 sm:h-11 drop-shadow-[0_0_18px_rgba(251,191,36,0.65)]" />
        </motion.div>

        {/* Brand Title */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="space-y-1.5 mb-4"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/80" />
            <h1 className="text-xl sm:text-2xl font-malayalam font-bold tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              ഇ-ഭാണ്ഡാരം
            </h1>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/80" />
          </div>
          <p className="font-malayalam text-xs sm:text-[13px] tracking-wide text-amber-200/90 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            ഡിജിറ്റൽ ഭാണ്ഡാര സമർപ്പണം
          </p>
        </motion.div>

        {/* Temple Plaque — an arched brass panel, not a glass card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="relative px-6 pt-5 pb-4 max-w-sm w-full
            rounded-t-[32px] rounded-b-lg
            bg-gradient-to-b from-amber-500/22 via-amber-900/25 to-black/75
            border border-amber-400/40
            shadow-[inset_0_1px_0_rgba(255,240,200,0.22),0_10px_36px_rgba(0,0,0,0.62)]"
        >
          {/* Etched inner rule */}
          <span className="pointer-events-none absolute inset-1.5 rounded-t-[26px] rounded-b-md border border-amber-300/12" />

          <h2 className="relative font-malayalam text-[13px] sm:text-[15px] font-semibold text-amber-100 tracking-wide leading-relaxed drop-shadow-sm">
            &ldquo;നിങ്ങളുടെ സമർപ്പണം, ഭഗവാന്റെ അനുഗ്രഹം&rdquo;
          </h2>

          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mt-2 inline-block font-malayalam text-[11px] text-amber-300/90"
          >
            തൊഴുതു സമർപ്പിക്കുക
          </motion.p>
        </motion.div>
      </div>

      {/* Auto-advance progress bar & Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="w-full z-10 flex flex-col items-center gap-2.5 pb-1 shrink-0"
      >
        <div className="w-full max-w-[200px] h-[3px] rounded-full bg-amber-400/12 overflow-hidden">
          <motion.div
            className="relative h-full rounded-full bg-gradient-to-r from-amber-600/70 via-amber-300 to-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: FIRST_SCREEN_DURATION / 1000, ease: 'linear' }}
          >
            {/* Glowing bead riding the leading edge */}
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-50 shadow-[0_0_8px_rgba(254,249,231,0.95)]" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/45 border border-amber-400/25 shadow-sm"
        >
          <span className="font-malayalam text-xs text-amber-200 font-semibold tracking-wide">ഭാണ്ഡാരം</span>
          <span className="text-amber-400/60 font-bold">&middot;</span>
          <span className="text-[11px] tracking-wider text-amber-100/90 font-medium">by Programers</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
