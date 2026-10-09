import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Unlock, Sparkles, Share2, Volume2, VolumeX, X, Play } from 'lucide-react';

/* Where offerings are collected. Surfaces on the receipt; admin-configurable. */
const UPI_ID = 'shrimahadeva@upi';

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

const SLOKAS = [
  {
    id: 1,
    tag: 'മഹാമൃത്യുഞ്ജയ മന്ത്രം',
    badge: 'Maha Mrityunjaya',
    text: '॥ ഓം ത്ര്യംബകം യജാമഹേ സുഗന്ധിം പുഷ്ടിവർധനം । ഉർവ്വാരുകമിവ ബന്ധനാന്മൃത്യോർമുക്ഷീയ മാഽമൃതാത് ॥',
    translation: 'ദീർഘായുസ്സും സർവ്വ ദുരിതമുക്തിയും നൽകി ഭഗവാൻ അനുഗ്രഹിക്കട്ടെ',
  },
  {
    id: 2,
    tag: 'ശിവ സ്തോത്രം',
    badge: 'Karpura Gauram',
    text: '॥ കർപ്പൂര ഗൗരം കരുണാവതാരം സംസാരാസാരം ഭുജഗേന്ദ്രഹാരം । സദാ വസന്തം ഹൃദയാരവിന്ദേ ഭവം ഭവാനീ സഹിതം നമാമി ॥',
    translation: 'ഭഗവാന്റെ ദിവ്യ സാന്നിധ്യവും കരുണയും സദാ കൂടെയുണ്ടാകട്ടെ',
  },
  {
    id: 3,
    tag: 'മഹാ ഗായത്രീ മന്ത്രം',
    badge: 'Gayatri Mantra',
    text: '॥ ഓം ഭൂർ ഭുവഃ സ്വഃ തത് സവിതുർ വരേണ്യം । ഭർഗോ ദേവസ്യ ധീമഹി ധിയോ യോ നഃ പ്രചോദയാത് ॥',
    translation: 'ജ്ഞാനവും ആയുരാരോഗ്യ സൗഖ്യവും ഭഗവാൻ പ്രദാനം ചെയ്യട്ടെ',
  },
  {
    id: 4,
    tag: 'ശാന്തി മന്ത്രം',
    badge: 'Universal Peace',
    text: '॥ സർവ്വേ ഭവന്തു സുഖിനഃ സർവ്വേ സന്തു നിരാമയാഃ । സർവ്വേ ഭദ്രാനി പശ്യന്തു മാ കശ്ചിദ് ദുഃഖ ഭാഗ്ഭവേത് ॥',
    translation: 'കുടുംബത്തിൽ സർവ്വ ഐശ്വര്യങ്ങളും ശാന്തിയും സമാധാനവും നിറയട്ടെ',
  },
  {
    id: 5,
    tag: 'ഭക്ത സമർപ്പണാനുഗ്രഹം',
    badge: 'Divine Blessings',
    text: '॥ ഓം നമഃ ശിവായ ശുഭായ സദാശിവായ । ഹര ഹര മഹാദേവ ॥',
    translation: 'നിങ്ങളുടെ സമർപ്പണം ഭഗവാൻ സ്വീകരിച്ചിരിക്കുന്നു. പ്രാർത്ഥനകൾ സഫലമാകട്ടെ',
  },
];

/* Sacred Devotional Video & Audio Source */
const SACRED_MEDIA_SRC = '/video.mp4';

