import confetti from 'canvas-confetti';

/* Saffron/brass palette so the burst reads as temple marigold, not party confetti. */
const GOLD = ['#fffbeb', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706'];

/**
 * canvas-confetti mounts its own <canvas> on document.body (position: fixed,
 * pointer-events: none, z-index 100), so the burst covers the whole viewport and
 * stays visible across the screen transition no matter what is stacked in the app.
 *
 * `later` is supplied by the caller so it owns the stagger timers and can cancel
 * them on unmount. disableForReducedMotion lets the OS preference suppress it.
 */
export const celebrateOffering = (later) => {
  const base = { colors: GOLD, disableForReducedMotion: true, scalar: 1.05 };
  const fire = (opts) => confetti({ ...base, ...opts });

  fire({ particleCount: 110, spread: 78, startVelocity: 48, origin: { x: 0.5, y: 0.66 } });
  later(
    () => fire({ particleCount: 45, angle: 60, spread: 55, startVelocity: 42, origin: { x: 0.05, y: 0.72 } }),
    170
  );
  later(
    () => fire({ particleCount: 45, angle: 120, spread: 55, startVelocity: 42, origin: { x: 0.95, y: 0.72 } }),
    250
  );
  later(
    () =>
      fire({
        particleCount: 34,
        spread: 130,
        startVelocity: 26,
        scalar: 0.75,
        ticks: 200,
        origin: { x: 0.5, y: 0.42 },
      }),
    470
  );
};
