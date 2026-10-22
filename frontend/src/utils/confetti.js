import confetti from 'canvas-confetti';

/* Saffron, temple marigold, and sacred golden foil palette */
const GOLD_PALETTE = [
  '#fffbeb',
  '#fef08a',
  '#fde68a',
  '#fcd34d',
  '#fbbf24',
  '#f59e0b',
  '#d97706',
  '#ea580c',
];

let confettiWorkerInstance = null;

/**
 * Creates or retrieves a persistent dedicated canvas running physics inside
 * a dedicated Web Worker via OffscreenCanvas.
 * This offloads all particle calculations & canvas drawing from the main UI thread,
 * ensuring silky smooth 60fps/120fps even during heavy React screen transitions.
 */
function getWorkerConfetti() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;

  if (!confettiWorkerInstance) {
    let canvas = document.getElementById('ehundi-confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'ehundi-confetti-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '9999';
      document.body.appendChild(canvas);
    }

    try {
      confettiWorkerInstance = confetti.create(canvas, {
        resize: true,
        useWorker: true,
        disableForReducedMotion: true,
      });
    } catch {
      // Graceful fallback to default instance if OffscreenCanvas/Worker is restricted
      confettiWorkerInstance = confetti;
    }
  }

  return confettiWorkerInstance;
}

/**
 * Highly optimized, multi-phase devotional celebratory golden shower.
 * Uses high-efficiency physics with natural air drag and fluid floating descent.
 */
export const celebrateOffering = (customTimerFn) => {
  const fireInstance = getWorkerConfetti() || confetti;
  const schedule = typeof customTimerFn === 'function' ? customTimerFn : (fn, ms) => setTimeout(fn, ms);

  const sharedDefaults = {
    colors: GOLD_PALETTE,
    disableForReducedMotion: true,
    shapes: ['square', 'circle'],
    decay: 0.93,     // Silky air resistance without jerky stops
    gravity: 0.78,    // Lighter, floating flutter
    ticks: 350,       // Long, continuous graceful descent
  };

  const fire = (opts) => {
    try {
      fireInstance({ ...sharedDefaults, ...opts });
    } catch {
      confetti({ ...sharedDefaults, ...opts });
    }
  };

  // 1. Initial Main Central Eruption
  fire({
    particleCount: 100,
    spread: 85,
    startVelocity: 46,
    scalar: 1.1,
    origin: { x: 0.5, y: 0.65 },
  });

  // 2. Left Temple Arc
  schedule(() => {
    fire({
      particleCount: 50,
      angle: 60,
      spread: 60,
      startVelocity: 44,
      scalar: 1.0,
      origin: { x: 0.05, y: 0.72 },
    });
  }, 120);

  // 3. Right Temple Arc
  schedule(() => {
    fire({
      particleCount: 50,
      angle: 120,
      spread: 60,
      startVelocity: 44,
      scalar: 1.0,
      origin: { x: 0.95, y: 0.72 },
    });
  }, 220);

  // 4. Floating Marigold Petal Canopy from Top
  schedule(() => {
    fire({
      particleCount: 45,
      spread: 140,
      startVelocity: 22,
      gravity: 0.65,
      scalar: 0.9,
      ticks: 380,
      origin: { x: 0.5, y: 0.35 },
    });
  }, 380);
};
