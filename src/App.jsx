import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import First from './Home/First';
import Second from './Home/Second';
import './App.css';

const STEPS = [
  { key: 'welcome', component: First },
  { key: 'hundi', component: Second },
];

function App() {
  const [step, setStep] = useState(0);

  const goNext = useCallback(() => setStep((s) => s + 1), []);
  const goBack = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const Current = STEPS[step].component;

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 relative selection:bg-amber-500 selection:text-stone-950 overflow-x-hidden bg-white">
      {/* Background ambient lighting on white backdrop (desktop only) */}
      <div className="hidden sm:block fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden sm:block fixed bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full h-full min-h-screen sm:min-h-0 flex justify-center items-center z-10">
        <AnimatePresence mode="wait">
          <Current
            key={STEPS[step].key}
            templeName="Shri Siddhivinayak Temple"
            onComplete={goNext}
            onNext={goNext}
            onBack={goBack}
          />
        </AnimatePresence>
      </div>
    </main>
  );
}

export default App;
