import { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { ArrowLeft, Bell } from 'lucide-react';
import Mandala from '../components/Mandala';
import Money from '../components/Money';
import { moneyKind, moneySrc } from '../data/money';
import { playTempleBell } from '../utils/audio';

const COINS = [1, 2, 5, 10, 20];
const NOTES = [50, 100, 200, 500];

let flightId = 0;

function Label({ children }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-2.5">
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/50" />
      <span className="text-[9px] uppercase tracking-[0.3em] text-amber-200/55 font-semibold">
        {children}
      </span>
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/50" />
    </div>
  );
}

export default function Second({ onBack, onNext }) {
  const bandaramRef = useRef(null);
  const lastGlowTimer = useRef(null);
  const bandAnim = useAnimationControls();
  const [flights, setFlights] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [total, setTotal] = useState(0);
  const [rung, setRung] = useState(0);
  const [slotGlow, setSlotGlow] = useState(false);
  const [placed, setPlaced] = useState([]);

  const ringBell = useCallback(() => {
    playTempleBell();
    setRung((n) => n + 1);
  }, []);

  useEffect(() => () => clearTimeout(lastGlowTimer.current), []);

  const dropRipple = useCallback((id) => {
    setRipples((r) => r.filter((x) => x.id !== id));
  }, []);

  const placeOffering = useCallback(
    (value, event) => {
      const source = event.currentTarget.getBoundingClientRect();
      const bandaram = bandaramRef.current?.getBoundingClientRect();
      if (!bandaram) return;

      // Coins drop through the slot on the lid; notes are too wide for a slot,
      // so they settle on the front of the box instead.
      const isCoin = moneyKind(value) === 'coin';
      const target = {
        x: bandaram.left + bandaram.width / 2,
        y: isCoin ? bandaram.top + bandaram.height * 0.3 : bandaram.top + bandaram.height * 0.78,
      };

      const id = ++flightId;
      setFlights((f) => [
        ...f,
        { id, value, isCoin, from: source, target, kind: isCoin ? 'coin' : 'note' },
      ]);
      setTotal((t) => t + value);
      if (navigator.vibrate) navigator.vibrate(12);

      setSlotGlow(true);
      const glowTimer = setTimeout(() => setSlotGlow(false), 700);

      if (isCoin) {
        setPlaced((list) => {
          const n = list.length;
          return [
            ...list.slice(-6),
            { id, src: moneySrc(value), y: -6 - (n % 3) * 4, r: (n % 5) * 14 - 28 },
          ];
        });
      }
      lastGlowTimer.current = glowTimer;
      bandAnim.start({ scale: [1, 1.045, 1], transition: { duration: 0.42, ease: 'easeOut' } });
    },
    [bandAnim],
  );

  const endFlight = useCallback(
    (id) => {
      const flight = flights.find((f) => f.id === id);
      setFlights((f) => f.filter((x) => x.id !== id));
      if (flight) {
        setRipples((r) => [...r, { id: `${id}-r`, x: flight.target.x, y: flight.target.y }]);
      }
    },
    [flights],
  );

  const overlay = createPortal(
    <div className="fixed inset-0 pointer-events-none z-20">
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full border border-amber-200/70"
            style={{ left: r.x, top: r.y, width: 24, height: 24, marginLeft: -12, marginTop: -12 }}
            initial={{ scale: 0.25, opacity: 0.9 }}
            animate={{ scale: 2.6, opacity: 0 }}
            transition={{ duration: 0.62, ease: 'easeOut' }}
            onAnimationComplete={() => dropRipple(r.id)}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {flights.map((f) => {
          const dx = f.target.x - (f.from.left + f.from.width / 2);
          const dy = f.target.y - (f.from.top + f.from.height / 2);
          const lift = Math.min(90, Math.abs(dy) * 0.35 + 40);

          return (
            <motion.div
              key={f.id}
              className="absolute"
              style={{ left: f.from.left, top: f.from.top, width: f.from.width }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
              animate={{
                x: { to: dx, transition: { duration: 0.92, ease: [0.32, 0, 0.4, 1] } },
                y: {
                  to: [0, -lift, dy],
                  transition: { duration: 0.92, times: [0, 0.5, 1], ease: [0.4, 0, 0.55, 1] },
                },
                scale: {
                  to: f.isCoin ? [1, 1.12, 0.06] : [1, 1.05, 0.22],
                  transition: { duration: 0.92, times: [0, 0.34, 1] },
                },
                rotate: {
                  to: f.isCoin ? [0, 200, 620] : [0, -3, 5],
                  transition: { duration: 0.92, ease: 'easeInOut' },
                },
                opacity: {
                  to: f.isCoin ? [1, 1, 0] : [1, 0.9, 0],
                  transition: { duration: 0.92, times: f.isCoin ? [0, 0.74, 1] : [0, 0.34, 0.6] },
                },
              }}
              onAnimationComplete={() => endFlight(f.id)}
            >
              <Money value={f.value} className="w-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)]" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative w-full sm:max-w-md mx-auto min-h-[100dvh] sm:min-h-[92dvh] flex flex-col items-center p-4 sm:p-6 overflow-hidden rounded-none sm:rounded-3xl border-0 sm:border sm:border-amber-500/25"
    >
      <div
        className="absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/bg.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-stone-950/80" />
      </div>

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center divine-aura">
        <Mandala className="w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] opacity-60" />
      </div>

      {/* Header */}
      <div className="w-full flex items-center justify-between z-10 shrink-0">
        <button
          onClick={onBack}
          aria-label="Back"
          className="p-2.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/30 backdrop-blur-md cursor-pointer transition-colors hover:bg-amber-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-200 font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
          Digital Hundi
        </span>
        <motion.button
          onClick={ringBell}
          whileTap={{ scale: 0.85 }}
          aria-label="Ring temple bell"
          className="relative p-2.5 rounded-full bg-gradient-to-tr from-amber-500/20 to-yellow-400/10 border border-amber-400/40 text-amber-300 hover:text-amber-100 hover:border-amber-300 transition-colors shadow-md cursor-pointer"
        >
          <motion.span
            className="block"
            animate={rung ? { rotate: [-22, 22, -16, 16, -7, 7, 0] } : { rotate: 0 }}
            transition={{ duration: 0.9 }}
          >
            <Bell className="w-4 h-4" />
          </motion.span>
          {rung > 0 && (
            <motion.span
              key={rung}
              initial={{ scale: 0.6, opacity: 0.9 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-amber-300 pointer-events-none"
            />
          )}
        </motion.button>
      </div>

      {/* Slogan */}
      <div className="relative z-10 w-full flex flex-col items-center pt-2">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-malayalam text-amber-100 text-center text-[15px] sm:text-base leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
        >
          ദൈവാരാധനയുടെ സുവിശേഷം
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-[9px] uppercase tracking-[0.28em] text-amber-200/70 mt-1"
        >
          The Glory of Worship
        </motion.p>
      </div>

      {/* Hundi — a transparent cutout, so it gets a glow and a ground shadow
          rather than a clipping frame and an overlay gradient.
          The outer div owns the entrance; the inner one owns the impact pulse,
          because `animate={controls}` replaces the entrance entirely and would
          otherwise strand opacity at 0 until the first coin is tapped. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className="relative z-30 mt-3 w-52 sm:w-72"
      >
        <motion.div ref={bandaramRef} animate={bandAnim} className="relative">
          {/* Slot: lights up on impact so the eye follows the coin into the box */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '26%' }}>
            <motion.div
              className="h-1.5 w-16 rounded-full bg-amber-200"
              animate={slotGlow ? { opacity: [0, 1, 0.15], scaleX: [0.7, 1.15, 1] } : { opacity: 0.18 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/70 blur-md"
              animate={slotGlow ? { width: 130, height: 130, opacity: [0.9, 0] } : { width: 0, height: 0, opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            />
          </div>

          {/* Offering already placed in the box */}
          <AnimatePresence>
            {placed.map((p) => (
              <motion.img
                key={p.id}
                src={p.src}
                alt=""
                initial={{ opacity: 0, y: -26, scale: 0.5, rotate: -25 }}
                animate={{ opacity: 0.85, y: p.y, scale: 1, rotate: p.r }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="absolute left-1/2 -translate-x-1/2 w-8 h-8 object-contain pointer-events-none"
              />
            ))}
          </AnimatePresence>

          <div className="absolute inset-x-3 bottom-1 h-5 rounded-[50%] bg-amber-500/30 blur-lg" />
          <img
            src="/hundi.png"
            alt="Temple Hundi donation box"
            className="relative w-full h-auto drop-shadow-[0_8px_22px_rgba(0,0,0,0.8)] brightness-110"
          />

        </motion.div>
      </motion.div>

      {/* Running total */}
      <div className="relative z-10 w-full mt-4 flex items-center justify-center gap-2.5">
        <span className="font-malayalam text-xs text-amber-200/70">ആകെ</span>
        <div className="relative h-7 overflow-hidden min-w-[76px] px-3 flex items-center justify-center rounded-full bg-black/45 border border-amber-400/30 backdrop-blur-md">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={total}
              initial={{ y: 22, opacity: 0, scale: 0.75 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -22, opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center gap-0.5 font-cinzel font-bold text-lg text-amber-50 tabular-nums"
            >
              <span className="text-xs opacity-70">₹</span>
              {total}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Coins */}
      <div className="relative z-10 w-full mt-5">
        <Label>Coins</Label>
        <div className="grid grid-cols-5 gap-2">
          {COINS.map((value, i) => (
            <motion.button
              key={value}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.4, type: 'spring', stiffness: 260, damping: 18 }}
              whileTap={{ scale: 0.85 }}
              onClick={(e) => placeOffering(value, e)}
              aria-label={`Offer ${value} rupee coin`}
              className="mx-auto w-full max-w-[50px] sm:max-w-[60px] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-300/60 rounded-full"
            >
              <Money value={value} className="w-full h-auto drop-shadow-[0_3px_8px_rgba(0,0,0,0.55)]" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="relative z-10 w-full mt-3">
        <Label>Notes</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {NOTES.map((value, i) => (
            <motion.button
              key={value}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.07, duration: 0.4 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => placeOffering(value, e)}
              aria-label={`Offer ${value} rupee note`}
              className="mx-auto w-full max-w-[124px] sm:max-w-[158px] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-300/60 rounded-md"
            >
              <Money value={value} className="w-full h-auto drop-shadow-[0_3px_8px_rgba(0,0,0,0.55)]" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Offer button */}
      <div className="relative z-10 w-full mt-auto pt-4 pb-1">
        <motion.button
          onClick={onNext}
          disabled={total === 0}
          whileTap={total === 0 ? undefined : { scale: 0.97 }}
          className={`w-full py-4 px-6 rounded-2xl font-malayalam text-lg border transition-all duration-300 ${
            total > 0
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-semibold shadow-[0_8px_25px_rgba(217,119,6,0.35)] border-yellow-200/50 cursor-pointer'
              : 'bg-amber-400/15 text-amber-200/45 border-amber-200/10 cursor-not-allowed'
          }`}
        >
          <span className={total > 0 ? '' : 'opacity-70'}>സമർപ്പിക്കുക</span>
        </motion.button>
      </div>

      {overlay}
    </motion.div>
  );
}