import { MONEY } from '../data/money';

const ASSETS_TO_PRELOAD = [
  '/bg.jpg',
  ...Object.values(MONEY).map((m) => m.src),
];

let hasPreloaded = false;

/**
 * Asynchronously preloads and decodes all images into GPU memory
 * during the First Screen (Welcome screen) so that Screen 2 (Hundi)
 * and Screen 3 (Darshan) open instantly with zero layout shift or texture pop-in.
 */
export const preloadAssets = () => {
  if (hasPreloaded || typeof window === 'undefined') return;
  hasPreloaded = true;

  // Defer preloading slightly so the welcome screen 120fps entrance animation finishes first
  const schedulePreload = () => {
    let index = 0;
    const preloadNext = () => {
      if (index >= ASSETS_TO_PRELOAD.length) return;
      const src = ASSETS_TO_PRELOAD[index++];
      const img = new Image();
      img.src = src;
      if ('decode' in img) {
        img.decode()
          .catch(() => {})
          .finally(() => {
            // Load subsequent assets with slight pacing to keep 120fps frame budget free
            if ('requestIdleCallback' in window) {
              window.requestIdleCallback(preloadNext, { timeout: 400 });
            } else {
              setTimeout(preloadNext, 30);
            }
          });
      } else {
        setTimeout(preloadNext, 30);
      }
    };

    preloadNext();
  };

  // Wait 400ms after initial mount before starting asset ingestion
  setTimeout(() => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(schedulePreload, { timeout: 1500 });
    } else {
      setTimeout(schedulePreload, 200);
    }
  }, 400);
};
