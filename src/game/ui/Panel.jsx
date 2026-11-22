import { useEffect, useRef } from 'react';
import { useGame } from '../store';
import { playSound } from '../sound';

/** Retro window-style modal used by Settings / Credits / Quit. */
export default function Panel({ title, children, className = '', onClose }) {
  const close = useGame((s) => s.closePanel);
  const ref = useRef();
  const doClose = onClose || (() => { playSound('click'); close(); });

  useEffect(() => { ref.current?.focus(); }, []);

  return (
    <div className="panel-backdrop" onPointerDown={(e) => { if (e.target === e.currentTarget) doClose(); }}>
      <div className={`panel ${className}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <div className="panel-title">
          <span>{title}</span>
          <button className="panel-x" onClick={doClose} aria-label="Close">×</button>
        </div>
        <div className="panel-body">{children}</div>
      </div>
    </div>
  );
}
