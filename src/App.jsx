import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import First from './Home/First';
import Second from './Home/Second';
import Third from './Home/Third';
import Mandala from './components/Mandala';
import Sparkle from './components/Sparkle';
import './App.css';

const STEPS = [
  { key: 'welcome', component: First },
  { key: 'hundi', component: Second },
  { key: 'darshan', component: Third },
];

function App() {
  const [step, setStep] = useState(0);
  // The offering total is owned here so the Hundi screen and the Darshan screen
  // read from a single source of truth, and a reset clears it in one place.
  const [amount, setAmount] = useState(0);

  const goNext = useCallback(
    () => setStep((s) => Math.min(STEPS.length - 1, s + 1)),
    []
  );
  const goBack = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
  const goReset = useCallback(() => {
    setAmount(0);
    setStep(0);
  }, []);

  const Current = STEPS[step].component;

  return (
    <main className="h-[100dvh] max-h-[100dvh] sm:h-screen sm:min-h-screen w-full flex flex-col items-center justify-center p-0 sm:p-2 md:p-3 relative selection:bg-amber-500 selection:text-stone-950 overflow-hidden bg-stone-950 sm:bg-white">
      {/* Background ambient lighting on white backdrop (desktop only) */}
      <div className="hidden sm:block fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block fixed bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Devotional Screen Container */}
      <div className="relative w-full sm:max-w-[390px] mx-auto h-[100dvh] max-h-[100dvh] sm:h-[750px] sm:max-h-[96vh] flex flex-col justify-between items-center overflow-hidden rounded-none sm:rounded-3xl border-0 sm:border sm:border-amber-500/25 shadow-none sm:shadow-[0_0_60px_rgba(245,158,11,0.2)] bg-stone-950 z-10">
        
        {/* 🌟 1. Persistent Background Image & Overlay (Never unmounts) */}
        <div
          className="absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url('/bg.jpg')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-stone-950/75" />
        </div>

        {/* 🌟 2. Persistent Sacred Rotating Mandala Circle (Always stays in background) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center divine-aura z-0">
          <Mandala className="w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] opacity-75 drop-shadow-[0_0_40px_rgba(245,158,11,0.25)]" />
        </div>

        {/* 🌟 3. Persistent Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
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
                ease: 'easeInOut',
              }}
              className="absolute text-amber-300 select-none pointer-events-none"
              style={{
                top: `${14 + (i * 12)}%`,
                left: `${10 + ((i * 15) % 80)}%`,
              }}
            >
              <Sparkle className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.div>
          ))}
        </div>

        {/* Screen Content Transition Layer */}
        <div className="relative w-full h-full z-10 flex flex-col">
          <AnimatePresence mode="wait">
            <Current
              key={STEPS[step].key}
              templeName="Shri Siddhivinayak Temple"
              amount={amount}
              onAmountChange={setAmount}
              onComplete={goNext}
              onNext={goNext}
              onBack={goBack}
              onReset={goReset}
            />
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

export default App;
