import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Diya from '../components/Diya';
import { playTempleBell } from '../utils/audio';

export const FIRST_SCREEN_DURATION = 3500;

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
      {/* Top Header: Temple Badge */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="w-full flex items-center justify-center z-10 pt-1 shrink-0"
      >
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-black/60 to-amber-900/25 px-4 py-1.5 rounded-full border border-amber-400/35 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          <span className="font-malayalam text-xs sm:text-[13px] tracking-wide font-semibold text-amber-200">
            {templeName}
          </span>
        </div>
      </motion.div>

      {/* Center Sacred Hero: Glowing ॐ, Golden Prabhavali & Divine Mantra */}
      <div className="flex flex-col items-center justify-center my-auto z-10 py-2 w-full">
        {/* Sacred Prabhavali & Glowing ॐ Container */}
        <div className="relative flex items-center justify-center mb-5">
          {/* Radiant Sanctum Halo */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.35, 0.75, 0.35],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-amber-500/35 via-orange-500/30 to-yellow-300/40 blur-2xl pointer-events-none"
          />

          {/* Rotating Sacred Prabhavali Rays */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute w-44 h-44 rounded-full border border-dashed border-amber-300/30 pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute w-40 h-40 rounded-full border border-dotted border-amber-400/25 pointer-events-none"
          />

          {/* Golden Medallion */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 18,
              delay: 0.1,
            }}
            className="relative w-36 h-36 rounded-full bg-gradient-to-b from-amber-400/30 via-amber-600/20 to-black/75 border-2 border-amber-400/70 flex items-center justify-center shadow-[0_0_45px_rgba(245,158,11,0.5)] backdrop-blur-md"
          >
            {/* Sacred ॐ Symbol - Centered SVG with divine glow */}
            <motion.svg
              viewBox="0 0 100 100"
              className="w-28 h-28 select-none"
              animate={{
                filter: [
                  "drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))",
                  "drop-shadow(0 0 22px rgba(245, 158, 11, 1))",
                  "drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))",
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
        </div>

        {/* Sacred Mantra Chant */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-malayalam text-xs tracking-[0.2em] font-semibold text-amber-300/90 mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
        >
          ॥ ഓം നമഃ ശിവായ ॥
        </motion.p>

        {/* Brand Title */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="space-y-1.5 mb-5"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/80" />
            <h1 className="text-2xl sm:text-3xl font-malayalam font-bold tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              ഇ-ഭാണ്ഡാരം
            </h1>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/80" />
          </div>
          <p className="font-malayalam text-xs sm:text-[13px] tracking-wide text-amber-200 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            ഡിജിറ്റൽ ഭാണ്ഡാര സമർപ്പണം
          </p>
        </motion.div>

        {/* Devotional Card with Radiant Diya lamps */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="px-6 py-4.5 rounded-2xl bg-black/50 border border-amber-400/40 backdrop-blur-md max-w-sm w-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative"
        >
          {/* Lit diyas flanking the offering */}
          <Diya className="absolute -top-6 -left-1 w-11 h-10 sm:w-12 sm:h-11 drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]" />
          <Diya className="absolute -top-6 -right-1 w-11 h-10 sm:w-12 sm:h-11 drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]" />

          <h2 className="font-malayalam text-sm sm:text-base font-semibold text-amber-100 tracking-wide mt-0.5 leading-relaxed drop-shadow-sm">
            “നിങ്ങളുടെ സമർപ്പണം, ഭഗവാന്റെ അനുഗ്രഹം”
          </h2>
          <p className="font-malayalam text-[11px] text-amber-300/70 mt-1">
            തൊഴുതു സമർപ്പിക്കുക
          </p>
        </motion.div>
      </div>

      {/* Auto-advance progress bar & Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="w-full z-10 flex flex-col items-center gap-2.5 pb-1 shrink-0"
      >
        <div className="w-full max-w-[220px] h-[3px] rounded-full bg-amber-400/15 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.7)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: FIRST_SCREEN_DURATION / 1000, ease: "linear" }}
          />
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
