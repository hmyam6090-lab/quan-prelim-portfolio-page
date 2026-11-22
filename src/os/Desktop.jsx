import { useCallback, useEffect, useRef, useState } from 'react';
import useTypewriter from '../hooks/useTypewriter';
import { playSound } from '../game/sound';
import { useGame } from '../game/store';
import { DESKTOP_ICONS, FOLDERS, PREVIEW_PHOTO, RESUME } from './config';
import { ICONS } from './icons';
import Window from './Window';
import Taskbar from './Taskbar';
import FolderBrowser from './FolderBrowser';
import ContactFolder from './ContactFolder';
import { FakeGame, Gallery } from './Extras';
import { FAKE_GAMES } from './content/extras';
import greeting from './content/greeting.txt?raw';

// Window presets (QuanOS pixels, 1024 x 768 screen, 40px taskbar).
const PRESETS = {
  notepad: { title: 'Greeting.txt - Notepad', icon: 'notepad', x: 262, y: 136, w: 570, h: 470 },
  preview: { title: `${PREVIEW_PHOTO.name} - Preview`, icon: 'image', x: 846, y: 40, w: 156, h: 172 },
  resume: { title: 'Resume.pdf - Viewer', icon: 'pdf', x: 240, y: 22, w: 640, h: 676 },
  // project folders open full screen (split view); Contact Me is a regular window
  folder: { icon: 'folder', x: 0, y: 0, w: 1024, h: 728 },
  contact: { icon: 'mail', x: 232, y: 92, w: 560, h: 520 },
  gallery: { title: 'Gallery', icon: 'gallery', x: 150, y: 50, w: 724, h: 590 },
  game: { x: 300, y: 220, w: 430, h: 250 },
};

function makeWin(id, z, offset = 0) {
  const isFolder = id.startsWith('folder:');
  const fid = isFolder ? id.slice(7) : null;
  if (fid === 'contact') return { id, ...PRESETS.contact, title: 'Contact Me', z, min: false };
  if (isFolder) {
    return { id, ...PRESETS.folder, title: `${FOLDERS[fid].title} — Quan Hoang Portfolio Browser`, z, min: false };
  }
  if (id.startsWith('game:')) {
    const g = id.slice(5);
    return { id, ...PRESETS.game, icon: g, title: FAKE_GAMES[g].exe, x: PRESETS.game.x + offset, y: PRESETS.game.y + offset, z, min: false };
  }
  const p = PRESETS[id];
  return { id, ...p, x: p.x + offset, y: p.y + offset, z, min: false };
}

function Notepad() {
  const typed = useTypewriter(greeting, 13, 600);
  const [text, setText] = useState(null);
  const done = typed.length >= greeting.length;

  // typewriter clacks: one per visible character (every other one, so it isn't a buzz),
  // a carriage-return thunk on new lines, and a little bell when the message is done
  useEffect(() => {
    const ch = typed[typed.length - 1];
    if (!ch) return;
    if (typed.length >= greeting.length) playSound('typeBell');
    else if (ch === '\n') playSound('typeReturn');
    else if (ch !== ' ' && typed.length % 2 === 0) playSound('type');
  }, [typed]);
  return (
    <>
      <div className="np-menu"><span>File</span><span>Edit</span><span>Search</span><span>Help</span></div>
      <textarea
        className={`np-text ${done ? '' : 'typing'}`}
        value={text ?? typed}
        readOnly={!done}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        aria-label="Greeting"
      />
    </>
  );
}

function ResumeViewer() {
  const src = import.meta.env.BASE_URL + RESUME.file;
  return (
    <div className="resume">
      <div className="resume-bar">
        <span>{RESUME.downloadName}</span>
        <span className="grow" />
        <a className="os-btn" href={src} target="_blank" rel="noopener noreferrer">Open</a>
        <a className="os-btn primary" href={src} download={RESUME.downloadName}>Download</a>
      </div>
      <iframe className="resume-frame" src={`${src}#toolbar=0&navpanes=0&view=FitH`} title="Resume preview" />
    </div>
  );
}

