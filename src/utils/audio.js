// E-Hundi audio: temple bell (brass ghanta), coin dropping into a hundi, banknote sliding in.
// Drop-in replacement: same exports (playTempleBell, playCoinDrop, playNoteDrop).
// Call from a user tap (browsers block audio otherwise).

let ctx = null;
let master = null;
let reverbIn = null;
let noiseBuf = null;

const COIN_SOUND_URL = '/sounds/coin-drop.mp3';
let coinRawPromise = null;
let coinBuffer = null;
let coinDecodePromise = null;

export const preloadCoinAudio = () => {
  if (typeof window === 'undefined' || coinRawPromise) return coinRawPromise;
  coinRawPromise = fetch(COIN_SOUND_URL)
    .then((res) => (res.ok ? res.arrayBuffer() : null))
    .catch(() => null);
  return coinRawPromise;
};

const getCoinBuffer = async () => {
  if (coinBuffer) return coinBuffer;
  if (!ctx) return null;
  if (!coinDecodePromise) {
    coinDecodePromise = (async () => {
      const raw = await preloadCoinAudio();
      if (!raw || !ctx) return null;
      // slice(0) so decodeAudioData detaching the buffer never invalidates cached bytes
      coinBuffer = await ctx.decodeAudioData(raw.slice(0));
      return coinBuffer;
    })().catch(() => {
      coinDecodePromise = null;
      return null;
    });
  }
  return coinDecodePromise;
};

const getContext = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  if (!ctx || ctx.state === 'closed') {
    ctx = new AudioCtx();

    // master chain: compressor -> output (prevents clipping when sounds overlap)
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(comp);
    comp.connect(ctx.destination);

    // small metal-box reverb (the inside of the hundi)
    const len = Math.floor(ctx.sampleRate * 0.7);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = ir;
    reverbIn = ctx.createGain();
    reverbIn.gain.value = 0.35;
    reverbIn.connect(conv);
    conv.connect(master);

    // shared white-noise buffer
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    // begin decoding real coin audio as soon as context exists
    getCoinBuffer();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

const rand = (a, b) => a + Math.random() * (b - a);

// short filtered noise burst (attack is configurable so it can also make soft swooshes)
const noiseBurst = (
  t,
  { type = 'highpass', freq = 4000, q = 0.7, gain = 0.2, dur = 0.01, wet = 0.3, attack = 0.0015 }
) => {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f);
  f.connect(g);
  g.connect(master);
  const w = ctx.createGain();
  w.gain.value = wet;
  g.connect(w);
  w.connect(reverbIn);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.02);
};

/*
// clink helper (kept for reference — no longer used now that playNoteDrop is purely papery)
// one metal coin strike: inharmonic partials + impact tick + optional hollow hundi body ring
const clink = (t, { freq, gain, decay, body = false, wet = 0.4 }) => {
  const ratios = [1, 2.32, 4.25, 6.63];
  const amps = [1, 0.55, 0.3, 0.15];
  const out = ctx.createGain(); out.gain.value = gain; out.connect(master);
  const send = ctx.createGain(); send.gain.value = wet; out.connect(send); send.connect(reverbIn);
  ratios.forEach((r, i) => {
    const f = freq * r * rand(0.99, 1.01); if (f > 15000) return;
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = f;
    const d = decay / (1 + i * 0.7);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(amps[i], t + 0.0008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    osc.connect(g); g.connect(out); osc.start(t); osc.stop(t + d + 0.02);
  });
  noiseBurst(t, { type: 'highpass', freq: 5000, gain: gain * 0.5, dur: 0.012, wet: 0.2 });
  if (body) noiseBurst(t, { type: 'bandpass', freq: rand(520, 760), q: 7, gain: gain * 0.9, dur: 0.22, wet: 0.6 });
};
*/

// ---------------------------------------------------------------------------
// 🔔 Temple bell (cast brass ghanta)
// Real bells are inharmonic: partials are NOT whole-number multiples, which is what
// makes it sound like metal instead of a piano/organ. Each partial is doubled with a
// tiny detune so it "beats" (the shimmering wobble of a real bell). Higher partials
// die fast, the fundamental and hum ring long. A bright clapper strike starts it.
// ---------------------------------------------------------------------------
const BELL_BASE = 660; // pitch of the bell (Hz). Lower = bigger bell, higher = smaller bell.
const BELL_STRIKES = 2; // temple bells are usually rung 2 times: ding... ding

// [ratio to base, loudness, ring time in seconds]
const BELL_PARTIALS = [
  [0.5, 0.3, 4.5], // hum tone
  [1.0, 0.6, 5.0], // prime / main note
  [1.19, 0.35, 3.8], // minor-third tierce (gives the bell its colour)
  [1.5, 0.25, 3.2],
  [2.0, 0.4, 3.0], // nominal
  [2.76, 0.35, 2.2],
  [4.07, 0.28, 1.5],
  [5.43, 0.2, 1.0],
  [6.8, 0.14, 0.7],
  [8.93, 0.09, 0.45],
];

