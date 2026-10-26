import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Unlock, Sparkles, Share2, Volume2, VolumeX, Maximize2, X, Play } from 'lucide-react';

/* Where offerings are collected. Surfaces on the receipt; admin-configurable. */
const UPI_ID = 'programers@icici';

const makeReceipt = () =>
  `EH-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;

const formatStamp = (d) =>
  d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

/* Sacred Devotional Video & Audio Source */
const SACRED_MEDIA_SRC = '/video.mp4';

/** Live Sanctum Darshan Video Player with Sound Toggle & Blurred Backdrop */
function DarshanVideoCard({ onExpand, videoSrc = SACRED_MEDIA_SRC, templeTitle = 'ചിന്മയ ശ്രീ ഭുവനേശ്വരി ദർശനം' }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const toggleSound = (e) => {
    e?.stopPropagation();
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
      }
      return next;
    });
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-hidden rounded-2xl bg-black border border-amber-400/40 shadow-[inset_0_1px_0_rgba(255,240,200,0.25),0_8px_24px_rgba(0,0,0,0.8)] backdrop-blur-md">
      {/* Top Header Row */}
      <div className="w-full z-30 flex items-center justify-between px-3 py-1.5 bg-stone-950/95 border-b border-amber-400/30 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <span className="font-malayalam text-[10.5px] sm:text-[11.5px] font-bold text-amber-200 tracking-wide">
            ലൈവ് ദർശനം
          </span>
          <span className="text-[8px] uppercase tracking-wider text-amber-300/80 font-medium">
            · Live Sanctum
          </span>
        </div>

        {/* Top Sound Toggle Pill */}
        <button
          onClick={toggleSound}
          type="button"
          aria-label={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
          className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-semibold border transition-all cursor-pointer ${
            !isMuted
              ? 'bg-amber-500/25 border-amber-300 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
              : 'bg-stone-900/90 border-amber-400/40 text-stone-300 hover:text-amber-200'
          }`}
        >
          {!isMuted ? (
            <>
              <Volume2 className="w-2.5 h-2.5 text-amber-300" />
              <span>Sound ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-2.5 h-2.5 text-stone-400" />
              <span>Sound OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Main Video Viewport */}
      <div
        onClick={togglePlay}
        className="relative w-full flex-1 min-h-0 overflow-hidden bg-black flex items-center justify-center cursor-pointer select-none"
      >
        {/* Layer 1: Blurred Backdrop Video */}
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 w-full h-full object-cover blur-md brightness-[0.35] pointer-events-none"
        />

        {/* Layer 2: Main Deity Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="relative z-10 h-full w-auto max-w-full object-contain"
        />

        {/* Vignette Gradients */}
        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-stone-950/70 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/75 to-transparent pointer-events-none z-20" />

        {/* Play/Pause Overlay indicator when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-amber-500/30 border border-amber-300 flex items-center justify-center backdrop-blur-sm shadow-[0_0_16px_rgba(245,158,11,0.5)]">
              <Play className="w-5 h-5 text-amber-100 fill-amber-100 ml-0.5" />
            </div>
          </div>
        )}

        {/* Floating Bottom Bar over Video */}
        <div className="absolute bottom-2 inset-x-2 z-30 flex items-center justify-between pointer-events-none">
          {/* Audio Tap Pill Button */}
          <button
            onClick={toggleSound}
            type="button"
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-amber-400/60 text-amber-200 text-[10px] font-malayalam font-semibold backdrop-blur-md shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>ശബ്ദം ഓഫ് ചെയ്യുക</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                <span>ശബ്ദം ഓൺ ചെയ്യുക</span>
              </>
            )}
          </button>

          {/* Fullscreen Expand Button */}
          {onExpand && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExpand({
                  title: `${templeTitle} · Darshan`,
                  desc: 'Live sanctum holy Aarti & Deeparadhana visual offering',
                  src: videoSrc,
                  initialMuted: isMuted,
                });
              }}
              type="button"
              aria-label="Expand Darshan"
              className="pointer-events-auto p-1.5 rounded-full bg-black/80 border border-amber-400/60 text-amber-200 hover:text-amber-100 backdrop-blur-md shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Devotional Expanded Video Modal with Sound Control */
