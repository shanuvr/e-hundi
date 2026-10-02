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

  // Use requestIdleCallback or immediate execution to preload without blocking the initial render
  const runPreload = () => {
    ASSETS_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      img.src = src;
      // img.decode() forces the browser to decompress the image into GPU texture ahead of time
      if ('decode' in img) {
        img.decode().catch(() => {
          // Ignore decode errors for fallback
        });
      }
    });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(runPreload, { timeout: 1000 });
  } else {
    setTimeout(runPreload, 100);
  }
};
