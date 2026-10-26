import { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { ArrowLeft, Bell, Loader2, Info, X, Phone, MessageCircle, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react';
import Money from '../components/Money';
import Label from '../components/Label';

const UPI_ID = 'programers@icici';
const PAYEE_NAME = 'programers';
import { moneyKind, moneySrc } from '../data/money';
import { playTempleBell, playCoinDrop, playNoteDrop } from '../utils/audio';
import { celebrateOffering } from '../utils/confetti';

const COINS = [1, 2, 5, 10, 20];
const NOTES = [50, 100, 200, 500];

let flightId = 0;

import TempleInfoModal from '../components/TempleInfoModal';

const triggerHaptic = (pattern = 40) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // ignore on unsupported devices
    }
  }
};

export default function Second({
  onBack,
  onNext,
  amount = 0,
  onAmountChange,
  onOpenInfo,
  temple,
  templeName = 'Chinmaya Sri Bhuvaneswari Navagraha Temple'
}) {
  const [showInfo, setShowInfo] = useState(false);
  const bandaramRef = useRef(null);
  const lastGlowTimer = useRef(null);
  const hasLeftTab = useRef(false);
  const bandAnim = useAnimationControls();
  const [flights, setFlights] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [rung, setRung] = useState(0);
  const [slotGlow, setSlotGlow] = useState(false);
  const [placed, setPlaced] = useState([]);
  const [paying, setPaying] = useState(false);

  const ringBell = useCallback(() => {
    playTempleBell();
    triggerHaptic(60);
    setRung((n) => n + 1);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(lastGlowTimer.current);
    },
    []
  );

  const buildUpiUrl = (amt) =>
    `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${Number(amt).toFixed(2)}&cu=INR&tn=${encodeURIComponent('Devotional Offering')}`;

// For testing: bypass payment gateway and take directly as payment received
const BYPASS_PAYMENT_GATEWAY = true;

  const submitOffering = useCallback(async () => {
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return;

    // Testing mode: bypass payment gateway and take directly as payment received
    if (BYPASS_PAYMENT_GATEWAY) {
      celebrateOffering();
      playTempleBell();
      triggerHaptic([25, 30, 25, 30, 80]);
      onNext();
      return;
    }

    // Second tap while "paying" = user confirms they returned
    if (paying) {
      setPaying(false);
      hasLeftTab.current = false;
      celebrateOffering();
      playTempleBell();
      triggerHaptic([25, 30, 25, 30, 80]);
      onNext();
      return;
    }

    setPaying(true);
    hasLeftTab.current = false;
    triggerHaptic([30, 40, 60]);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8004';
    let orderData = null;

    try {
      const res = await fetch(`${apiUrl}/api/create-order/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, temple_id: temple?.id }),
      });
      if (res.ok) {
        orderData = await res.json();
      }
    } catch (err) {
      console.warn('Backend order creation offline or unreachable:', err);
    }

    const keyId = orderData?.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
    const merchantName = orderData?.merchant_name || PAYEE_NAME;
    const orderId = orderData?.order_id;
    const amountInPaise = Math.round(amt * 100);

    const handleSuccess = () => {
      setPaying(false);
      hasLeftTab.current = false;
      celebrateOffering();
      playTempleBell();
      triggerHaptic([25, 30, 25, 30, 80]);
      onNext();
    };

    // If Razorpay SDK is loaded and credentials are provided
    if (typeof window !== 'undefined' && window.Razorpay && keyId && !keyId.startsWith('rzp_test_placeholder')) {
      const options = {
        key: keyId,
        amount: amountInPaise,
        currency: 'INR',
        name: merchantName,
        description: 'Devotional Offering',
        ...(orderId ? { order_id: orderId } : {}),
        prefill: {
          contact: '9876543210',
          email: 'donor@ehundi.org',
          method: 'upi',
        },
        readonly: {
          contact: true,
          email: true,
        },
        method: {
          netbanking: false,
          card: false,
          wallet: false,
          upi: true,
          emi: false,
          paylater: false,
        },
        config: {
          display: {
            sequence: ['upi'],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
        theme: {
          color: '#d97706',
        },
        handler: function () {
          handleSuccess();
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function () {
          setPaying(false);
        });
        rzp.open();
        return;
      } catch (e) {
        console.error('Failed to open Razorpay modal:', e);
      }
    }

    // Direct mobile UPI launch fallback (instant testing before entering keys)
    if (isMobile) {
      window.location.href = buildUpiUrl(amt);
    } else {
      navigator.clipboard?.writeText(UPI_ID).catch(() => { });
      alert(`Pay ₹${amt} to UPI ID: ${UPI_ID} (copied). Add active Razorpay key to .env for full gateway checkout.`);
    }
  }, [amount, paying, onNext]);

  // When donor completes payment in UPI app and returns to the browser tab
  useEffect(() => {
    if (!paying) return;

    const handleVisibilityChange = () => {
      // 1. User switches from browser to UPI app -> document becomes hidden
      if (document.visibilityState === 'hidden') {
        hasLeftTab.current = true;
      }
      // 2. User returns back to this website -> document becomes visible
      else if (document.visibilityState === 'visible' && hasLeftTab.current) {
        hasLeftTab.current = false;
        setPaying(false);
        celebrateOffering();
        playTempleBell();
        triggerHaptic([25, 30, 25, 30, 80]);
        onNext();
      }
    };

    const handleWindowBlur = () => {
      hasLeftTab.current = true;
    };

    const handleWindowFocus = () => {
      if (hasLeftTab.current) {
        hasLeftTab.current = false;
        setPaying(false);
        celebrateOffering();
        playTempleBell();
        triggerHaptic([25, 30, 25, 30, 80]);
        onNext();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [paying, onNext]);

  const dropRipple = useCallback((id) => {
    setRipples((r) => r.filter((x) => x.id !== id));
  }, []);

  const placeOffering = useCallback(
    (value, event) => {
      const source = event.currentTarget.getBoundingClientRect();
      const bandaram = bandaramRef.current?.getBoundingClientRect();
      if (!bandaram) return;

      // Coins drop through the slot on the lid; notes settle on the front of the box.
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
      // Functional update so two quick taps can't clobber each other's amount.
      onAmountChange((t) => t + value);

      // Initial tactile tap vibration
      triggerHaptic(isCoin ? 35 : 45);

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
    [bandAnim, onAmountChange],
  );

  const endFlight = useCallback(
    (id) => {
      const flight = flights.find((f) => f.id === id);
      setFlights((f) => f.filter((x) => x.id !== id));
      if (flight) {
        setRipples((r) => [...r, { id: `${id}-r`, x: flight.target.x, y: flight.target.y }]);

        if (flight.isCoin) {
          // 🪙 Real metallic coin clink into brass Hundi + double tap bounce haptic
          playCoinDrop(flight.value);
          triggerHaptic([25, 35, 50]);
        } else {
          // 💵 Real paper banknote rustle & slide into box + flutter haptic
          playNoteDrop();
          triggerHaptic([40, 30]);
        }
      }
    },
    [flights],
  );

  const overlay = createPortal(
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full border-2 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.8)]"
            style={{ left: r.x, top: r.y, width: 24, height: 24, marginLeft: -12, marginTop: -12 }}
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onAnimationComplete={() => dropRipple(r.id)}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {flights.map((f) => {
          const dx = f.target.x - (f.from.left + f.from.width / 2);
          const dy = f.target.y - (f.from.top + f.from.height / 2);
          const lift = Math.min(110, Math.abs(dy) * 0.4 + 40);

          return (
            <motion.div
              key={f.id}
              className="absolute pointer-events-none"
              style={{ left: f.from.left, top: f.from.top, width: f.from.width }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
              animate={{
                x: dx,
                y: [0, -lift, dy],
                scale: f.isCoin ? [1, 1.25, 1.15, 0.4, 0.08] : [1, 1.12, 1.05, 0.5, 0.18],
                rotate: f.isCoin ? [0, 90, 240, 480] : [0, -4, 4, 0],
                opacity: f.isCoin ? [1, 1, 1, 0.8, 0] : [1, 1, 1, 0.7, 0],
              }}
              transition={{
                duration: 0.88,
                ease: 'easeInOut',
                x: { duration: 0.88, ease: [0.25, 0.1, 0.25, 1] },
                y: { duration: 0.88, times: [0, 0.4, 1], ease: [0.25, 0.1, 0.35, 1] },
                scale: { duration: 0.88, times: [0, 0.25, 0.75, 0.92, 1] },
                rotate: { duration: 0.88, times: [0, 0.3, 0.75, 1], ease: 'easeInOut' },
                opacity: { duration: 0.88, times: [0, 0.5, 0.8, 0.94, 1] },
              }}
              onAnimationComplete={() => endFlight(f.id)}
            >
              <Money value={f.value} className="w-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)]" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative w-full h-full flex flex-col justify-between items-center p-3.5 sm:p-4 overflow-hidden"
    >

      {/* Header */}
      <div className="w-full flex items-center justify-between z-10 shrink-0 pt-0.5">
        <button
          onClick={onBack}
          disabled={paying}
          aria-label="Back"
          className={`p-2 sm:p-2 rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/30 backdrop-blur-md transition-colors ${paying ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-amber-500/20'
            }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <motion.button
          onClick={onOpenInfo || (() => setShowInfo(true))}
          whileTap={{ scale: 0.96 }}
          aria-label="View temple details"
          className="flex-1 mx-2 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/25 transition-all cursor-pointer text-center"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 self-center" />
          <span className="font-malayalam text-[11px] sm:text-[12px] text-amber-100 font-semibold leading-tight text-center truncate">
            {temple?.name_ml || templeName || temple?.name || "ചിന്മയ ശ്രീ ഭുവനേശ്വരി നവഗ്രഹ ക്ഷേത്രം"}
          </span>
          <Info className="w-3 h-3 text-amber-300/80 shrink-0 self-center ml-0.5" />
        </motion.button>
        <motion.button
          onClick={ringBell}
          whileTap={{ scale: 0.85 }}
          aria-label="Ring temple bell"
          className="relative p-2 sm:p-2 rounded-full bg-gradient-to-tr from-amber-500/20 to-yellow-400/10 border border-amber-400/40 text-amber-300 hover:text-amber-100 hover:border-amber-300 transition-colors shadow-md cursor-pointer"
        >
          <motion.span
            className="block"
            initial={{ rotate: 0 }}
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
      <div className="relative z-10 w-full flex flex-col items-center pt-1 px-2 shrink-0">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-malayalam font-medium text-amber-50 text-center text-xs sm:text-[13px] leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] max-w-[340px]"
        >
          {temple?.slogan_ml || temple?.slogan_en || 'ഭക്തിനിർഭരമായ ഓരോ സമർപ്പണവും അനന്തമായ പുണ്യവും ഐശ്വര്യവുമാകുന്നു'}
        </motion.p>
        {temple?.slogan_ml && temple?.slogan_en && (
          <p className="text-[10px] text-amber-200/70 text-center tracking-wide mt-0.5 max-w-[320px] font-medium drop-shadow-sm">
            {temple.slogan_en}
          </p>
        )}
      </div>

      {/* Hundi Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className="relative z-30 my-auto w-48 sm:w-48 shrink-0"
      >
        <motion.div ref={bandaramRef} animate={bandAnim} className="relative">
          {/* Slot: lights up on impact so the eye follows the coin into the box */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '26%' }}>
            <motion.div
              className="h-1.5 w-16 sm:w-16 rounded-full bg-amber-200"
              initial={{ opacity: 0.18, scaleX: 1 }}
              animate={slotGlow ? { opacity: [0, 1, 0.15], scaleX: [0.7, 1.15, 1] } : { opacity: 0.18 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/70 blur-md"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={slotGlow ? { width: 140, height: 140, opacity: [0.9, 0] } : { width: 0, height: 0, opacity: 0 }}
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
                className="absolute left-1/2 -translate-x-1/2 w-8 h-8 sm:w-8 sm:h-8 object-contain pointer-events-none"
              />
            ))}
          </AnimatePresence>

          <div className="absolute inset-x-3 bottom-1 h-5 rounded-[50%] bg-amber-500/30 blur-lg" />
          <img
            src="/hundi.webp"
            alt="Temple Hundi donation box"
            className="relative w-full max-h-[22vh] sm:max-h-[135px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] brightness-110"
          />
        </motion.div>
      </motion.div>

      {/* Running total */}
      <div className="relative z-10 w-full my-auto flex items-center justify-center gap-2.5 shrink-0">
        <span className="font-malayalam text-xs text-amber-200/80 font-medium">ആകെ തുക</span>
        <div className="relative h-7 overflow-hidden min-w-[84px] px-3.5 flex items-center justify-center rounded-full bg-black/60 border border-amber-400/40 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={amount}
              initial={{ y: 22, opacity: 0, scale: 0.75 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -22, opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center gap-1 font-cinzel font-bold text-base text-amber-50 tabular-nums"
            >
              <span className="text-xs text-amber-300">₹</span>
              {amount}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Coins Section */}
      <div className="relative z-10 w-full mt-1 shrink-0 px-1">
        <Label className="font-malayalam text-amber-200/75 mb-1.5">നാണയങ്ങൾ · Coins</Label>
        <div className="grid grid-cols-5 gap-1.5 px-1">
          {COINS.map((value, i) => (
            <motion.button
              key={value}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.4, type: 'spring', stiffness: 260, damping: 18 }}
              whileTap={{ scale: 0.85 }}
              onClick={(e) => placeOffering(value, e)}
              disabled={paying}
              aria-label={`Offer ${value} rupee coin`}
              className={`mx-auto w-full max-w-[48px] focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-300/60 rounded-full transition-opacity ${paying ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                }`}
            >
              <Money value={value} className="w-full h-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.65)] hover:scale-105 active:scale-95 transition-transform" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      <div className="relative z-10 w-full mt-2 shrink-0 px-1">
        <Label className="font-malayalam text-amber-200/75 mb-1.5">നോട്ടുകൾ · Notes</Label>
        <div className="grid grid-cols-2 gap-2.5 px-0.5">
          {NOTES.map((value, i) => (
            <motion.button
              key={value}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.06, duration: 0.4 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => placeOffering(value, e)}
              disabled={paying}
              aria-label={`Offer ${value} rupee note`}
              className={`mx-auto w-full max-w-[125px] flex items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-300/60 rounded-md transition-opacity ${paying ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                }`}
            >
              <Money value={value} className="w-full h-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.65)] hover:scale-[1.03] active:scale-95 transition-transform" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Offer button: single launch to default UPI app */}
      <div className="relative z-10 w-full mt-auto pt-1 pb-1 sm:pb-0.5 shrink-0">
        <motion.button
          type="button"
          onClick={submitOffering}
          disabled={amount <= 0}
          whileTap={amount === 0 || paying ? undefined : { scale: 0.97 }}
          className={`w-full py-2.5 sm:py-2.5 px-6 rounded-2xl font-malayalam text-base sm:text-base border transition-all duration-300 flex items-center justify-center gap-2 select-none ${paying
            ? 'bg-gradient-to-r from-amber-500/75 via-amber-400/75 to-amber-600/75 text-stone-950 font-semibold border-yellow-200/30 cursor-pointer'
            : amount > 0
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-semibold shadow-[0_8px_25px_rgba(217,119,6,0.35)] border-yellow-200/50 cursor-pointer'
              : 'bg-amber-400/15 text-amber-200/45 border-amber-200/10 cursor-not-allowed'
            }`}
        >
          {paying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>ദർശനം കാണുക / View Darshan</span>
            </>
          ) : (
            <span className={amount > 0 ? '' : 'opacity-70'}>സമർപ്പിക്കുക</span>
          )}
        </motion.button>

        {/* Status line under the button, only while opening UPI */}
        <div className="h-4 mt-1 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {paying && (
              <motion.p
                key="paying"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[9.5px] uppercase tracking-[0.2em] text-amber-200/65 font-medium"
              >
                UPI app opened · Tap to view Darshan
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {overlay}

      {/* Temple Profile Details Modal */}
      <AnimatePresence>
        {showInfo && (
          <TempleInfoModal
            temple={temple}
            templeName={temple?.name || templeName}
            onClose={() => setShowInfo(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}