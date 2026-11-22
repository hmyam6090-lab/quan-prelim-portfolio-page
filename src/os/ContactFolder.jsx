import { useState } from 'react';
import { playSound } from '../game/sound';
import { CONTACTS } from './content/portfolio';
import { ICONS } from './icons';

/** "Contact Me" folder: one row per contact with Open / Copy. */
export default function ContactFolder() {
  const [copied, setCopied] = useState(null);

  const copy = async (item) => {
    playSound('click');
    try {
      await navigator.clipboard.writeText(item.value);
      setCopied(item.id);
      setTimeout(() => setCopied((c) => (c === item.id ? null : c)), 1400);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className="cf">
      <div className="cf-head">
        <img src={ICONS.mail} alt="" />
        <div>
          <div className="cf-title">Get in touch</div>
          <p>{CONTACTS.blurb}</p>
        </div>
      </div>
      <ul className="cf-list">
        {CONTACTS.items.map((it) => (
          <li key={it.id} className="cf-row">
            <img src={ICONS[it.icon]} alt="" />
            <div className="cf-text">
              <span className="cf-label">{it.label}</span>
              <span className="cf-value">{it.value}</span>
            </div>
            {it.copy && (
              <button className="os-btn cf-btn" onClick={() => copy(it)}>{copied === it.id ? 'Copied!' : 'Copy'}</button>
            )}
            <a className="os-btn primary cf-btn" href={it.href} target="_blank" rel="noopener noreferrer"
              onClick={() => playSound('click')}>
              Open
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
