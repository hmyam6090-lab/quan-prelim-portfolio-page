import { useGame } from './store';

// Short UI sounds. Files live in /public/sounds. Volume comes from Settings.
const PATHS = {
  click: 'sounds/click.mp3',
  hover: 'sounds/click.mp3',
  login: 'sounds/login.mp3',
  startup: 'sounds/startup.mp3',
  windowOpen: 'sounds/window-open.mp3',
  shutdown: 'sounds/shutdown.mp3',
};
const GAIN = { click: 0.5, hover: 0.18, login: 0.6, startup: 0.5, windowOpen: 0.45, shutdown: 0.5 };

const pool = {};

export function playSound(name) {
  const vol = useGame.getState().settings.volume * (GAIN[name] ?? 0.5);
  if (!PATHS[name] || vol <= 0) return;
  try {
    const base = pool[name] || (pool[name] = new Audio(import.meta.env.BASE_URL + PATHS[name]));
    // clone so rapid hovers can overlap
    const a = base.paused ? base : base.cloneNode();
    a.volume = Math.min(1, vol);
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch { /* audio unsupported */ }
}

// A tiny synthesized "pop" (short pitch-dropping blip), e.g. for the dodging QUIT button.
let ctx = null;
export function playPop() {
  const vol = useGame.getState().settings.volume * 0.35;
  if (vol <= 0) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.07);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  } catch { /* audio unavailable */ }
}