/** Resilient Looping Devotional Video Preview Tile */
function DarshanVideoTile({
  src = SACRED_MEDIA_SRC,
  fallbackTitle,
  titleMalayalam,
  tag,
  withAudio = false,
  onExpand,
}) {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay silent preview
      });
    }
  }, [src]);

  return (
    <div
      onClick={onExpand}
      className={`group relative flex-1 min-w-0 h-[34px] sm:h-[38px] rounded-lg overflow-hidden border transition-all cursor-pointer shadow-sm active:scale-[0.96] ${
        withAudio
          ? 'border-amber-400/60 bg-stone-950 hover:border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
          : 'border-amber-400/40 bg-stone-950 hover:border-amber-300'
      }`}
      title={`Watch ${fallbackTitle}`}
    >
      {/* Mini Video stream preview (Strictly muted in preview tile for seamless looping) */}
      {!videoError && src ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover object-top brightness-90 group-hover:scale-105 transition-transform duration-500"
        />
      ) : null}

      {/* Golden Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/70 pointer-events-none" />

      {/* Top Header Row with Malayalam Title & Sound Icon */}
      <div className="absolute top-0.5 inset-x-1 flex items-center justify-between pointer-events-none z-10">
        <span className="font-malayalam text-[9.5px] sm:text-[11px] font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] truncate block">
          {titleMalayalam}
        </span>
        {withAudio ? (
          <Volume2 className="w-2.5 h-2.5 text-amber-300 drop-shadow-[0_0_3px_rgba(251,191,36,0.8)] shrink-0 ml-0.5" />
        ) : (
          <VolumeX className="w-2 h-2 text-stone-400 shrink-0 ml-0.5" />
        )}
      </div>

      {/* Center Action Indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {withAudio ? (
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-500/35 border border-amber-300/70 flex items-center justify-center shadow-[0_0_6px_rgba(245,158,11,0.6)]">
            <Play className="w-2 h-2 text-amber-100 fill-amber-100 ml-0.5" />
          </div>
        ) : (
          <span className="text-amber-300 drop-shadow-[0_0_4px_rgba(245,158,11,0.9)] text-[9px] sm:text-[10px]">
            🪔
          </span>
        )}
      </div>

      {/* Bottom Subtitle / Tag */}
      <div className="absolute bottom-0.5 inset-x-1 text-center pointer-events-none z-10">
        <span
          className={`text-[6px] sm:text-[6.5px] uppercase tracking-wider font-semibold truncate block drop-shadow-md ${
            withAudio ? 'text-amber-300' : 'text-amber-100/80'
          }`}
        >
          {tag}
        </span>
      </div>
    </div>
  );
}

/** Devotional Media Bar: 
 * 1. Left: Audio Only (Mantra Dhwani from /video.mp4)
 * 2. Center: Video without Audio (Silent Darshan)
 * 3. Right: Video with Audio (Full Darshan + Chants)
 */