function VideoModal({ video, onClose }) {
  const [isMuted, setIsMuted] = useState(Boolean(video?.initialMuted ?? true));
  const videoRef = useRef(null);

  const toggleSound = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
      }
      return next;
    });
  };

  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {});
    }
  }, [video, isMuted]);

  if (!video) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-3.5 bg-black/90 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-[380px] max-h-[90vh] flex flex-col rounded-3xl overflow-hidden bg-stone-950 border border-amber-400/50 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.3)] p-3.5 sm:p-4 text-center z-10"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Video' : 'Mute Video'}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider transition-all cursor-pointer border ${
              !isMuted
                ? 'bg-amber-500/25 border-amber-300 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                : 'bg-stone-900 border-amber-400/30 text-stone-400 hover:text-amber-200'
            }`}
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Sound ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                <span>Sound OFF</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            aria-label="Close Video"
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-amber-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Box with Blurred Backdrop */}
        <div className="w-full flex-1 min-h-[240px] max-h-[58vh] rounded-2xl overflow-hidden border border-amber-400/30 bg-black flex items-center justify-center relative mb-2.5">
          {/* Layer 1: Blurred fill */}
          <video
            src={video.src}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 w-full h-full object-cover blur-md brightness-[0.35] pointer-events-none"
          />

          {/* Layer 2: Main Video */}
          <video
            ref={videoRef}
            src={video.src}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="relative z-10 h-full w-auto max-w-full object-contain"
          />
        </div>

        <div className="shrink-0">
          <h3 className="font-malayalam text-sm font-bold text-amber-100 leading-tight mb-1">
            {video.title}
          </h3>
          <p className="text-[10.5px] text-stone-300 leading-normal">{video.desc}</p>

          <button
            onClick={onClose}
            className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-semibold font-malayalam text-xs cursor-pointer active:scale-95 transition-transform"
          >
            ശരി / Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** The "payment successful" pop. Dismiss it to reveal the Darshan screen behind. */
function SuccessDialog({ amount, templeName, receipt, paidAt, onViewDarshan, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute inset-0 z-[100] flex items-center justify-center p-4 transform-gpu"
      role="dialog"
      aria-modal="true"
      aria-label="Payment successful"
    >
      {/* Crisp Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-[6px] transition-opacity" 
        onClick={onViewDarshan} 
      />

      {/* 120 FPS GPU Accelerated Modal Card */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 22 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 15 }}
        transition={{ 
          type: 'spring', 
          stiffness: 340, 
          damping: 28, 
          mass: 0.75,
          delay: 0.05 
        }}
        className="relative w-full max-w-[290px] rounded-3xl px-6 pb-5 pt-7 text-center bg-gradient-to-b from-stone-900/98 via-stone-900/95 to-stone-950/98 border border-amber-400/50 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(245,158,11,0.3)] transform-gpu will-change-transform"
      >
        {/* Subtle Warm Top Glow */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-36 h-20 -translate-y-1/2 rounded-full bg-amber-400/25 blur-2xl pointer-events-none" />

        {/* Success Icon & Animated Checkmark */}
        <div className="relative mx-auto w-[74px] h-[74px] mb-3">
          <motion.span
            className="absolute inset-0 rounded-full border border-amber-300/60 pointer-events-none"
            initial={{ scale: 0.7, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          />
          <svg viewBox="0 0 52 52" className="w-full h-full transform-gpu" fill="none">
            <circle cx="26" cy="26" r="24" fill="rgba(251,191,36,0.12)" stroke="#b45309" strokeWidth="1.5" />
            <motion.circle
              cx="26"
              cy="26"
              r="24"
              stroke="#fde68a"
              strokeWidth="2.2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
            />
            <motion.path
              d="M15.5 27.5l7.5 7.5 14-15.5"
              stroke="#fff7d6"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, delay: 0.35, ease: 'easeOut' }}
            />
          </svg>
        </div>

        <p className="relative font-malayalam text-lg text-amber-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">സമർപ്പണം പൂർത്തിയായി</p>
        <p className="relative mt-0.5 text-[9px] uppercase tracking-[0.3em] text-emerald-400 font-semibold">
          Payment Successful
        </p>

        <div className="relative mt-3.5 font-cinzel font-bold text-3xl text-amber-50 tabular-nums drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          <span className="text-base opacity-55">₹</span>
          {amount}
        </div>
        <p className="relative mt-1 px-2 font-malayalam text-[11px] leading-snug text-amber-200/80">{templeName}</p>

        <div className="relative mt-3 rounded-xl bg-black/45 border border-amber-400/25 px-3 py-2">
          <p className="text-[8.5px] uppercase tracking-[0.2em] text-amber-200/50 font-medium">Receipt No.</p>
          <p className="text-[11px] font-semibold tracking-wide text-amber-100">{receipt}</p>
          <p className="mt-0.5 text-[9px] text-amber-200/50">{formatStamp(paidAt)}</p>
        </div>

        <div className="relative mt-4 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onViewDarshan}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-semibold font-malayalam text-sm cursor-pointer shadow-[0_4px_16px_rgba(217,119,6,0.35)] transition-transform"
          >
            ദർശനം കാണുക
          </motion.button>
          <button
            onClick={onReset}
            className="w-full py-2.5 rounded-xl bg-amber-400/10 border border-amber-300/25 text-amber-200 font-malayalam font-semibold text-xs sm:text-[13px] cursor-pointer transition-colors hover:bg-amber-400/20 active:scale-95"
          >
            മറ്റൊരു സമർപ്പണം
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Third({
  onBack,
  onReset,
  amount = 0,
  temple,
  templeName = 'Chinmaya Sri Bhuvaneswari Navagraha Temple'
}) {
  const tNameEn = temple?.name || templeName;
  const tNameMl = temple?.name_ml || '';
  const displayTitle = tNameMl || tNameEn;
  const videoSrc = temple?.darshan_video_url || SACRED_MEDIA_SRC;
  const upiId = temple?.upi_id || UPI_ID;

  // The offering is already settled by the time this screen plays, so the receipt
  // is fixed for the lifetime of the screen and the success pop is up front.
  const [receipt] = useState(makeReceipt);
  const [paidAt] = useState(() => new Date());
  const [showDone, setShowDone] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowDone(false);
        setActiveVideo(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleBack = () => {
    if (onBack) onBack();
  };

  const handleReset = () => {
    if (onReset) onReset();
  };

  const share = async () => {
    const defaultTemplate = `I offered ₹{amount} at {temple} through E-Hundi. Receipt {receipt}. Watch darshan: {link}`;
    const rawTemplate = temple?.darshan_message_template || defaultTemplate;
    const text = rawTemplate
      .replace('{amount}', amount)
      .replace('{temple}', tNameEn)
      .replace('{receipt}', receipt)
      .replace('{link}', window.location.href);

    try {
      if (navigator.share) {
        await navigator.share({ title: `${tNameEn} E-Hundi Offering`, text });
        return;
      }
      await navigator.clipboard.writeText(text);
    } catch {
      /* user dismissed the share sheet, or clipboard is unavailable */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="relative w-full h-full flex flex-col justify-between items-center p-3.5 sm:p-5 overflow-hidden gap-1.5 sm:gap-2.5 transform-gpu"
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between z-10 shrink-0 pt-0.5">
        <button
          onClick={handleBack}
          aria-label="Back"
          className="p-1.5 sm:p-2 rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/30 backdrop-blur-md cursor-pointer transition-colors hover:bg-amber-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-200 font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
          Darshan
        </span>
        <div className="w-8 sm:w-9 flex justify-center">
          <Unlock className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Blessing line */}
      <div className="relative z-10 w-full flex flex-col items-center px-1 shrink-0">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-malayalam font-medium text-center text-xs sm:text-[13.5px] leading-tight text-amber-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] max-w-[320px]"
        >
          നിങ്ങളുടെ കാണിക്ക ദൈവം സ്വീകരിച്ചു
        </motion.p>
      </div>

      {/* Sanctum Live Darshan Video Card */}
      <div className="relative z-10 w-full flex-1 min-h-[180px] sm:min-h-[220px] flex flex-col py-1 overflow-hidden">
        <DarshanVideoCard
          onExpand={setActiveVideo}
          videoSrc={videoSrc}
          templeTitle={displayTitle}
        />
      </div>

      {/* Receipt summary */}
      <div className="relative z-10 w-full shrink-0">
        <div className="w-full overflow-hidden rounded-2xl bg-black/50 border border-amber-400/30 backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2.5 px-3.5 py-2 border-b border-amber-400/15">
            <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-700/20 border border-amber-400/30 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-amber-200" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10.5px] font-semibold text-amber-100">{displayTitle}</p>
              <p className="text-[8px] uppercase tracking-[0.2em] text-amber-200/50">Digital Hundi</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-3.5 py-1.5">
            <span className="text-[9.5px] uppercase tracking-[0.2em] text-amber-200/60 font-medium">Total Offering</span>
            <span className="font-cinzel font-bold text-xl sm:text-2xl text-amber-50 tabular-nums">
              <span className="text-sm opacity-60">₹</span>
              {amount}
            </span>
          </div>

          <div className="flex items-center justify-between px-3.5 py-1.5 bg-black/30 border-t border-amber-400/15">
            <span className="text-[8.5px] uppercase tracking-[0.2em] text-amber-200/50">Paid to</span>
            <span className="truncate text-[10px] font-medium text-amber-100/90">{upiId}</span>
          </div>

          <div className="flex items-center justify-between gap-2 px-3.5 py-1.5 bg-black/30 border-t border-amber-400/15">
            <span className="text-[8.5px] uppercase tracking-[0.2em] text-amber-200/50">Receipt</span>
            <span className="truncate text-[10px] font-medium tracking-wide text-amber-100/90">
              {receipt} · {formatStamp(paidAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 w-full shrink-0 flex items-center gap-2 pt-0.5">
        <motion.button
          onClick={handleReset}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-2.5 sm:py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-semibold font-malayalam text-sm sm:text-base border border-yellow-200/50 shadow-[0_6px_20px_rgba(217,119,6,0.35)] cursor-pointer"
        >
          മറ്റൊരു സമർപ്പണം
        </motion.button>
        <motion.button
          onClick={share}
          whileTap={{ scale: 0.92 }}
          aria-label="Share your offering"
          className="w-[44px] shrink-0 py-2.5 sm:py-3 rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-400/30 backdrop-blur-md hover:bg-amber-500/20 transition-colors flex items-center justify-center cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Success Dialog */}
      <AnimatePresence>
        {showDone && (
          <SuccessDialog
            amount={amount}
            templeName={displayTitle}
            receipt={receipt}
            paidAt={paidAt}
            onViewDarshan={() => setShowDone(false)}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>

      {/* Expanded Darshan Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
