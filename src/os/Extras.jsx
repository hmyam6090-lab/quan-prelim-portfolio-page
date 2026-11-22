import { useState } from 'react';
import { playSound } from '../game/sound';
import { FAKE_GAMES, GALLERY } from './content/extras';
import { ICONS } from './icons';

const BASE = import.meta.env.BASE_URL;

/** A "launching…" window for one of the botched favourite games. */
export function FakeGame({ id, onClose }) {
  const g = FAKE_GAMES[id];
  const [step, setStep] = useState(0);
  return (
    <div className="fg">
      <img className="fg-icon" src={ICONS[id]} alt="" />
      <div className="fg-text">
        <div className="fg-title">{g.name}</div>
        {g.lines.slice(0, step + 1).map((l) => <p key={l}>{l}</p>)}
        <div className="fg-actions">
          {step < g.lines.length - 1 ? (
            <button className="os-btn primary" onClick={() => { playSound('click'); setStep((s) => s + 1); }}>{g.button}</button>
          ) : (
            <button className="os-btn" onClick={() => { playSound('click'); onClose(); }}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Gallery: thumbnail grid; click one for a big view + caption. */
export function Gallery() {
  const [open, setOpen] = useState(null);
  const item = open !== null ? GALLERY[open] : null;

  if (item) {
    return (
      <div className="gal-view">
        <div className="gal-bar">
          <button className="os-btn" onClick={() => { playSound('click'); setOpen(null); }}>◀ All photos</button>
          <span className="grow" />
          <button className="os-btn" disabled={open === 0} onClick={() => setOpen(open - 1)}>◀</button>
          <span className="gal-count">{open + 1} / {GALLERY.length}</span>
          <button className="os-btn" disabled={open === GALLERY.length - 1} onClick={() => setOpen(open + 1)}>▶</button>
        </div>
        <div className="gal-big"><img src={BASE + item.src} alt={item.title} draggable={false} /></div>
        <div className="gal-caption"><b>{item.title}</b> — {item.desc}</div>
      </div>
    );
  }

  return (
    <div className="gal">
      {GALLERY.map((g, i) => (
        <button key={g.src} className="gal-cell" onClick={() => { playSound('click'); setOpen(i); }}>
          <img src={BASE + g.src} alt="" draggable={false} />
          <span>{g.title}</span>
        </button>
      ))}
    </div>
  );
}
