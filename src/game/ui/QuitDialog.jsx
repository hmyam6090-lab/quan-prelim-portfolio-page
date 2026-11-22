import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../store';
import { playPop, playSound } from '../sound';
import Panel from './Panel';

const TAUNTS = [
  'Are you sure you want to quit?',
  'Nope.',
  'Too slow!',
  'Nice try.',
  'The YES button has commitment issues.',
  'You can check out any time you like…',
  '…but you can never leave.',
  'Just look at the portfolio, it\'s good, I promise.',
  'Okay this is getting embarrassing.',
  'Have you considered pressing NO?',
];

const DODGE_RADIUS = 95;   // px from the YES centre that triggers a dodge
const DODGE_COOLDOWN = 260; // ms: one dodge (and one pop) per approach, no sfx spam

/** QUIT joke: the YES button physically avoids the pointer (and touch, and keyboard). */
export default function QuitDialog() {
  const close = useGame((s) => s.closePanel);
  const arena = useRef(null);
  const yes = useRef(null);
  const [pos, setPos] = useState({ x: 0.22, y: 0.5 });   // fractions of the arena
  const [dodges, setDodges] = useState(0);
  const lastDodge = useRef(0);

  const dodge = useCallback((px, py) => {
    const now = performance.now();
    if (now - lastDodge.current < DODGE_COOLDOWN) return;
    lastDodge.current = now;
    const a = arena.current?.getBoundingClientRect();
    const b = yes.current?.getBoundingClientRect();
    if (!a || !b) return;
    // pick the candidate spot farthest from the pointer (and from where it is now)
    let best = null;
    let bestScore = -1;
    for (let i = 0; i < 14; i++) {
      const fx = 0.1 + Math.random() * 0.8;
      const fy = 0.15 + Math.random() * 0.7;
      const cx = a.left + fx * a.width;
      const cy = a.top + fy * a.height;
      const score = Math.hypot(cx - px, cy - py) + 0.3 * Math.hypot(cx - (b.left + b.width / 2), cy - (b.top + b.height / 2));
      if (score > bestScore) { bestScore = score; best = { x: fx, y: fy }; }
    }
    setPos(best);
    setDodges((d) => d + 1);
    playPop();
  }, []);

  const onMove = (e) => {
    const b = yes.current?.getBoundingClientRect();
    if (!b) return;
    const d = Math.hypot(e.clientX - (b.left + b.width / 2), e.clientY - (b.top + b.height / 2));
    if (d < DODGE_RADIUS) dodge(e.clientX, e.clientY);
  };

  // keyboard users can't press it either
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const b = yes.current.getBoundingClientRect();
      dodge(b.left + b.width / 2, b.top + b.height / 2);
    }
  };

  useEffect(() => { playSound('click'); }, []);

  const shrink = Math.max(0.55, 1 - Math.max(0, dodges - 4) * 0.06);
  const taunt = TAUNTS[Math.min(dodges, TAUNTS.length - 1)];

  return (
    <Panel title="QUIT?" className="quit-panel">
      <p className="quit-taunt" aria-live="polite">{taunt}</p>
      <div className="quit-arena" ref={arena} onPointerMove={onMove}>
        <button
          ref={yes}
          className="btn yes-btn"
          style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, transform: `translate(-50%, -50%) scale(${shrink})` }}
          onPointerEnter={(e) => dodge(e.clientX, e.clientY)}
          onPointerDown={(e) => { e.preventDefault(); dodge(e.clientX, e.clientY); }}
          onTouchStart={(e) => { const t = e.touches[0]; dodge(t.clientX, t.clientY); }}
          onKeyDown={onKey}
          onClick={(e) => { e.preventDefault(); dodge(e.clientX, e.clientY); }}
        >
          YES
        </button>
        <button className="btn primary no-btn" onClick={() => { playSound('click'); close(); }}>
          {dodges >= 6 ? 'Fine, I\'ll stay' : 'NO'}
        </button>
      </div>
    </Panel>
  );
}
