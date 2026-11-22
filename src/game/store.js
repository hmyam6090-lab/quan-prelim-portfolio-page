import { create } from 'zustand';

/*
 * Scene phases:
 *   loading -> menu -> zoomIn -> os (QuanOS: login / desktop) -> zoomOut -> menu
 * `skip` jumps straight into the OS on the desktop (no login).
 */

const SETTINGS_KEY = 'quan-portfolio-settings-v1';
const DEFAULT_SETTINGS = {
  volume: 0.6,
  quality: 'high',   // 'high' | 'low'
  grain: true,
  bloom: true,
  crt: true,
  motion: true,      // camera sway + long transitions
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

const prefersReducedMotion = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
};

export const useGame = create((set, get) => ({
  phase: 'menu',
  osScreen: 'login',       // 'login' | 'desktop'
  panel: null,             // 'settings' | 'credits' | 'quit' | null
  hovered: null,           // hovered 3D menu item id
  settings: readSettings(),
  reducedMotion: prefersReducedMotion(),

  setHovered: (hovered) => set({ hovered }),
  openPanel: (panel) => set({ panel }),
  closePanel: () => set({ panel: null }),

  play: () => {
    if (get().phase !== 'menu') return;
    set({ phase: 'zoomIn', panel: null, osScreen: 'login' });
  },
  skipToPortfolio: () => set({ phase: 'zoomIn', panel: null, osScreen: 'desktop' }),
  arrived: () => { if (get().phase === 'zoomIn') set({ phase: 'os' }); },
  login: () => set({ osScreen: 'desktop' }),
  logout: () => set({ osScreen: 'login' }),
  exitToMenu: () => {
    const p = get().phase;
    if (p === 'os' || p === 'zoomIn') set({ phase: 'zoomOut' });
  },
  backHome: () => { if (get().phase === 'zoomOut') set({ phase: 'menu', osScreen: 'login' }); },

  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch };
    writeSettings(settings);
    set({ settings });
  },
  resetSettings: () => { writeSettings(DEFAULT_SETTINGS); set({ settings: { ...DEFAULT_SETTINGS } }); },
}));
