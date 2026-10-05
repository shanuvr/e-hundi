// E-Hundi audio: temple bell (brass ghanta), coin dropping into a hundi, banknote sliding in.
// Drop-in replacement: same exports (playTempleBell, playCoinDrop, playNoteDrop).
// Call from a user tap (browsers block audio otherwise).

let ctx = null;
let master = null;
let reverbIn = null;
let noiseBuf = null;

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

// one metal coin strike: inharmonic partials + impact tick + optional hollow hundi body ring
const clink = (t, { freq, gain, decay, body = false, wet = 0.4 }) => {
  const ratios = [1, 2.32, 4.25, 6.63];
  const amps = [1, 0.55, 0.3, 0.15];

  const out = ctx.createGain();
  out.gain.value = gain;
  out.connect(master);
  const send = ctx.createGain();
  send.gain.value = wet;
  out.connect(send);
  send.connect(reverbIn);

  ratios.forEach((r, i) => {
    const f = freq * r * rand(0.99, 1.01);
    if (f > 15000) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = f;
    const d = decay / (1 + i * 0.7);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(amps[i], t + 0.0008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    osc.connect(g);
    g.connect(out);
    osc.start(t);
    osc.stop(t + d + 0.02);
  });

  // sharp metal-on-metal tick
  noiseBurst(t, { type: 'highpass', freq: 5000, gain: gain * 0.5, dur: 0.012, wet: 0.2 });

  // hollow metal box resonance
  if (body) {
    noiseBurst(t, { type: 'bandpass', freq: rand(520, 760), q: 7, gain: gain * 0.9, dur: 0.22, wet: 0.6 });
  }
};

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

// 🪙 Coin falls into hundi, hits the coins already inside, bounces and settles
// value (optional): 10, 20, 50 ... heavier coins ring lower
export const playCoinDrop = (value = 10) => {
  try {
    if (!getContext()) return;
    const now = ctx.currentTime;
    const pitch = value >= 50 ? 0.85 : value >= 20 ? 0.95 : 1;

    // tiny slide down the slot
    noiseBurst(now, { type: 'bandpass', freq: 2500, q: 1.2, gain: 0.05, dur: 0.07, wet: 0.2 });

    // main impact on the pile (after ~90ms fall)
    let t = now + 0.09;
    clink(t, { freq: rand(2700, 3300) * pitch, gain: 0.5, decay: 0.28, body: true });
    // other coins in the pile get hit and ring lower
    clink(t + 0.004, { freq: rand(1900, 2400) * pitch, gain: 0.3, decay: 0.35, wet: 0.5 });
    clink(t + 0.011, { freq: rand(3600, 4400), gain: 0.22, decay: 0.2 });

    // bounces: shrinking gaps, shrinking volume
    let gap = 0.085;
    for (let i = 0; i < 5; i++) {
      t += gap * rand(0.7, 1.1);
      gap *= 0.68;
      clink(t, {
        freq: rand(2300, 4600) * pitch,
        gain: 0.34 * Math.pow(0.68, i),
        decay: 0.16,
        body: i < 2,
      });
    }

    // settling rattle among the pile
    for (let i = 0; i < 5; i++) {
      t += rand(0.025, 0.07);
      clink(t, {
        freq: rand(1800, 5800),
        gain: rand(0.05, 0.12),
        decay: rand(0.05, 0.12),
        wet: 0.5,
      });
    }
  } catch (e) {
    console.error('Coin audio error:', e);
  }
};

// 💵 Banknote: crisp paper flick, swoosh through the slot, crinkle, soft landing on the pile
// Rebuilt to be clearly audible on phone speakers: energy sits in the 1.5-6 kHz range
// (small speakers can't reproduce deep lows) and the swoosh now has a real attack/decay
// envelope instead of an instant fade.
export const playNoteDrop = () => {
  try {
    if (!getContext()) return;
    const now = ctx.currentTime + 0.01;

    // initial paper flick
    noiseBurst(now, { type: 'bandpass', freq: 4500, q: 0.8, gain: 0.7, dur: 0.05, wet: 0.15 });

    // main swoosh of the note sliding through the slot (rises then fades)
    noiseBurst(now + 0.02, {
      type: 'bandpass', freq: 2600, q: 0.7, gain: 0.55, dur: 0.34, wet: 0.2, attack: 0.1,
    });
    noiseBurst(now + 0.04, {
      type: 'highpass', freq: 5500, q: 0.5, gain: 0.3, dur: 0.3, wet: 0.15, attack: 0.12,
    });

    // crinkle grains (paper creasing)
    for (let i = 0; i < 20; i++) {
      const t = now + rand(0.02, 0.38);
      noiseBurst(t, {
        type: 'bandpass',
        freq: rand(2000, 7000),
        q: rand(0.8, 2),
        gain: rand(0.25, 0.6),
        dur: rand(0.006, 0.018),
        wet: 0.15,
      });
    }

    // soft landing on the pile: mid-range "pap" (audible on small speakers) + hollow box ring
    const land = now + 0.36;
    noiseBurst(land, { type: 'bandpass', freq: 1100, q: 1.2, gain: 0.6, dur: 0.12, wet: 0.5 });
    noiseBurst(land, { type: 'bandpass', freq: 650, q: 5, gain: 0.3, dur: 0.18, wet: 0.6 });
    noiseBurst(land, { type: 'highpass', freq: 3500, gain: 0.25, dur: 0.05, wet: 0.3 });
    // a couple of coins shift under the note
    clink(land + 0.03, { freq: rand(2000, 3000), gain: 0.12, decay: 0.1, wet: 0.5 });
    clink(land + 0.07, { freq: rand(2400, 3600), gain: 0.08, decay: 0.08, wet: 0.5 });
  } catch (e) {
    console.error('Note audio error:', e);
  }
};