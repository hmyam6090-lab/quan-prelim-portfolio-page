import { create } from 'zustand';

/*
 * Scene phases:
 *   loading -> menu -> zoomIn -> os (QuanOS: login / desktop) -> zoomOut -> menu
 * `skip` jumps straight into the OS on the desktop (no login).
 */

const SETTINGS_KEY = 'quan-portfolio-settings-v4';
const DEFAULT_SETTINGS = {
  volume: 0.6,
  quality: 'high',   // 'high' | 'low'  (shadows + post effects)
  dither: true,      // picoCAD ordered dithering between shade steps
  grain: true,
  bloom: true,
  crt: true,
  motion: true,      // camera sway + long transitions
  night: false,      // light switch: night mode (sun sets, moon rises, room lights off)
};

function readSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function writeSettings(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch { /* storage unavailable */ }
}

// Remember a successful login so later visits skip the login screen.
const LOGIN_KEY = 'quan-portfolio-logged-in';
const rememberedLogin = () => { try { return localStorage.getItem(LOGIN_KEY) === '1'; } catch { return false; } };
const rememberLogin = (on) => {
  try { if (on) localStorage.setItem(LOGIN_KEY, '1'); else localStorage.removeItem(LOGIN_KEY); } catch { /* storage unavailable */ }
};

const prefersReducedMotion = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
};

export const useGame = create((set, get) => ({
  phase: 'menu',
  osScreen: 'login',       // 'login' | 'desktop'
  panel: null,             // 'settings' | 'credits' | 'quit' | null
  hovered: null,           // hovered 3D menu item id
  osClean: null,           // null | 'full' | 'right': reading mode (no lens / scanlines) for resume & folders
  settings: readSettings(),
  reducedMotion: prefersReducedMotion(),

  setHovered: (hovered) => set({ hovered }),
  setOsClean: (osClean) => { if (get().osClean !== osClean) set({ osClean }); },
  openPanel: (panel) => set({ panel }),
  closePanel: () => set({ panel: null }),

  play: () => {
    if (get().phase !== 'menu') return;
    set({ phase: 'zoomIn', panel: null, osScreen: rememberedLogin() ? 'desktop' : 'login' });
  },
  skipToPortfolio: () => set({ phase: 'zoomIn', panel: null, osScreen: 'desktop' }),
  arrived: () => { if (get().phase === 'zoomIn') set({ phase: 'os' }); },
  login: () => { rememberLogin(true); set({ osScreen: 'desktop' }); },
  logout: () => { rememberLogin(false); set({ osScreen: 'login' }); },
  exitToMenu: () => {
    const p = get().phase;
    if (p === 'os' || p === 'zoomIn') set({ phase: 'zoomOut' });
  },
  backHome: () => { if (get().phase === 'zoomOut') set({ phase: 'menu' }); },

  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch };
    writeSettings(settings);
    set({ settings });
  },
  toggleNight: () => get().updateSettings({ night: !get().settings.night }),
  resetSettings: () => { writeSettings(DEFAULT_SETTINGS); set({ settings: { ...DEFAULT_SETTINGS } }); },
}));