function DevotionalMediaBar({ onOpenVideo }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  const handleToggleAudio = () => {
    setIsPlayingAudio((prev) => {
      const next = !prev;
      if (audioRef.current) {
        if (next) {
          audioRef.current.play().catch(() => {
            // Autoplay policy fallback
          });
        } else {
          audioRef.current.pause();
        }
      }
      return next;
    });
  };

  const handleOpenSilentVideo = () => {
    onOpenVideo({
      title: 'ശ്രീ മഹാദേവ ദർശനം · Aarti Darshan',
      desc: 'Live sanctum holy Aarti & Deeparadhana visual offering (Silent Mode)',
      src: SACRED_MEDIA_SRC,
      initialMuted: true,
    });
  };

  const handleOpenAudioVideo = () => {
    // Pause standalone background audio if playing, to prevent overlapping sounds
    if (audioRef.current && isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
    onOpenVideo({
      title: 'ശ്രീ മഹാദേവ ദർശന ധ്വനി · Aarti & Mantras',
      desc: 'Divine sanctum Aarti accompanied by sacred devotional chants & mantras',
      src: SACRED_MEDIA_SRC,
      initialMuted: false,
    });
  };

  return (
    <div className="w-full px-2 sm:px-2.5 py-1.5 bg-gradient-to-r from-stone-950/98 via-black/95 to-stone-950/98 border-t border-amber-400/25 shrink-0">
      {/* Native HTML5 Audio element playing the soundtrack directly from /video.mp4 (Zero redundant bundle size!) */}
      <audio
        ref={audioRef}
        src={SACRED_MEDIA_SRC}
        loop
        preload="auto"
        onEnded={() => setIsPlayingAudio(false)}
        onError={() => {
          setIsPlayingAudio(false);
        }}
      />

      <div className="flex items-center justify-between w-full gap-1.5">
        {/* 🌟 1. Left Button: Devotional Audio Only */}
        <motion.button
          onClick={handleToggleAudio}
          whileTap={{ scale: 0.94 }}
          aria-label={isPlayingAudio ? 'Mute Devotional Audio' : 'Play Devotional Audio'}
          className={`relative flex-1 min-w-0 h-[34px] sm:h-[38px] rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 px-1 py-0.5 border transition-all cursor-pointer shadow-sm ${
            isPlayingAudio
              ? 'bg-gradient-to-b from-amber-500/30 via-amber-900/35 to-black/95 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
              : 'bg-stone-900/90 hover:bg-stone-800/90 border-amber-400/35 text-stone-300'
          }`}
        >
          {isPlayingAudio && (
            <motion.span
              animate={{ opacity: [0.25, 0.6, 0.25] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-lg bg-amber-400/15 pointer-events-none"
            />
          )}

          {/* Equalizer Animation / Speaker Icon */}
          <div className="relative flex items-center justify-center shrink-0">
            {isPlayingAudio ? (
              <div className="flex items-end gap-[1.5px] h-3.5 w-3.5 justify-center">
                <span className="w-[2px] bg-amber-300 rounded-full animate-[bounce_0.6s_ease-in-out_infinite] h-3" />
                <span className="w-[2px] bg-amber-300 rounded-full animate-[bounce_0.8s_ease-in-out_infinite_0.2s] h-3.5" />
                <span className="w-[2px] bg-amber-300 rounded-full animate-[bounce_0.5s_ease-in-out_infinite_0.4s] h-2.5" />
              </div>
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-amber-200/60" />
            )}
          </div>

          <div className="min-w-0 flex flex-col items-start leading-tight text-left">
            <span className="font-malayalam text-[9.5px] sm:text-[11px] font-bold text-amber-100 truncate w-full tracking-normal">
              മന്ത്ര ധ്വനി
            </span>
            <span
              className={`text-[6px] sm:text-[6.5px] uppercase tracking-wider font-semibold ${
                isPlayingAudio ? 'text-amber-300 animate-pulse font-bold' : 'text-amber-200/50'
              }`}
            >
              {isPlayingAudio ? 'Playing' : 'Audio Only'}
            </span>
          </div>
        </motion.button>

        {/* 🌟 2. Center Button: Video Without Audio (Silent Aarti) */}
        <DarshanVideoTile
          src={SACRED_MEDIA_SRC}
          titleMalayalam="ദർശനം"
          tag="Silent Video"
          fallbackTitle="Temple Aarti Darshan (Silent)"
          withAudio={false}
          onExpand={handleOpenSilentVideo}
        />

        {/* 🌟 3. Right Button: Video With Audio (Video + Chanting) */}
        <DarshanVideoTile
          src={SACRED_MEDIA_SRC}
          titleMalayalam="ദർശന ധ്വനി"
          tag="Video + Sound"
          fallbackTitle="Sanctum Darshan with Chants"
          withAudio={true}
          onExpand={handleOpenAudioVideo}
        />
      </div>
    </div>
  );
}

/** Devotional Expanded Video Modal with Sound Control */
function VideoModal({ video, onClose }) {
  const [isMuted, setIsMuted] = useState(Boolean(video?.initialMuted));
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
      videoRef.current.muted = Boolean(video.initialMuted);
      videoRef.current.play().catch(() => {
        // Fallback if browser requires user interaction for unmuted playback
      });
    }
  }, [video]);

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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-[360px] max-h-[90vh] flex flex-col rounded-3xl overflow-hidden bg-stone-950 border border-amber-400/50 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.3)] p-3.5 sm:p-4 text-center z-10"
      >
        {/* Top Control Bar with Mute/Unmute toggle & Close Button */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Video' : 'Mute Video'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider transition-all cursor-pointer border ${
              !isMuted
                ? 'bg-amber-500/25 border-amber-300 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                : 'bg-stone-900 border-amber-400/30 text-stone-400 hover:text-amber-200'
            }`}
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-3 h-3 text-amber-300 animate-pulse" />
                <span>Sound ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3" />
                <span>Muted (Silent)</span>
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

        {/* Video Player Box - object-contain ensures full divine frame without cropping */}
        <div className="w-full flex-1 min-h-[220px] max-h-[55vh] rounded-2xl overflow-hidden border border-amber-400/30 bg-black flex items-center justify-center relative mb-2.5">
          <video
            ref={videoRef}
            src={video.src}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            controls
            className="w-full h-full max-h-[55vh] object-contain rounded-xl"
          />
        </div>

        <div className="shrink-0">
          <h3 className="font-malayalam text-sm font-bold text-amber-100 leading-tight mb-1">
            {video.title}
          </h3>
          <p className="text-[10px] text-stone-300 leading-normal">{video.desc}</p>

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

function SloganVerticalTicker({ onOpenVideo }) {
  // Duplicate for seamless 360-degree continuous loop
  const tickerItems = [...SLOKAS, ...SLOKAS];

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-hidden rounded-2xl bg-black/75 border border-amber-400/40 shadow-[inset_0_1px_0_rgba(255,240,200,0.25),0_8px_24px_rgba(0,0,0,0.8)] backdrop-blur-md">
      {/* Top Live Ticker Header */}
      <div className="w-full z-20 flex items-center justify-between px-3 py-1.5 bg-stone-950/95 border-b border-amber-400/30 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <span className="font-malayalam text-[10.5px] sm:text-[11.5px] font-bold text-amber-200 tracking-wide">
            ദിവ്യ മന്ത്ര ധ്വനി
          </span>
        </div>
        <span className="text-[8px] sm:text-[8.5px] uppercase tracking-[0.2em] font-semibold text-amber-300/85">
          Devotional Chants
        </span>
      </div>

      {/* Upward Scrolling News-Style Viewport with Soft Vertical Fade Masks */}
      <div
        className="relative w-full flex-1 min-h-0 overflow-hidden px-3"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >
        <div className="slogan-ticker-scroll flex flex-col gap-2.5 py-2">
          {tickerItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex flex-col items-center text-center px-3 py-2 rounded-xl bg-gradient-to-b from-stone-900/80 to-black/90 border border-amber-400/25 shadow-sm"
            >
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/35 mb-1">
                <span className="font-malayalam text-[9px] font-bold text-amber-200">
                  {item.tag}
                </span>
                <span className="text-amber-400/60 font-bold">&middot;</span>
                <span className="text-[7.5px] uppercase tracking-wider text-amber-100 font-semibold">
                  {item.badge}
                </span>
              </div>

              <p className="font-malayalam text-xs sm:text-[13px] font-bold text-amber-100 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] px-1">
                {item.text}
              </p>

              <p className="font-malayalam text-[10px] sm:text-[11px] font-medium text-amber-300/90 mt-0.5 leading-normal">
                {item.translation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 Dedicated 3-Widget Row: Left Speaker (Audio Chant) + Center Video + Right Video */}
      <DevotionalMediaBar onOpenVideo={onOpenVideo} />
    </div>
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
        <p className="relative mt-1 px-2 text-[10px] leading-snug text-amber-200/60">{templeName}</p>

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
            className="w-full py-2 rounded-xl bg-amber-400/10 border border-amber-300/20 text-amber-200/85 text-[11px] font-semibold uppercase tracking-[0.15em] cursor-pointer transition-colors hover:bg-amber-400/20 active:scale-95"
          >
            Make Another Offering
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Third({ onBack, onReset, amount = 0, templeName = 'Shri Mahadeva Temple' }) {
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
    const text = `I offered ₹${amount} at ${templeName} through E-Hundi. Receipt ${receipt}.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'E-Hundi Offering', text });
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
          നിങ്ങളുടെ സമർപ്പണം ദൈവം സ്വീകരിച്ചു
        </motion.p>
      </div>

      {/* Devotional Slogan Upward News-Style Ticker with Media Bar */}
      <div className="relative z-10 w-full flex-1 min-h-[220px] flex flex-col py-1 overflow-hidden">
        <SloganVerticalTicker onOpenVideo={setActiveVideo} />
      </div>

      {/* Receipt summary */}
      <div className="relative z-10 w-full shrink-0">
        <div className="w-full overflow-hidden rounded-2xl bg-black/50 border border-amber-400/30 backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2.5 px-3.5 py-2 border-b border-amber-400/15">
            <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-700/20 border border-amber-400/30 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-amber-200" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10.5px] font-semibold text-amber-100">{templeName}</p>
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
            <span className="truncate text-[10px] font-medium text-amber-100/90">{UPI_ID}</span>
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
            templeName={templeName}
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
