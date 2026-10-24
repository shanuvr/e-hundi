import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Mandala from './components/Mandala';
import Sparkle from './components/Sparkle';

export default function NotFound() {
  return (
    <main className="min-h-dvh w-full flex flex-col items-center justify-center p-4 sm:p-6 relative selection:bg-amber-500 selection:text-stone-950 overflow-hidden bg-stone-950 text-stone-100">
      {/* Background ambient lighting */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Persistent Sacred Rotating Mandala */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center divine-aura z-0">
        <Mandala className="w-[480px] h-[480px] sm:w-[620px] sm:h-[620px] opacity-15 drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]" />
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-amber-300/80 select-none pointer-events-none sparkle-particle transform-gpu"
            style={{
              top: `${12 + i * 14}%`,
              left: `${8 + ((i * 18) % 84)}%`,
              '--dur': `${3.5 + i * 0.8}s`,
              '--del': `${i * 0.5}s`,
              '--sx': `${i % 2 === 0 ? 12 : -12}px`,
            }}
          >
            <Sparkle className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        ))}
      </div>

      {/* 404 Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md sm:max-w-lg flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-amber-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.15)] backdrop-blur-md"
      >
        {/* Meditation Cushion Illustration */}
        <div className="relative w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden mb-6 border border-amber-500/20 shadow-inner group">
          <img
            src="/not-found.jpg"
            alt="Empty meditation cushion (zafu) on wooden floor with soft light and floating petals"
            className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Status & Title */}
        <div className="space-y-2 mb-4">
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wide text-amber-200">
            404: Page Not Found
          </h1>
        </div>

        {/* Zen enlightenment text */}
        <p className="font-philosopher text-stone-300 text-base sm:text-lg leading-relaxed mb-7 max-w-sm">
          This page has achieved enlightenment and is no longer here. Perhaps it’s time to let go of attachment to this URL.
        </p>

        {/* Return to Home Action Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold text-sm sm:text-base tracking-wide shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Home className="w-4 h-4 stroke-[2.5]" />
          <span>Return to Home</span>
        </Link>
      </motion.div>
    </main>
  );
}
