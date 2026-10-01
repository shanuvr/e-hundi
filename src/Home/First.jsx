import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Diya from '../components/Diya';
import Mandala from '../components/Mandala';
import Sparkle from '../components/Sparkle';

export const FIRST_SCREEN_DURATION = 3000;

export default function First({ templeName = "Shri Siddhivinayak Temple", onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, FIRST_SCREEN_DURATION);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full sm:max-w-md mx-auto min-h-screen sm:min-h-[90vh] flex flex-col justify-between items-center p-6 sm:p-8 text-center overflow-hidden rounded-none sm:rounded-3xl border-0 sm:border sm:border-amber-500/25 shadow-none sm:shadow-[0_0_60px_rgba(245,158,11,0.2)] backdrop-blur-xl"
    >
      {/* Background Image with Balanced Devotional Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/bg.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-stone-950/65" />
      </div>

      {/* Background Sacred Geometric Mandala */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center divine-aura">
        <Mandala className="w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] opacity-80 drop-shadow-[0_0_40px_rgba(245,158,11,0.25)]" />
      </div>

      {/* Floating Sparkle Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, i % 2 === 0 ? 12 : -12, 0],
            opacity: [0.2, 0.9, 0.2],
            scale: [0.7, 1.1, 0.7],
          }}
          transition={{
            duration: 3 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
          className="absolute text-amber-300 pointer-events-none select-none"
          style={{
            top: `${14 + (i * 12)}%`,
            left: `${10 + ((i * 15) % 80)}%`,
          }}
        >
          <Sparkle className="w-3 h-3 sm:w-4 sm:h-4" />
        </motion.div>
      ))}

      {/* Top Header: Temple Badge */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="w-full flex items-center justify-center z-10 pt-1"
      >
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/15 to-amber-900/20 px-4 py-1.5 rounded-full border border-amber-400/30 backdrop-blur-md shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs tracking-wider uppercase font-semibold text-amber-200">
            {templeName}
          </span>
        </div>
      </motion.div>

      {/* Center Sacred Hero: Glowing ॐ & Devotional Message */}
      <div className="flex flex-col items-center justify-center my-auto z-10 py-6 w-full">
        {/* Pulsing Sacred Om Container */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Radiant Halo rings */}
          <motion.div
            animate={{
              scale: [1, 1.28, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-amber-500/35 via-orange-500/25 to-yellow-300/35 blur-2xl pointer-events-none"
          />

          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 18,
              delay: 0.1,
            }}
            className="relative w-36 h-36 rounded-full bg-gradient-to-b from-amber-400/25 via-amber-600/20 to-black/60 border-2 border-amber-400/60 flex items-center justify-center shadow-[0_0_45px_rgba(245,158,11,0.4)] backdrop-blur-md"
          >
            {/* Sacred ॐ Symbol */}
            <motion.span
              animate={{
                textShadow: [
                  "0 0 15px rgba(251, 191, 36, 0.7)",
                  "0 0 35px rgba(245, 158, 11, 1)",
                  "0 0 15px rgba(251, 191, 36, 0.7)",
                ],
              }}
              transition={{ duration: 2.6, repeat: Infinity }}
              className="text-7xl font-om font-bold text-amber-200 select-none"
            >
              ॐ
            </motion.span>
          </motion.div>
        </div>

        {/* Brand Title */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="space-y-1.5 mb-6"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-400/80" />
            <h1 className="text-3xl sm:text-4xl font-cinzel font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              E-HUNDI
            </h1>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-400/80" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200 font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            Digital Temple Offering
          </p>
        </motion.div>

        {/* Clean Devotional Quote Card with Diya lamps */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="px-6 py-5 rounded-2xl bg-black/40 border border-amber-400/40 backdrop-blur-md max-w-sm w-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative"
        >
          {/* Lit diyas flanking the offering */}
          <Diya className="absolute -top-6 -left-1 w-11 h-10 sm:w-12 sm:h-11 drop-shadow-[0_0_14px_rgba(251,191,36,0.45)]" />
          <Diya className="absolute -top-6 -right-1 w-11 h-10 sm:w-12 sm:h-11 drop-shadow-[0_0_14px_rgba(251,191,36,0.45)]" />

          <h2 className="text-lg font-philosopher text-amber-100 italic tracking-wide mt-1">
            “Your Offering, A Blessing.”
          </h2>
        </motion.div>
      </div>

      {/* Auto-advance progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="w-full z-10 flex flex-col items-center gap-3 pb-1"
      >
        <div className="w-full max-w-[220px] h-[3px] rounded-full bg-amber-400/15 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.7)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: FIRST_SCREEN_DURATION / 1000, ease: "linear" }}
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.35] }}
          transition={{ delay: 0.7, duration: 2.1, times: [0, 0.4, 1] }}
          className="text-xs text-amber-200/75 font-medium"
        >
          <span className="font-malayalam text-sm tracking-wide">ഭാണ്ഡാരം</span>
          <span className="mx-1.5 text-amber-300/40">&middot;</span>
          <span className="tracking-[0.2em] text-amber-200/60">by Programers</span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
