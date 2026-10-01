// Devotional Temple Audio Synthesizer (Bell, Metallic Coins, Crisp Banknotes) using Web Audio API

let sharedContext = null;

const getContext = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedContext || sharedContext.state === 'closed') {
    sharedContext = new AudioCtx();
  }
  if (sharedContext.state === 'suspended') {
    sharedContext.resume();
  }
  return sharedContext;
};

// 🔔 1. Rich Brass Temple Bell
export const playTempleBell = () => {
  try {
    const ctx = getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const frequencies = [440, 880, 1320, 1760, 2640, 3520];
    const gains = [0.4, 0.25, 0.15, 0.08, 0.04, 0.02];

    const bus = ctx.createGain();
    bus.gain.setValueAtTime(0.9, now);
    bus.connect(ctx.destination);

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() * 4 - 2), now);

      gainNode.gain.setValueAtTime(gains[idx], now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gainNode);
      gainNode.connect(bus);

      osc.start(now);
      osc.stop(now + 3.3);
    });
  } catch (err) {
    console.error("Temple bell audio error:", err);
  }
};

// 🪙 2. Realistic Metallic Coin "Clink & Settle" Sound
export const playCoinDrop = () => {
  try {
    const ctx = getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const mainBus = ctx.createGain();
    mainBus.gain.setValueAtTime(0.85, now);
    mainBus.connect(ctx.destination);

    // Primary metallic clink frequencies (high brass resonant pings)
    const coinFrequencies = [3400, 4800, 2150, 1420];
    const coinGains = [0.45, 0.25, 0.35, 0.2];
    const decayTimes = [0.18, 0.12, 0.28, 0.35];

    coinFrequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(coinGains[i], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decayTimes[i]);

      osc.connect(gain);
      gain.connect(mainBus);

      osc.start(now);
      osc.stop(now + decayTimes[i] + 0.05);
    });

    // Secondary subtle bounce (simulates coin hitting bottom coins 45ms later)
    const bounceTime = now + 0.048;
    const bounceOsc = ctx.createOscillator();
    const bounceGain = ctx.createGain();

    bounceOsc.type = 'triangle';
    bounceOsc.frequency.setValueAtTime(3900, bounceTime);

    bounceGain.gain.setValueAtTime(0.3, bounceTime);
    bounceGain.gain.exponentialRampToValueAtTime(0.0001, bounceTime + 0.14);

    bounceOsc.connect(bounceGain);
    bounceGain.connect(mainBus);

    bounceOsc.start(bounceTime);
    bounceOsc.stop(bounceTime + 0.15);

    // Sharp metallic impact click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(5200, now);
    clickOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.025);

    clickGain.gain.setValueAtTime(0.2, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    clickOsc.connect(clickGain);
    clickGain.connect(mainBus);

    clickOsc.start(now);
    clickOsc.stop(now + 0.03);

  } catch (err) {
    console.error("Coin audio error:", err);
  }
};

// 💵 3. Realistic Banknote Paper "Rustle & Slide" Sound
export const playNoteDrop = () => {
  try {
    const ctx = getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.22;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate textured paper friction noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Bandpass filter to simulate crisp banknote paper frequency range
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2800, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + duration);
    filter.Q.setValueAtTime(2.2, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration + 0.02);

    // Soft low-end banknote insertion thump
    const flapOsc = ctx.createOscillator();
    const flapGain = ctx.createGain();
    flapOsc.type = 'sine';
    flapOsc.frequency.setValueAtTime(320, now + 0.02);
    flapOsc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

    flapGain.gain.setValueAtTime(0.18, now + 0.02);
    flapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    flapOsc.connect(flapGain);
    flapGain.connect(ctx.destination);

    flapOsc.start(now + 0.02);
    flapOsc.stop(now + 0.12);

  } catch (err) {
    console.error("Note audio error:", err);
  }
};