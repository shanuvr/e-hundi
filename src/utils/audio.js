// E-Hundi audio: temple bell, coin dropping into a hundi (onto other coins), banknote sliding in.
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

// short filtered noise burst
const noiseBurst = (t, { type = 'highpass', freq = 4000, q = 0.7, gain = 0.2, dur = 0.01, wet = 0.3 }) => {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.0015);
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

// 🔔 Temple bell
export const playTempleBell = () => {
  try {
    if (!getContext()) return;
    const now = ctx.currentTime;
    const freqs = [440, 880, 1320, 1760, 2640, 3520];
    const gains = [0.4, 0.25, 0.15, 0.08, 0.04, 0.02];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f + rand(-2, 2);
      g.gain.setValueAtTime(gains[i], now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 3.3);
    });
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

// 💵 Banknote: crinkle, slide through the slot, soft landing on the pile
export const playNoteDrop = () => {
  try {
    if (!getContext()) return;
    const now = ctx.currentTime;

    // paper slide (soft swoosh)
    noiseBurst(now, { type: 'bandpass', freq: 3200, q: 0.6, gain: 0.14, dur: 0.28, wet: 0.15 });
    noiseBurst(now + 0.05, { type: 'highpass', freq: 6000, q: 0.5, gain: 0.06, dur: 0.22, wet: 0.1 });

    // crinkle grains (paper creasing)
    const grains = 16;
    for (let i = 0; i < grains; i++) {
      const t = now + rand(0, 0.34);
      noiseBurst(t, {
        type: 'bandpass',
        freq: rand(2500, 8000),
        q: rand(0.7, 1.6),
        gain: rand(0.05, 0.22),
        dur: rand(0.004, 0.014),
        wet: 0.15,
      });
    }

    // soft landing on top of the pile inside the hundi
    const land = now + 0.3;
    noiseBurst(land, { type: 'lowpass', freq: 900, q: 0.7, gain: 0.16, dur: 0.1, wet: 0.5 });
    noiseBurst(land, { type: 'bandpass', freq: 620, q: 5, gain: 0.07, dur: 0.15, wet: 0.6 });
    // a couple of coins shift under the note
    clink(land + 0.03, { freq: rand(2000, 3000), gain: 0.05, decay: 0.08, wet: 0.5 });
  } catch (e) {
    console.error('Note audio error:', e);
  }
};