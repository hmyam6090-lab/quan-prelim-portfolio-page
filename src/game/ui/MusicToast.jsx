import { useEffect, useState } from 'react';
import { TRACKS, useMusic } from '../music';

const SHOW_MS = 4200;

/** Bottom-left "♪ Crazy Tutorial — Playing ♫" pop-up whenever a track starts. */
export default function MusicToast() {
  const toastId = useMusic((s) => s.toastId);
  const index = useMusic((s) => s.index);
  const [hiddenId, setHiddenId] = useState(0);

  useEffect(() => {
    if (!toastId) return undefined;
    const t = setTimeout(() => setHiddenId(toastId), SHOW_MS);
    return () => clearTimeout(t);
  }, [toastId]);

  if (!toastId || hiddenId === toastId) return null;
  const track = TRACKS[index];
  return (
    <div className="music-toast" key={toastId} role="status" aria-live="polite">
      <span className="mt-note" aria-hidden>♪</span>
      <span className="mt-text">
        <b>{track.title}</b> — Playing
        <small>by {track.artist}</small>
      </span>
      <span className="mt-notes" aria-hidden><i>♫</i><i>♪</i><i>♫</i></span>
    </div>
  );
}
