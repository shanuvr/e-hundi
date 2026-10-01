// Devotional Temple Bell sound generator using Web Audio API

let sharedContext = null;

// Browsers cap how many AudioContexts a page may hold (Chrome around 6), and a
// visitor ringing the bell repeatedly would exhaust them fast. One shared
// context also means audio only has to be unlocked once.
//
// Must only be called from a user gesture: creating or resuming an
// AudioContext outside one is blocked by the autoplay policy and leaves the
// context suspended, so the first strike would be silent.
const getContext = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedContext || sharedContext.state === 'closed') {
    sharedContext = new AudioCtx();
  }
  if (sharedContext.state === 'suspended') sharedContext.resume();
  return sharedContext;
};

export const playTempleBell = () => {
  try {
    const ctx = getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonic frequencies for rich brass temple bell tone
    const frequencies = [440, 880, 1320, 1760, 2640, 3520];
    const gains = [0.4, 0.25, 0.15, 0.08, 0.04, 0.02];

    const bus = ctx.createGain();
    // Taper each strike so overlapping taps do not clip into harshness
    bus.gain.setValueAtTime(0.9, now);
    bus.connect(ctx.destination);

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() * 4 - 2), now);

      gainNode.gain.setValueAtTime(gains[idx], now);
      // Bell decay envelope
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gainNode);
      gainNode.connect(bus);

      osc.start(now);
      osc.stop(now + 3.3);
    });
  } catch (err) {
    console.error("Audio error:", err);
  }
};