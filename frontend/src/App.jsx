import { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, RefreshCw, Sparkles, Building2 } from 'lucide-react';
import First from './Home/First';
import Second from './Home/Second';
import Third from './Home/Third';
import Mandala from './components/Mandala';
import Sparkle from './components/Sparkle';
import TempleInfoModal from './components/TempleInfoModal';
import { preloadAssets } from './utils/preload';
import './App.css';

const STEPS = [
  { key: 'welcome', component: First },
  { key: 'hundi', component: Second },
  { key: 'darshan', component: Third },
];

function App() {
  const { slug } = useParams();
  const [step, setStep] = useState(0);
  const [showTempleInfo, setShowTempleInfo] = useState(false);
  const [amount, setAmount] = useState(0);

  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    preloadAssets();
  }, []);

  // Fetch temple dynamically based on URL slug or default
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setStep(0);
    setAmount(0);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8004';
    const endpoint = slug
      ? `${apiUrl}/api/temples/public/${encodeURIComponent(slug)}/`
      : `${apiUrl}/api/temples/public/`;

    fetch(endpoint)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Temple not found');
        }
        return data;
      })
      .then((data) => {
        if (isMounted) {
          setTemple(data.temple);
          setLoading(false);
          if (data.temple?.name) {
            document.title = `${data.temple.name} · ഇ-ഭാണ്ഡാരം (E-Hundi)`;
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Temple fetch error:', err);
          // If on root '/' and backend is offline, provide graceful fallback
          if (!slug) {
            setTemple({
              id: 1,
              name: 'Chinmaya Sri Bhuvaneswari Navagraha Temple',
              name_ml: 'ചിന്മയ ശ്രീ ഭുവനേശ്വരി നവഗ്രഹ ക്ഷേത്രം',
              short_name: 'Chinmaya Sri Bhuvaneswari',
              slug: 'chinmaya',
              city: 'Ernakulam',
              state: 'Kerala',
              phone: '+91 471 2345678',
              whatsapp: '+91 98470 12345',
              email: 'office@chinmayabhuvaneswari.temple',
              street_address: 'East Fort, Marine Drive',
              pin_code: '695001',
              slogan_ml: 'നിങ്ങളുടെ സമർപ്പണം, ഭഗവാന്റെ അനുഗ്രഹം',
              darshan_message_template: 'Namaste! Your offering of ₹{amount} to {temple} is received. Watch your darshan: {link}',
            });
            setLoading(false);
          } else {
            setError(err.message || 'Temple not found');
            setLoading(false);
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

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
  const templeName = temple?.name_ml || temple?.name || 'ചിന്മയ ശ്രീ ഭുവനേശ്വരി നവഗ്രഹ ക്ഷേത്രം';
  const templeNameEn = temple?.name || 'Chinmaya Sri Bhuvaneswari Navagraha Temple';

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

        {/* State 1: Loading State */}
        {loading && (
          <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin mb-4 flex items-center justify-center shadow-[0_0_24px_rgba(245,158,11,0.3)]">
              <span className="font-om text-2xl text-amber-200">ॐ</span>
            </div>
            <p className="font-malayalam text-sm text-amber-100 font-semibold drop-shadow-sm">
              ക്ഷേത്ര സന്നിധി ഒരുങ്ങുന്നു...
            </p>
            <p className="text-[10px] text-amber-300/60 uppercase tracking-widest mt-1">
              Loading Temple Presence
            </p>
          </div>
        )}

        {/* State 2: Temple Not Found or Inactive State */}
        {!loading && error && (
          <div className="relative z-20 w-full h-full flex flex-col justify-between items-center p-6 text-center">
            <div className="w-full flex justify-start pt-2">
              <Link
                to="/"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-400/20 transition-colors"
                title="Go to Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-col items-center max-w-[280px]">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.3)] mb-4">
                <Building2 className="w-7 h-7 text-amber-300" />
              </div>
              <h2 className="font-malayalam text-base sm:text-lg font-bold text-amber-100">
                ക്ഷേത്രം കണ്ടെത്താനായില്ല
              </h2>
              <p className="text-xs text-amber-200/80 mt-1">
                Temple Not Found
              </p>
              <div className="mt-3 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-400/20 text-[11px] text-stone-300 font-mono">
                /{slug}
              </div>
              <p className="text-[11px] text-stone-400 mt-3 leading-relaxed">
                ഈ വിലാസത്തിൽ സജീവമായ ക്ഷേത്രം ലഭ്യമല്ല. ലിങ്ക് പരിശോധിക്കുകയോ താഴെയുള്ള ബട്ടൺ ഉപയോഗിക്കുകയോ ചെയ്യുക.
              </p>
            </div>

            <div className="w-full space-y-2 pb-4">
              <Link
                to="/"
                className="w-full block py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-semibold font-malayalam text-xs sm:text-sm shadow-md transition-transform active:scale-95 text-center"
              >
                പ്രധാന ക്ഷേത്രത്തിലേക്ക് പോകുക
              </Link>
              <Link
                to="/contact"
                className="w-full block py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-amber-400/25 text-amber-200 font-medium text-[11px] transition-colors text-center"
              >
                ഹെൽപ്പ് ഡെസ്ക് / Contact Support
              </Link>
            </div>
          </div>
        )}

        {/* State 3: Normal Loaded Temple Content */}
        {!loading && !error && temple && (
          <>
            <div className="relative w-full h-full z-10 flex flex-col">
              <AnimatePresence mode="wait">
                <Current
                  key={STEPS[step].key}
                  temple={temple}
                  templeName={templeName}
                  templeNameEn={templeNameEn}
                  amount={amount}
                  onAmountChange={setAmount}
                  onOpenInfo={() => setShowTempleInfo(true)}
                  onComplete={goNext}
                  onNext={goNext}
                  onBack={goBack}
                  onReset={goReset}
                />
              </AnimatePresence>
            </div>

            {/* Temple Info Modal with Legal & Compliance Policies */}
            <AnimatePresence>
              {showTempleInfo && (
                <TempleInfoModal
                  temple={temple}
                  templeName={templeNameEn}
                  onClose={() => setShowTempleInfo(false)}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </main>
  );
}

export default App;
