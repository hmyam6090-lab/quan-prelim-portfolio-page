import './DesktopIcon.css';

const DesktopIcon = ({ label, iconType, onDoubleClick, isInteractive = true }) => {
  // Clean, bigger XP-style icon SVGs
  const iconSvgs = {
    folder: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M4 14h56v38c0 2-1 3-3 3H7c-2 0-3-1-3-3V14z" fill="#4FC3F7"/>
      <path d="M4 14h56v4H4z" fill="#29B6F6"/>
      <path d="M4 14V11c0-2 1-3 3-3h16l5 6H4z" fill="#29B6F6"/>
      <path d="M6 18h52v33c0 1.5-1 2.5-2.5 2.5h-47C7 53.5 6 52.5 6 51V18z" fill="#4FC3F7"/>
      <path d="M6 18h52v3H6z" fill="rgba(255,255,255,0.3)"/>
      <rect x="24" y="35" width="16" height="3" rx="1" fill="rgba(255,255,255,0.5)"/>
    </svg>`)}`,
    
    'folder-small': `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M4 14h56v38c0 2-1 3-3 3H7c-2 0-3-1-3-3V14z" fill="#4FC3F7"/>
      <path d="M4 14h56v4H4z" fill="#29B6F6"/>
      <path d="M4 14V11c0-2 1-3 3-3h16l5 6H4z" fill="#29B6F6"/>
      <path d="M6 18h52v33c0 1.5-1 2.5-2.5 2.5h-47C7 53.5 6 52.5 6 51V18z" fill="#4FC3F7"/>
      <path d="M6 18h52v3H6z" fill="rgba(255,255,255,0.3)"/>
    </svg>`)}`,

    pdf: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M12 4h28l12 12v40c0 2-1.5 3.5-3.5 3.5h-37C9.5 59.5 8 58 8 56V8c0-2 2-4 4-4z" fill="#fff" stroke="#ccc" stroke-width="1"/>
      <path d="M40 4v12h12" fill="#f0f0f0" stroke="#ccc" stroke-width="1"/>
      <rect x="16" y="26" width="32" height="4" rx="1" fill="#ddd"/>
      <rect x="16" y="34" width="24" height="4" rx="1" fill="#ddd"/>
      <rect x="16" y="42" width="28" height="4" rx="1" fill="#ddd"/>
      <rect x="14" y="14" width="20" height="8" rx="2" fill="#E53935"/>
      <text x="16" y="21" font-size="7" font-family="Arial,sans-serif" font-weight="bold" fill="#fff">PDF</text>
    </svg>`)}`,

    mail: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect x="4" y="14" width="56" height="36" rx="3" fill="#fff" stroke="#bbb" stroke-width="1.5"/>
      <path d="M4 17l28 18 28-18" fill="none" stroke="#4A90D9" stroke-width="2"/>
      <path d="M4 50l20-16" fill="none" stroke="#ddd" stroke-width="1.5"/>
      <path d="M60 50l-20-16" fill="none" stroke="#ddd" stroke-width="1.5"/>
      <rect x="4" y="14" width="56" height="6" rx="3" fill="#4A90D9"/>
    </svg>`)}`,

    video: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect x="8" y="6" width="48" height="52" rx="3" fill="#1a1a1a" stroke="#333" stroke-width="1.5"/>
      <rect x="12" y="14" width="40" height="28" rx="1" fill="#2a2a2a"/>
      <polygon points="28,22 28,38 40,30" fill="#fff" opacity="0.7"/>
      <rect x="12" y="46" width="16" height="3" rx="1" fill="#555"/>
      <rect x="12" y="51" width="10" height="2" rx="1" fill="#444"/>
      <rect x="14" y="8" width="6" height="3" rx="1" fill="#333"/>
      <rect x="22" y="8" width="6" height="3" rx="1" fill="#333"/>
    </svg>`)}`,

    image: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect x="6" y="6" width="52" height="52" rx="3" fill="#fff" stroke="#ccc" stroke-width="1.5"/>
      <rect x="10" y="10" width="44" height="36" rx="1" fill="#f5f5f5"/>
      <circle cx="22" cy="22" r="5" fill="#FFD54F"/>
      <path d="M10 40l12-10 8 6 10-8 14 12v6H10z" fill="#81C784"/>
      <path d="M30 36l10-8 14 12v6H30z" fill="#66BB6A"/>
      <rect x="14" y="50" width="20" height="3" rx="1" fill="#ddd"/>
    </svg>`)}`,

    document: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M12 4h28l12 12v40c0 2-1.5 3.5-3.5 3.5h-37C9.5 59.5 8 58 8 56V8c0-2 2-4 4-4z" fill="#fff" stroke="#ccc" stroke-width="1"/>
      <path d="M40 4v12h12" fill="#f0f0f0" stroke="#ccc" stroke-width="1"/>
      <rect x="16" y="22" width="32" height="3" rx="1" fill="#ddd"/>
      <rect x="16" y="29" width="28" height="3" rx="1" fill="#ddd"/>
      <rect x="16" y="36" width="32" height="3" rx="1" fill="#ddd"/>
      <rect x="16" y="43" width="20" height="3" rx="1" fill="#ddd"/>
    </svg>`)}`,

    game: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect x="6" y="16" width="52" height="36" rx="8" fill="#333" stroke="#555" stroke-width="1.5"/>
      <rect x="10" y="20" width="44" height="28" rx="5" fill="#444"/>
      <circle cx="22" cy="34" r="6" fill="#555" stroke="#666" stroke-width="1"/>
      <rect x="20" y="28" width="4" height="12" rx="1" fill="#888"/>
      <rect x="16" y="32" width="12" height="4" rx="1" fill="#888"/>
      <circle cx="44" cy="30" r="3.5" fill="#4FC3F7"/>
      <circle cx="38" cy="36" r="3.5" fill="#FF5252"/>
      <circle cx="50" cy="36" r="3.5" fill="#66BB6A"/>
      <circle cx="44" cy="42" r="3.5" fill="#FFD54F"/>
      <rect x="26" y="38" width="8" height="2.5" rx="1" fill="#666"/>
      <rect x="28" y="41" width="8" height="2.5" rx="1" fill="#666"/>
    </svg>`)}`,

    minesweeper: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect x="4" y="4" width="56" height="56" rx="4" fill="#c0c0c0" stroke="#999" stroke-width="1.5"/>
      <rect x="8" y="8" width="16" height="16" fill="#d0d0d0" stroke="#999" stroke-width="0.5"/>
      <rect x="24" y="8" width="16" height="16" fill="#bbb" stroke="#999" stroke-width="0.5"/>
      <rect x="40" y="8" width="16" height="16" fill="#d0d0d0" stroke="#999" stroke-width="0.5"/>
      <rect x="8" y="24" width="16" height="16" fill="#bbb" stroke="#999" stroke-width="0.5"/>
      <rect x="24" y="24" width="16" height="16" fill="#d0d0d0" stroke="#999" stroke-width="0.5"/>
      <rect x="40" y="24" width="16" height="16" fill="#bbb" stroke="#999" stroke-width="0.5"/>
      <rect x="8" y="40" width="16" height="16" fill="#d0d0d0" stroke="#999" stroke-width="0.5"/>
      <rect x="24" y="40" width="16" height="16" fill="#bbb" stroke="#999" stroke-width="0.5"/>
      <rect x="40" y="40" width="16" height="16" fill="#d0d0d0" stroke="#999" stroke-width="0.5"/>
      <circle cx="32" cy="32" r="6" fill="#333"/>
      <line x1="32" y1="22" x2="32" y2="26" stroke="#333" stroke-width="2"/>
      <line x1="32" y1="38" x2="32" y2="42" stroke="#333" stroke-width="2"/>
      <line x1="22" y1="32" x2="26" y2="32" stroke="#333" stroke-width="2"/>
      <line x1="38" y1="32" x2="42" y2="32" stroke="#333" stroke-width="2"/>
      <text x="14" y="20" font-size="11" font-weight="bold" fill="#0000FF" font-family="Arial">1</text>
      <text x="46" y="20" font-size="11" font-weight="bold" fill="#008000" font-family="Arial">2</text>
      <text x="14" y="52" font-size="11" font-weight="bold" fill="#FF0000" font-family="Arial">3</text>
      <text x="46" y="52" font-size="12" fill="#FF0000" font-family="Arial">🚩</text>
    </svg>`)}`,

    paint: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect x="6" y="6" width="52" height="52" rx="4" fill="#fff" stroke="#ccc" stroke-width="1.5"/>
      <path d="M14 48c0-4 6-20 14-28s12-6 14-4-2 10-10 18S22 52 14 48z" fill="#4A90D9" opacity="0.8"/>
      <path d="M38 14c4-4 8-6 10-4s0 6-4 10" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M14 48c-2-1-1-4 1-6" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
      <circle cx="48" cy="14" r="4" fill="#FF5252"/>
      <circle cx="50" cy="24" r="3" fill="#FFD54F"/>
      <circle cx="48" cy="34" r="3.5" fill="#66BB6A"/>
      <circle cx="12" cy="16" r="3" fill="#4FC3F7"/>
      <circle cx="12" cy="26" r="2.5" fill="#AB47BC"/>
    </svg>`)}`,

    github: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="28" fill="#24292e"/>
      <path d="M32 12C21 12 12 21 12 32c0 8.8 5.7 16.3 13.6 19 1 .2 1.4-.4 1.4-1v-3.5c-5.5 1.2-6.7-2.7-6.7-2.7-.9-2.3-2.2-2.9-2.2-2.9-1.8-1.2.1-1.2.1-1.2 2 .1 3 2 3 2 1.8 3 4.6 2.1 5.7 1.6.2-1.3.7-2.1 1.3-2.6-4.4-.5-9-2.2-9-9.8 0-2.2.8-3.9 2-5.3-.2-.5-.9-2.5.2-5.2 0 0 1.6-.5 5.4 2a18.7 18.7 0 0110 0c3.7-2.5 5.3-2 5.3-2 1.1 2.7.4 4.7.2 5.2 1.3 1.4 2 3.1 2 5.3 0 7.6-4.6 9.3-9 9.8.7.6 1.3 1.8 1.3 3.7v5.5c0 .6.3 1.2 1.4 1C46.3 48.3 52 40.8 52 32c0-11-9-20-20-20z" fill="#fff"/>
    </svg>`)}`,

    linkedin: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect x="4" y="4" width="56" height="56" rx="8" fill="#0A66C2"/>
      <path d="M18 27h6v19h-6V27zm3-10a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm8 10h6v2.6c.9-1.6 3-3.1 6.2-3.1 6.6 0 7.8 4.3 7.8 10V46h-6v-8.4c0-2.5-.9-4.2-3.2-4.2-2.8 0-4.1 1.9-4.1 4.7V46h-6.7V27z" fill="#fff"/>
    </svg>`)}`,

    itchio: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect x="4" y="4" width="56" height="56" rx="8" fill="#FA5C5C"/>
      <path d="M14 18h36v4c0 3-2.5 5.5-5.5 5.5S39 25 39 22c0 3-2.5 5.5-5.5 5.5S28 25 28 22c0 3-2.5 5.5-5.5 5.5S17 25 17 22c0 3-2.5 5.5-5.5 5.5-.5 0-1-.06-1.5-.18V21.5c0-2 1.5-3.5 3.5-3.5z" fill="#fff" opacity="0.9"/>
      <rect x="18" y="30" width="28" height="18" rx="2" fill="#fff" opacity="0.3"/>
      <rect x="24" y="32" width="10" height="10" rx="1" fill="#fff" opacity="0.7"/>
      <rect x="36" y="32" width="6" height="6" rx="1" fill="#fff" opacity="0.5"/>
    </svg>`)}`,

    gallery: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect x="4" y="8" width="56" height="44" rx="4" fill="#fff" stroke="#ccc" stroke-width="1.5"/>
      <rect x="8" y="12" width="48" height="32" rx="2" fill="#e8f0fe"/>
      <circle cx="20" cy="24" r="5" fill="#FFD54F"/>
      <path d="M8 38l14-10 10 8 8-6 16 14v4H8z" fill="#66BB6A"/>
      <path d="M32 32l8-6 16 14v4H32z" fill="#4CAF50"/>
      <rect x="10" y="48" width="16" height="2" rx="1" fill="#ddd"/>
      <rect x="30" y="48" width="10" height="2" rx="1" fill="#ddd"/>
      <rect x="6" y="4" width="12" height="4" rx="2" fill="#4A90D9"/>
      <text x="8" y="7.5" font-size="3.5" font-family="Arial" font-weight="bold" fill="#fff">PHOTOS</text>
    </svg>`)}`,
  };

  const iconSvg = iconSvgs[iconType] || iconSvgs.folder;

  return (
    <div
      className={`desktop-icon ${isInteractive ? 'interactive' : 'decorative'}`}
      onDoubleClick={onDoubleClick}
    >
      <div className="icon-image-wrapper">
        <img src={iconSvg} alt={label} draggable={false} />
      </div>
      <span className={`icon-label${isInteractive ? ' typewriter' : ''}`}>{label}</span>
    </div>
  );
};

export default DesktopIcon;
