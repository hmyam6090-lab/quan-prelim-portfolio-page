import { useGame } from './store';
import { getAudioCtx } from './audioCtx';

/*
 * Synthesized UI sounds — retro (square/triangle chips) but clean: everything goes
 * through a gentle low-pass, pitches stay in a mid register, envelopes are short and soft.
 * Volume = Settings → Volume.
 *
 *   playSound('click' | 'hover' | 'windowOpen' | 'login' | 'error' | 'startup' |
 *             'shutdown' | 'switch' | 'drawer' | 'radio' | 'pop' | 'type' | 'typeReturn' | 'typeBell')
 */

let bus = null;   // master gain -> low-pass -> destination
const SFX_GAIN = 1.9;   // SFX are short and soft by design; lift them over the music

function out(ac) {
  if (bus && bus.context === ac) return bus;
  const lp = ac.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 3200;
  lp.Q.value = 0.4;
  const g = ac.createGain();
  g.connect(lp).connect(ac.destination);
  bus = g;
  return bus;
}

/** One enveloped oscillator note. */
function tone(ac, dest, { f, f2, t = 0, dur = 0.1, type = 'square', vol = 0.2, attack = 0.004 }) {
  const t0 = ac.currentTime + t;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(dest);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

/** Filtered noise burst (clicks, drive seeks, slides). */
function noise(ac, dest, { t = 0, dur = 0.03, vol = 0.15, freq = 2000, q = 1, sweepTo }) {
  const t0 = ac.currentTime + t;
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const bp = ac.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(freq, t0);
  if (sweepTo) bp.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
  bp.Q.value = q;
  const g = ac.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(bp).connect(g).connect(dest);
  src.start(t0);
}

// note frequencies
const N = { C3: 131, G3: 196, C4: 262, E4: 330, G4: 392, A4: 440, C5: 523, E5: 659, G5: 784, C6: 1047 };

const SOUNDS = {
  click: (ac, o) => tone(ac, o, { f: N.A4, f2: N.E4, dur: 0.06, vol: 0.16 }),
  hover: (ac, o) => tone(ac, o, { f: N.E5, dur: 0.035, type: 'triangle', vol: 0.07 }),
  pop: (ac, o) => tone(ac, o, { f: 620, f2: 210, dur: 0.09, type: 'triangle', vol: 0.22 }),
  windowOpen: (ac, o) => {
    [N.C5, N.E5, N.G5].forEach((f, i) => tone(ac, o, { f, t: i * 0.045, dur: 0.09, type: 'triangle', vol: 0.12 }));
  },
  login: (ac, o) => {
    [N.C5, N.E5, N.G5].forEach((f, i) => tone(ac, o, { f, t: i * 0.07, dur: 0.12, type: 'square', vol: 0.07 }));
    tone(ac, o, { f: N.C6, t: 0.21, dur: 0.4, type: 'triangle', vol: 0.14 });
  },
  error: (ac, o) => {
    tone(ac, o, { f: N.G3, dur: 0.11, vol: 0.13 });
    tone(ac, o, { f: 147, t: 0.12, dur: 0.16, vol: 0.13 });
  },
  shutdown: (ac, o) => {
    [N.G5, N.E5, N.C5, N.G4].forEach((f, i) => tone(ac, o, { f, t: i * 0.08, dur: 0.14, type: 'triangle', vol: 0.12 }));
    tone(ac, o, { f: 120, f2: 45, t: 0.32, dur: 0.35, type: 'sine', vol: 0.18 });
  },
  switch: (ac, o) => {
    noise(ac, o, { dur: 0.018, vol: 0.35, freq: 2600, q: 3 });
    tone(ac, o, { f: 140, f2: 70, dur: 0.07, type: 'sine', vol: 0.25 });
  },
  drawer: (ac, o) => {
    noise(ac, o, { dur: 0.28, vol: 0.12, freq: 380, q: 1.2, sweepTo: 220 });
    tone(ac, o, { f: 90, f2: 60, t: 0.24, dur: 0.08, type: 'sine', vol: 0.2 });
  },
  // typewriter: a dry key clack (noise tick + low thock), slightly random per key
  type: (ac, o) => {
    noise(ac, o, { dur: 0.014, vol: 0.16, freq: 2400 + Math.random() * 900, q: 2.5 });
    tone(ac, o, { f: 170 + Math.random() * 40, f2: 110, dur: 0.03, type: 'triangle', vol: 0.1 });
  },
  typeReturn: (ac, o) => {
    noise(ac, o, { dur: 0.09, vol: 0.12, freq: 900, q: 1, sweepTo: 2200 });
    tone(ac, o, { f: 130, f2: 80, t: 0.06, dur: 0.06, type: 'sine', vol: 0.18 });
  },
  typeBell: (ac, o) => tone(ac, o, { f: 1568, dur: 0.35, type: 'triangle', vol: 0.06 }),
  radio: (ac, o) => {   // dial-tuning blip
    noise(ac, o, { dur: 0.12, vol: 0.08, freq: 1500, q: 2, sweepTo: 700 });
    tone(ac, o, { f: N.G4, f2: N.C5, t: 0.08, dur: 0.1, type: 'triangle', vol: 0.12 });
  },
  // Retro PC power-on: switch thunk, CRT/fan hum, a few hard-drive seeks, then a chord.
  startup: (ac, o) => {
    tone(ac, o, { f: 95, f2: 40, dur: 0.18, type: 'sine', vol: 0.3 });
    const t0 = ac.currentTime;
    const hum = ac.createOscillator();
    const hg = ac.createGain();
    hum.type = 'sine';
    hum.frequency.value = 60;
    hg.gain.setValueAtTime(0.0001, t0);
    hg.gain.exponentialRampToValueAtTime(0.06, t0 + 0.25);
    hg.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.2);
    hum.connect(hg).connect(o);
    hum.start(t0);
    hum.stop(t0 + 2.3);
    [0.22, 0.31, 0.37, 0.52, 0.6, 0.74].forEach((t) => noise(ac, o, { t, dur: 0.02, vol: 0.18, freq: 1800 + Math.random() * 900, q: 4 }));
    [N.C4, N.E4, N.G4, N.C5].forEach((f, i) => tone(ac, o, { f, t: 0.95 + i * 0.09, dur: 0.5, type: 'triangle', vol: 0.12 }));
    [N.C3, N.G3].forEach((f, i) => tone(ac, o, { f, t: 0.95 + i * 0.18, dur: 0.9, type: 'square', vol: 0.035 }));
    tone(ac, o, { f: N.E5, t: 1.32, dur: 0.6, type: 'triangle', vol: 0.09 });
  },
};

export function playSound(name) {
  const vol = useGame.getState().settings.volume;
  const fn = SOUNDS[name];
  if (!fn || vol <= 0) return;
  try {
    const ac = getAudioCtx();
    if (!ac) return;
    const o = out(ac);
    o.gain.value = vol * SFX_GAIN;
    fn(ac, o);
  } catch { /* audio unavailable */ }
}

export const playPop = () => playSound('pop');
