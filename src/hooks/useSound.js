import { useCallback, useRef } from 'react';

/**
 * Sound Effects System for QuanOS
 *
 * HOW TO ADD YOUR OWN SOUNDS:
 * 1. Place .mp3 files in /public/sounds/
 * 2. You only need two files:
 *    - startup.mp3  (plays on boot)
 *    - click.mp3    (plays on all UI interactions)
 */

const SOUND_PATHS = {
  startup: './sounds/startup.mp3',
  click:   './sounds/click.mp3',
};

const useSound = (enabled = true) => {
  const audioCache = useRef({});

  const play = useCallback((soundName, volume = 0.3) => {
    if (!enabled) return;
    const path = SOUND_PATHS[soundName];
    if (!path) return;
    try {
      if (!audioCache.current[soundName]) {
        audioCache.current[soundName] = new Audio(path);
      }
      const audio = audioCache.current[soundName];
      audio.volume = Math.min(1, Math.max(0, volume));
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {
      // Audio not supported or file missing
    }
  }, [enabled]);

  return { play };
};

export default useSound;
