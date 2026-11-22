import { useRef } from 'react';
import { ICONS } from './icons';

/** Draggable retro window. Positions are in QuanOS pixels (the DOM is CSS-3D scaled,
 *  so pointer deltas are divided by the on-screen scale). */
export default function Window({ win, active, onFocus, onClose, onMinimize, onMove, children, icon, bodyClass = '' }) {
  const drag = useRef(null);

  const down = (e) => {
    if (e.button !== 0 || e.target.closest('.win-buttons')) return;
    const root = e.currentTarget.closest('.quanos');
    const scale = root.getBoundingClientRect().width / root.offsetWidth || 1;
    drag.current = { sx: e.clientX, sy: e.clientY, x: win.x, y: win.y, scale };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    const d = drag.current;
    if (!d) return;
    const x = Math.round(d.x + (e.clientX - d.sx) / d.scale);
    const y = Math.round(d.y + (e.clientY - d.sy) / d.scale);
    onMove(win.id, Math.max(-win.w + 80, Math.min(1024 - 80, x)), Math.max(0, Math.min(768 - 72, y)));
  };
  const up = () => { drag.current = null; };

  return (
    <section
      className={`win os-window ${active ? 'active' : ''}`}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z, display: win.min ? 'none' : undefined }}
      onPointerDown={() => onFocus(win.id)}
      aria-label={win.title}
    >
      <div className="win-titlebar" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <span className="win-title">
          {icon && <img src={ICONS[icon]} alt="" className="win-icon" />}
          {win.title}
        </span>
        <span className="win-buttons">
          {onMinimize && <button className="wb-min" aria-label="Minimize" onClick={() => onMinimize(win.id)} />}
          <button className="wb-max" aria-hidden tabIndex={-1} />
          <button className="wb-x" aria-label="Close" onClick={() => onClose(win.id)} />
        </span>
      </div>
      <div className={`win-body ${bodyClass}`}>{children}</div>
    </section>
  );
}
