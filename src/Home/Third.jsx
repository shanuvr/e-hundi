import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function Third({ onBack, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative w-full max-w-md mx-auto min-h-[92vh] flex flex-col justify-between items-center p-6 text-center rounded-3xl bg-gradient-to-b from-stone-900 via-amber-950/40 to-stone-950 border border-amber-500/20 shadow-2xl backdrop-blur-xl"
    >
      <div className="w-full flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="p-2 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs uppercase font-cinzel text-amber-300">Step 3: Payment & Darshan</span>
        <div className="w-9" />
      </div>

      <div className="my-auto">
        <h2 className="text-2xl font-cinzel text-amber-200">UPI Payment & Darshan Video</h2>
        <p className="text-sm text-stone-400 mt-2">Ready to be crafted with UPI intents and celebration.</p>
      </div>

      <button
        onClick={onReset}
        className="w-full py-3.5 rounded-2xl bg-amber-500 text-stone-950 font-bold font-cinzel cursor-pointer"
      >
        Make Another Offering
      </button>
    </motion.div>
  );
}