const bellStrike = (t, strength) => {
  const out = ctx.createGain();
  out.gain.value = 0.32 * strength;
  out.connect(master);

  // long hall-like tail
  const send = ctx.createGain();
  send.gain.value = 0.5;
  out.connect(send);
  send.connect(reverbIn);

  BELL_PARTIALS.forEach(([ratio, amp, ring]) => {
    const f = BELL_BASE * ratio;
    // two slightly detuned oscillators per partial -> natural beating shimmer
    [-1, 1].forEach((sign) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f + sign * rand(0.8, 2.6);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(amp * 0.5, t + 0.002); // instant metallic attack
      g.gain.exponentialRampToValueAtTime(amp * 0.5 * 0.35, t + 0.08); // quick drop after the hit
      g.gain.exponentialRampToValueAtTime(0.0001, t + ring);
      osc.connect(g);
      g.connect(out);
      osc.start(t);
      osc.stop(t + ring + 0.05);
    });
  });

  // clapper hitting brass: bright "tink" + metallic body knock
  noiseBurst(t, { type: 'highpass', freq: 3500, gain: 0.5 * strength, dur: 0.03, wet: 0.4 });
  noiseBurst(t, { type: 'bandpass', freq: 1800, q: 3, gain: 0.35 * strength, dur: 0.06, wet: 0.4 });
};

export const playTempleBell = () => {
  try {
    if (!getContext()) return;
    const now = ctx.currentTime + 0.01;
    for (let i = 0; i < BELL_STRIKES; i++) {
      bellStrike(now + i * 0.7, i === 0 ? 1 : 0.8);
    }
  } catch (e) {
    console.error('Temple bell audio error:', e);
  }
};

const playCoinSample = (buf, value) => {
  if (!ctx || !master || !buf) return;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  // Subtle pitch shift by coin weight + tiny natural take-to-take variation
  const baseRate =
    value >= 20 ? 0.94 : value >= 10 ? 0.98 : value >= 5 ? 1.0 : value >= 2 ? 1.03 : 1.06;
  src.playbackRate.value = baseRate * rand(0.985, 1.015);

  const gainNode = ctx.createGain();
  gainNode.gain.value = 1.0;

  src.connect(gainNode);
  gainNode.connect(master);
  src.start(ctx.currentTime);
};

// 🪙 Real recorded coin dropping into a brass hundi box (extracted & trimmed from video)
export const playCoinDrop = (value = 10) => {
  try {
    if (!getContext()) return;
    if (coinBuffer) {
      playCoinSample(coinBuffer, value);
      return;
    }
    getCoinBuffer().then((buf) => {
      if (buf) playCoinSample(buf, value);
    });
  } catch (e) {
    console.error('Coin audio error:', e);
  }
};

