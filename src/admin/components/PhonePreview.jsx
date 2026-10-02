import Mandala from '../../components/Mandala';
import { MONEY } from '../../data/money';

const SAMPLE = {
  templeName: 'Shri Mahadeva Temple',
  upiId: 'shrimahadeva@upi',
  receipt: 'EH-K3M9QW2',
  amount: 340,
};

const COINS = [1, 2, 5, 10, 20];
const NOTES = [50, 100, 200, 500];

function WelcomeMock() {
  return (
    <>
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[7px] uppercase tracking-wider text-amber-200">{SAMPLE.templeName}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-amber-400/25 to-black/60 border-2 border-amber-400/60 flex items-center justify-center shadow-[0_0_28px_rgba(245,158,11,0.4)]">
          <span className="font-om text-[30px] text-amber-200">ॐ</span>
        </div>
        <div className="text-center">
          <p className="font-cinzel text-base font-black tracking-[0.18em] text-amber-100">E-HUNDI</p>
          <p className="mt-1 text-[6.5px] uppercase tracking-[0.28em] text-amber-200/70">Digital Temple Offering</p>
        </div>
        <div className="px-3 py-2.5 rounded-xl bg-black/40 border border-amber-400/30 backdrop-blur-md">
          <p className="font-philosopher text-[10px] italic text-amber-100">“Your Offering, A Blessing.”</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <div className="w-32 h-[2px] rounded-full bg-amber-400/15 overflow-hidden">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-100" />
        </div>
        <p className="text-[7px] text-amber-200/50">
          <span className="font-malayalam">ഭാണ്ഡാരം</span>
          <span className="mx-1 text-amber-300/40">·</span>
          <span className="tracking-[0.2em]">by Programers</span>
        </p>
      </div>
    </>
  );
}

function HundiMock() {
  return (
    <>
      <div className="flex items-center justify-between shrink-0">
        <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-400/30" />
        <span className="text-[7px] uppercase tracking-[0.28em] text-amber-200">Digital Hundi</span>
        <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/40" />
      </div>

      <div className="pt-1.5 text-center shrink-0">
        <p className="font-malayalam text-[8.5px] leading-tight text-amber-50">
          ഭക്തിനിർഭരമായ ഓരോ സമർപ്പണവും അനന്തമായ പുണ്യവും ഐശ്വര്യവുമാകുന്നു
        </p>
        <p className="mt-0.5 text-[5.5px] uppercase tracking-[0.2em] text-amber-200/60">
          Every Sacred Offering Brings Divine Blessings
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center items-center gap-1.5">
        <img src="/hundi.png" alt="" className="w-24 object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.8)]" />
        <div className="flex items-center gap-1.5">
          <span className="font-malayalam text-[7px] text-amber-200/70">ആകെ</span>
          <span className="px-2 py-0.5 rounded-full bg-black/45 border border-amber-400/30 font-cinzel text-[10px] font-bold text-amber-50">
            ₹{SAMPLE.amount}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 shrink-0">
        <div className="grid grid-cols-5 gap-1">
          {COINS.map((v) => (
            <img key={v} src={MONEY[v].src} alt="" className="w-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-1">
          {NOTES.map((v) => (
            <img key={v} src={MONEY[v].src} alt="" className="w-full object-contain drop-shadow-[0_2px_5px_rgba(0,0,0,0.55)]" />
          ))}
        </div>
        <div className="w-full py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-center font-malayalam text-[9px] font-semibold text-stone-950">
          സമർപ്പിക്കുക
        </div>
      </div>
    </>
  );
}

function ReceiptMock() {
  return (
    <>
      <div className="flex items-center justify-between shrink-0">
        <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-400/30" />
        <span className="text-[7px] uppercase tracking-[0.28em] text-amber-200">Darshan</span>
        <span className="w-6 h-6 flex items-center justify-center text-emerald-400">
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 018 0v3" />
          </svg>
        </span>
      </div>

      <div className="pt-1.5 text-center shrink-0">
        <p className="font-malayalam text-[8.5px] leading-tight text-amber-50">നിങ്ങളുടെ സമർപ്പണം ദൈവം സ്വീകരിച്ചു</p>
        <p className="mt-0.5 text-[5.5px] uppercase tracking-[0.2em] text-amber-200/60">Your Offering Has Been Received</p>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <Mandala className="absolute inset-0 w-full h-full opacity-70" />
          <span className="relative font-om text-2xl text-amber-100">ॐ</span>
        </div>
      </div>

      <div className="space-y-1.5 shrink-0">
        <div className="rounded-xl overflow-hidden border border-amber-400/25 bg-black/40">
          <div className="px-2.5 py-1.5 border-b border-amber-400/15 text-[6.5px] text-amber-100 truncate">
            {SAMPLE.templeName}
          </div>
          <div className="flex items-center justify-between px-2.5 py-1.5">
            <span className="text-[6px] uppercase tracking-[0.18em] text-amber-200/50">Total</span>
            <span className="font-cinzel text-[13px] font-bold text-amber-50">₹{SAMPLE.amount}</span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-1 bg-black/25">
            <span className="text-[5.5px] uppercase tracking-[0.18em] text-amber-200/40">UPI</span>
            <span className="text-[6.5px] text-amber-100/80">{SAMPLE.upiId}</span>
          </div>
        </div>
        <div className="w-full py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-center font-malayalam text-[9px] font-semibold text-stone-950">
          മറ്റൊരു സമർപ്പണം
        </div>
      </div>
    </>
  );
}

const SCREENS = { welcome: WelcomeMock, hundi: HundiMock, receipt: ReceiptMock };

/**
 * Static mock of the donor-facing screens. Per your direction it is intentionally
 * NOT wired to the form fields — it exists so each admin page can show which
 * screen its settings affect. Values are fixed samples.
 */
export default function PhonePreview({ screen = 'welcome', caption }) {
  const Screen = SCREENS[screen] ?? WelcomeMock;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[248px] h-[500px] shrink-0 rounded-[1.75rem] bg-stone-950 border border-amber-400/25 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-stone-950/75" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Mandala className="w-[300px] h-[300px] opacity-50" />
        </div>

        {/* notch */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-1 rounded-full bg-black/50 z-20" />

        <div className="relative h-full flex flex-col p-3.5 gap-2">
          <Screen />
        </div>
      </div>

      <p className="mt-3.5 text-center text-[10px] text-stone-600 max-w-[248px] leading-relaxed">
        {caption ?? 'Static preview · not linked to the fields'}
      </p>
    </div>
  );
}