/** Ref 3: blue desktop, icons on the left, Notepad greeting open, photo preview top-right. */
export default function Desktop() {
  const zTop = useRef(10);
  const [wins, setWins] = useState(() => [makeWin('preview', 2), makeWin('notepad', 3)]);
  const [active, setActive] = useState('notepad');
  const [selected, setSelected] = useState(null);


  // Reading mode: when the front window is the resume or a project folder, switch the CRT
  // lens + scanlines off over it so the text is crisp ('full' = whole screen, 'right' = detail half).
  const setOsClean = useGame((s) => s.setOsClean);
  useEffect(() => {
    const top = wins.filter((w) => !w.min).sort((a, b) => b.z - a.z)[0];
    let mode = null;
    if (top?.id === 'resume') mode = 'full';
    else if (top && ['folder:games', 'folder:projects', 'folder:research'].includes(top.id)) mode = 'right';
    setOsClean(mode);
  }, [wins, setOsClean]);

  const focus = useCallback((id) => {
    const nz = ++zTop.current;
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: nz, min: false } : w)));
    setActive(id);
  }, []);

  const open = useCallback((id) => {
    playSound('windowOpen');
    setWins((ws) => (ws.some((w) => w.id === id) ? ws : [...ws, makeWin(id, 0, (ws.length % 4) * 18)]));
    focus(id);
  }, [focus]);

  const close = (id) => { playSound('click'); setWins((ws) => ws.filter((w) => w.id !== id)); };
  const minimize = (id) => { playSound('click'); setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w))); setActive(null); };
  const move = (id, x, y) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));

  const activate = (icon) => {
    playSound('click');
    if (icon.link) window.open(icon.link, '_blank', 'noopener,noreferrer');
    else open(icon.open);
  };

  return (
    <div className="os-desktop" onPointerDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
      <div className="icons">
        {DESKTOP_ICONS.map((icon) => (
          <button
            key={icon.id}
            className={`d-icon ${selected === icon.id ? 'selected' : ''}`}
            style={icon.corner === 'br'
              ? { left: 1024 - 126 - icon.col * 112, top: 728 - 136 - icon.row * 128 }
              : { left: 18 + icon.col * 118, top: 26 + icon.row * 134 }}
            onClick={() => { setSelected(icon.id); activate(icon); }}
            title={icon.link ? `${icon.label} (opens in a new tab)` : icon.label}
          >
            <img src={ICONS[icon.icon]} alt="" draggable={false} />
            <span>{icon.label}</span>
          </button>
        ))}
      </div>

      {wins.map((w) => (
        <Window
          key={w.id}
          win={w}
          icon={w.icon}
          active={active === w.id}
          onFocus={focus}
          onClose={close}
          onMinimize={w.id === 'preview' ? null : minimize}
          onMove={move}
          bodyClass={w.id === 'notepad' ? 'np' : w.id === 'preview' ? 'pv' : w.id === 'resume' ? 'rv' : w.id === 'folder:contact' ? 'cv' : w.id === 'gallery' ? 'gv' : w.id.startsWith('game:') ? 'gmv' : 'fv'}
        >
          {w.id === 'notepad' && <Notepad />}
          {w.id === 'preview' && <img className="pv-img" src={import.meta.env.BASE_URL + PREVIEW_PHOTO.file} alt="A cat sticking its tongue out" draggable={false} />}
          {w.id === 'resume' && <ResumeViewer />}
          {w.id === 'folder:contact' && <ContactFolder />}
          {w.id === 'gallery' && <Gallery />}
          {w.id.startsWith('game:') && <FakeGame id={w.id.slice(5)} onClose={() => close(w.id)} />}
          {w.id.startsWith('folder:') && w.id !== 'folder:contact' && <FolderBrowser folderId={w.id.slice(7)} onBack={() => close(w.id)} />}
        </Window>
      ))}

      <Taskbar wins={wins} active={active} onTask={(id) => focus(id)} onOpen={open} />
    </div>
  );
}