/*
// Previous synthesized coin-drop implementation (kept commented for reference)
// one metal coin impact: sharp metallic transient + damped circular-disc modes
const coinImpact = (t, { freq, gain, decay, snap = 1, wet = 0.15 }) => {
  // Chladni circular plate ratios (steel / brass coin)
  const ratios = [1, 1.58, 2.27, 3.14, 4.18];
  const amps = [1, 0.72, 0.48, 0.28, 0.14];

  const out = ctx.createGain();
  out.gain.value = gain;
  out.connect(master);

  const send = ctx.createGain();
  send.gain.value = wet;
  out.connect(send);
  send.connect(reverbIn);

  ratios.forEach((r, i) => {
    const f = freq * r * rand(0.988, 1.012);
    if (f > 16500) return;

    const d = Math.max(0.008, decay / (1 + i * 0.95));
    const spawnMode = (modeFreq, modeAmp) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = modeFreq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(modeAmp, t + 0.0005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      osc.connect(g);
      g.connect(out);
      osc.start(t);
      osc.stop(t + d + 0.015);
    };

    spawnMode(f, amps[i]);
    // subtle detuned twin on primary mode for natural coin wobble/shimmer
    if (i === 0 && decay > 0.03) {
      spawnMode(f + rand(12, 26), amps[0] * 0.35);
    }
  });

  // sharp metal-on-metal contact click + high-Q ping transient
  noiseBurst(t, {
    type: 'highpass',
    freq: 4200,
    q: 0.7,
    gain: gain * snap * 0.6,
    dur: 0.007,
    wet: 0.08,
    attack: 0.0004,
  });
  noiseBurst(t, {
    type: 'bandpass',
    freq: Math.min(freq * 1.65, 11000),
    q: 3.5,
    gain: gain * snap * 0.55,
    dur: 0.016,
    wet: 0.12,
    attack: 0.0005,
  });
};

// hollow brass/steel hundi box thud & cavity resonance when a coin lands inside
const hundiBoxHit = (t, weight = 1) => {
  const thud = ctx.createOscillator();
  const thudGain = ctx.createGain();
  thud.type = 'triangle';
  thud.frequency.setValueAtTime(340, t);
  thud.frequency.exponentialRampToValueAtTime(245, t + 0.045);
  thudGain.gain.setValueAtTime(0.0001, t);
  thudGain.gain.linearRampToValueAtTime(0.22 * weight, t + 0.002);
  thudGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.085);
  thud.connect(thudGain);
  thudGain.connect(master);
  thud.start(t);
  thud.stop(t + 0.1);

  const cavity = ctx.createOscillator();
  const cavGain = ctx.createGain();
  cavity.type = 'sine';
  cavity.frequency.value = rand(590, 660);
  cavGain.gain.setValueAtTime(0.0001, t);
  cavGain.gain.linearRampToValueAtTime(0.13 * weight, t + 0.003);
  cavGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
  cavity.connect(cavGain);
  cavGain.connect(master);
  cavity.start(t);
  cavity.stop(t + 0.12);

  noiseBurst(t, {
    type: 'bandpass',
    freq: rand(760, 960),
    q: 8,
    gain: 0.32 * weight,
    dur: 0.14,
    wet: 0.18,
  });
  noiseBurst(t, {
    type: 'bandpass',
    freq: rand(1500, 1900),
    q: 5,
    gain: 0.16 * weight,
    dur: 0.08,
    wet: 0.15,
  });
};

// 🪙 Coin falls through hundi slot, hits the coin pile inside, bounces and chatters to rest
// value (optional): 1, 2, 5, 10, 20 ... heavier coins ring lower with more box thud
export const playCoinDrop = (value = 10) => {
  try {
    if (!getContext()) return;
    const now = ctx.currentTime + 0.005;

    const pitch =
      value >= 20 ? 0.84 : value >= 10 ? 0.89 : value >= 5 ? 0.96 : value >= 2 ? 1.04 : 1.1;
    const bodyWeight =
      value >= 20 ? 1.08 : value >= 10 ? 1.0 : value >= 5 ? 0.92 : value >= 2 ? 0.8 : 0.72;

    // coin grazing the brass/steel slot lip as it enters
    noiseBurst(now, {
      type: 'bandpass',
      freq: rand(3800, 4800),
      q: 3.5,
      gain: 0.14,
      dur: 0.016,
      wet: 0.08,
      attack: 0.001,
    });
    noiseBurst(now + 0.007, {
      type: 'bandpass',
      freq: 2900,
      q: 1.5,
      gain: 0.07,
      dur: 0.032,
      wet: 0.08,
      attack: 0.004,
    });

    // main landing onto the coin pile inside the hollow hundi (~68ms drop)
    let t = now + 0.068;
    const baseFreq = rand(3950, 4500) * pitch;

    hundiBoxHit(t, bodyWeight);
    coinImpact(t, { freq: baseFreq, gain: 0.65, decay: 0.085, snap: 1.0, wet: 0.16 });

    // neighboring coins in the pile shift & clink
    coinImpact(t + 0.004, {
      freq: rand(3100, 3800) * pitch,
      gain: 0.34,
      decay: 0.055,
      snap: 0.85,
      wet: 0.18,
    });
    coinImpact(t + 0.011, {
      freq: rand(4800, 5800) * pitch,
      gain: 0.24,
      decay: 0.042,
      snap: 0.75,
      wet: 0.15,
    });

    // primary rebounds inside the box
    const bounces = [
      { gap: rand(0.072, 0.092), gain: 0.44, decay: 0.062, snap: 0.9, box: true },
      { gap: rand(0.042, 0.056), gain: 0.3, decay: 0.046, snap: 0.8, box: false },
      { gap: rand(0.025, 0.034), gain: 0.2, decay: 0.034, snap: 0.7, box: false },
    ];

    bounces.forEach((b, idx) => {
      t += b.gap;
      coinImpact(t, {
        freq: baseFreq * rand(1.02, 1.18),
        gain: b.gain,
        decay: b.decay,
        snap: b.snap,
        wet: 0.14,
      });
      if (idx === 0) {
        coinImpact(t + 0.005, {
          freq: rand(3400, 4600) * pitch,
          gain: 0.18,
          decay: 0.035,
          snap: 0.7,
          wet: 0.14,
        });
      }
      if (b.box) {
        noiseBurst(t, {
          type: 'bandpass',
          freq: rand(780, 940),
          q: 7,
          gain: 0.12 * bodyWeight,
          dur: 0.08,
          wet: 0.15,
        });
      }
    });

    // rapid spin-down wobble chatter as the coin settles flat onto the pile
    const chatters = [
      { gap: 0.017, gain: 0.15, decay: 0.024, shift: 1.04 },
      { gap: 0.012, gain: 0.105, decay: 0.018, shift: 1.08 },
      { gap: 0.0085, gain: 0.07, decay: 0.013, shift: 1.12 },
      { gap: 0.0065, gain: 0.045, decay: 0.009, shift: 1.16 },
    ];

    chatters.forEach((c) => {
      t += c.gap * rand(0.88, 1.12);
      coinImpact(t, {
        freq: baseFreq * c.shift * rand(0.97, 1.03),
        gain: c.gain,
        decay: c.decay,
        snap: 0.65,
        wet: 0.1,
      });
    });

    // final tiny pile shift
    coinImpact(t + rand(0.022, 0.038), {
      freq: rand(3500, 4800) * pitch,
      gain: 0.06,
      decay: 0.025,
      snap: 0.5,
      wet: 0.12,
    });
  } catch (e) {
    console.error('Coin audio error:', e);
  }
};
*/

