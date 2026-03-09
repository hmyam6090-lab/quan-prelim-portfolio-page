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
  startup:     './sounds/startup.mp3',
  click:       './sounds/click.mp3',
  login:       './sounds/login.mp3',
  windowOpen:  './sounds/window-open.mp3',
  shutdown:    './sounds/shutdown.mp3',
};

const useSound = (enabled = true) => {
  const audioCache = useRef({});
  const userInteracted = useRef(false);
  const pendingSounds = useRef([]);

  // Mark user interaction to unlock audio
  const unlock = useCallback(() => {
    if (userInteracted.current) return;
    userInteracted.current = true;
    // Play any pending sounds
    pendingSounds.current.forEach(({ name, vol }) => {
      const path = SOUND_PATHS[name];
      if (!path) return;
      try {
        const audio = new Audio(path);
        audio.volume = vol;
        audio.play().catch(() => {});
        audioCache.current[name] = audio;
      } catch {}
    });
    pendingSounds.current = [];
  }, []);

  const play = useCallback((soundName, volume = 0.3) => {
    if (!enabled) return;
    const path = SOUND_PATHS[soundName];
    if (!path) return;

    // If user hasn't interacted yet, queue the sound
    if (!userInteracted.current) {
      pendingSounds.current.push({ name: soundName, vol: Math.min(1, Math.max(0, volume)) });
      return;
    }

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

  return { play, unlock };
};

export default useSound;
