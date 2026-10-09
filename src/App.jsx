import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import First from './Home/First';
import Second from './Home/Second';
import Third from './Home/Third';
import Mandala from './components/Mandala';
import Sparkle from './components/Sparkle';
import { preloadAssets } from './utils/preload';
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

  useEffect(() => {
    preloadAssets();
  }, []);

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

      {/* Main Devotional Screen Container (Optimized for both mobile and desktop preview) */}
      <div className="relative w-full sm:max-w-[400px] mx-auto h-[100dvh] max-h-[100dvh] sm:h-[min(844px,96vh)] sm:max-h-[860px] flex flex-col justify-between items-center overflow-hidden rounded-none sm:rounded-[32px] border-0 sm:border sm:border-amber-500/30 shadow-none sm:shadow-[0_15px_60px_rgba(0,0,0,0.85),0_0_50px_rgba(245,158,11,0.2)] bg-stone-950 z-10">
        
        {/* 🌟 1. Persistent Background Image & Deep Sacred Overlay */}
        <div
          className="absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url('/bg.jpg')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-stone-950/90" />
        </div>

        {/* 🌟 2. Persistent Sacred Rotating Mandala Circle */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center divine-aura z-0">
          <Mandala className="w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] opacity-30 drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]" />
        </div>

        {/* 🌟 3. Persistent Floating Sparkles (CSS Compositor Accelerated) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-amber-300 select-none pointer-events-none sparkle-particle transform-gpu"
              style={{
                top: `${14 + i * 12}%`,
                left: `${10 + ((i * 15) % 80)}%`,
                '--dur': `${3.2 + i * 0.7}s`,
                '--del': `${i * 0.4}s`,
                '--sx': `${i % 2 === 0 ? 12 : -12}px`,
              }}
            >
              <Sparkle className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          ))}
        </div>

        {/* Screen Content Transition Layer */}
        <div className="relative w-full h-full z-10 flex flex-col">
          <AnimatePresence mode="wait">
            <Current
              key={STEPS[step].key}
              templeName="ചിന്മയ ശ്രീ ഭുവനേശ്വരി നവഗ്രഹ ക്ഷേത്രം"
              templeNameEn="Chinmaya Sri Bhuvaneswari Navagraha Temple"
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
