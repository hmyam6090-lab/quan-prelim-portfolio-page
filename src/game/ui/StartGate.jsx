import { useEffect, useState } from 'react';
import { getAudioCtx } from '../audioCtx';
import { musicAudible, startMusic } from '../music';
import { playSound } from '../sound';

/*
 * "PRESS START" screen shown right after loading — only when the browser blocked audio.
 * Browsers only allow sound after a user gesture, so this one click/key unlocks the music
 * and it starts playing the moment the menu appears. If autoplay already worked, the gate
 * never shows.
 */
export default function StartGate({ ready }) {
  const [state, setState] = useState('waiting');   // waiting -> open -> gone

  useEffect(() => {
    if (!ready) return undefined;
    startMusic();                                    // try real autoplay first
    const t = setTimeout(() => setState(musicAudible() ? 'gone' : 'open'), 700);
    return () => clearTimeout(t);
  }, [ready]);

  useEffect(() => {
    if (state !== 'open') return undefined;
    const go = (e) => {
      e.preventDefault();
      e.stopPropagation();
      getAudioCtx();
      startMusic();
      playSound('login');
      setState('gone');
    };
    window.addEventListener('pointerdown', go, { capture: true });
    window.addEventListener('keydown', go, { capture: true });
    return () => {
      window.removeEventListener('pointerdown', go, { capture: true });
      window.removeEventListener('keydown', go, { capture: true });
    };
  }, [state]);

  if (state !== 'open') return null;
  return (
    <div className="start-gate" role="button" tabIndex={0} aria-label="Click to start with sound">
      <div className="start-gate-text">
        CLICK ANYWHERE TO START <span aria-hidden>♪</span>
        <small>sound on</small>
      </div>
    </div>
  );
}