// softPaper: white noise passed through a double lowpass (24 dB/oct wall at 1200 Hz)
// then a gentle bandpass peak — sounds like matte paper fibres, never metallic or hissy.
// Dry only: no reverb send (reverb is tuned for brass hundi, makes paper sound metallic).
const softPaper = (t, { peakHz = 350, q = 0.45, gain = 0.35, dur = 0.09, attack = 0.008 }) => {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;

  // LP1 + LP2 in series = 24 dB/oct — virtually eliminates everything above 1200 Hz
  const lp1 = ctx.createBiquadFilter();
  lp1.type = 'lowpass';
  lp1.frequency.value = 1200;
  lp1.Q.value = 0.1;

  const lp2 = ctx.createBiquadFilter();
  lp2.type = 'lowpass';
  lp2.frequency.value = 1200;
  lp2.Q.value = 0.1;

  // gentle bandpass to place the warm papery body peak
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = peakHz;
  bp.Q.value = q;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  src.connect(lp1);
  lp1.connect(lp2);
  lp2.connect(bp);
  bp.connect(g);
  g.connect(master); // dry only

  src.start(t, Math.random() * 0.4);
  src.stop(t + dur + 0.03);
};

// 💵 Banknote sliding into hundi — purely papery, soft, low-frequency body sound.
// All energy is 130–850 Hz. No reverb. No oscillators. Nothing above 1200 Hz.
export const playNoteDrop = () => {
  try {
    if (!getContext()) return;
    const now = ctx.currentTime + 0.008;

    // 1. Quick paper flex as fingers release the note — very low, brief body thump
    softPaper(now, { peakHz: rand(200, 300), q: 0.40, gain: 0.38, dur: 0.028, attack: 0.003 });
    softPaper(now + 0.005, { peakHz: rand(380, 480), q: 0.50, gain: 0.22, dur: 0.020, attack: 0.002 });

    // 2. Note gliding through the slot — warm, body-heavy whoosh, rises then fades
    const slideDur = rand(0.095, 0.130);
    softPaper(now + 0.018, {
      peakHz: rand(300, 440),
      q: 0.48,
      gain: 0.55,
      dur: slideDur,
      attack: 0.016,
    });
    // Faint upper warmth layer — still below 1200 Hz cutoff
    softPaper(now + 0.025, {
      peakHz: rand(600, 850),
      q: 0.40,
      gain: 0.18,
      dur: slideDur * 0.8,
      attack: 0.022,
    });

    // 3. Soft muted landing — note falls onto the coin pile inside the box
    const land = now + 0.018 + slideDur + rand(0.040, 0.058);
    softPaper(land, { peakHz: rand(130, 200), q: 0.38, gain: 0.30, dur: 0.070, attack: 0.005 });
    softPaper(land + 0.010, { peakHz: rand(300, 420), q: 0.42, gain: 0.18, dur: 0.052, attack: 0.007 });
    softPaper(land + 0.025, { peakHz: rand(500, 700), q: 0.40, gain: 0.10, dur: 0.035, attack: 0.005 });
  } catch (e) {
    console.error('Note audio error:', e);
  }
};

/*
// Previous playNoteDrop / paperLayer implementations (kept for reference)
//
// paperLayer — single LP at 3200 Hz (too shallow, still hissy): replaced by softPaper
// playNoteDrop v1 — clink() calls caused metallic ring
// playNoteDrop v2 — paperLayer with energy up to 1700 Hz, still felt metallic
// playNoteDrop v3 — softPaper introduced (this version)
*/