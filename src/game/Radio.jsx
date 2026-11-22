import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePico } from '../three/picoLoader';
import { useGame } from './store';
import { playSound } from './sound';
import { musicLevel, nextTrack, useMusic } from './music';
import { addOutline, showOutline } from './roomFx';
import { once } from '../three/prepare';

/*
 * The music player: a picoCAD radio on the desk. A spring makes it bounce on every beat
 * (bass onsets from the analyser, ~120 BPM fallback), pixel notes float out of it and fade,
 * hovering outlines it in white, and clicking squishes it and switches to the next track.
 */

const NOTE_GLYPHS = [
  ['..##', '..#.', '..#.', '..#.', '###.', '###.'],        // ♪
  ['.###', '.#.#', '.#.#', '.#.#', '##.#', '#####', '#..##'],  // ♫ (rough)
];
const NOTE_COLORS = ['#ffd21f', '#fbf7ee', '#ff8ab8', '#9fd2ff'];
const POOL = 8;
const LIFE = 1.9;

function noteTexture(glyph, color) {
  const w = Math.max(...glyph.map((r) => r.length));
  const c = document.createElement('canvas');
  c.width = w + 2; c.height = glyph.length + 2;
  const g = c.getContext('2d');
  glyph.forEach((row, y) => [...row].forEach((p, x) => {
    if (p !== '#') return;
    g.fillStyle = '#1d1a33'; g.fillRect(x + 1, y + 2, 1, 1);   // drop shadow
    g.fillStyle = color; g.fillRect(x + 1, y + 1, 1, 1);
  }));
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeNotes() {
  const textures = [];
  NOTE_GLYPHS.forEach((gl) => NOTE_COLORS.forEach((col) => textures.push(noteTexture(gl, col))));
  return Array.from({ length: POOL }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
    s.scale.set(1.1, 1.3, 1);
    s.userData = { age: LIFE, textures };
    s.raycast = () => {};
    return s;
  });
}

function spawn(note, origin) {
  const { textures } = note.userData;
  note.material.map = textures[Math.floor(Math.random() * textures.length)];
  note.material.needsUpdate = true;
  note.userData.age = 0;
  note.userData.x0 = origin.x + (Math.random() - 0.5) * 1.2;
  note.userData.z0 = origin.z + 0.3;
  note.userData.y0 = origin.y;
  note.userData.drift = (Math.random() - 0.5) * 1.4;
  note.userData.phase = Math.random() * Math.PI * 2;
}

function stepNote(note, dt) {
  const u = note.userData;
  if (u.age >= LIFE) { note.material.opacity = 0; return; }
  u.age += dt;
  const k = u.age / LIFE;
  note.position.set(u.x0 + u.drift * k + Math.sin(u.phase + u.age * 5) * 0.12, u.y0 + k * 2.6, u.z0);
  note.material.opacity = k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85;
  note.material.rotation = Math.sin(u.phase + u.age * 3) * 0.3;
}

// Bouncy spring on the radio's vertical scale (1 = rest). Beats / clicks kick it into a
// squash; the spring overshoots into a stretch and a little hop off the desk.
const SPRING_K = 230;
const SPRING_DAMP = 11;
const BASE = 1.1;            // render scale of the radio model

function springRadio(fx, hover, t, d) {
  const { obj } = fx;
  const playing = useMusic.getState().playing;
  const level = musicLevel();
  fx.avg = THREE.MathUtils.damp(fx.avg, level, 3, d);
  fx.cool -= d;
  // beat = bass onset above the running average; fall back to ~120 BPM if none are found
  const onset = level - fx.avg > 0.045 && level > 0.12;
  if (playing && fx.cool <= 0 && (onset || t - fx.lastKick > 0.55)) {
    fx.v -= 2.2 + Math.min(level, 1) * 2.2;
    fx.cool = 0.22;
    fx.lastKick = t;
  }
  const rest = hover ? 1.06 : 1;
  fx.v += (-SPRING_K * (fx.sy - rest) - SPRING_DAMP * fx.v) * d;
  fx.sy = THREE.MathUtils.clamp(fx.sy + fx.v * d, 0.62, 1.45);
  const sy = fx.sy;
  obj.scale.set(BASE / Math.sqrt(sy), BASE * sy, BASE / Math.sqrt(sy));
  obj.position.y = fx.baseY + Math.max(0, sy - 1) * 1.6;           // hop when stretched
  obj.rotation.z = Math.sin(t * 9) * 0.04 * Math.min(1, Math.abs(sy - 1) * 6);
}

/** Click: a big press-squish (the spring bounces it back). */
function pressRadio(fx) { fx.v -= 7.5; }

function tickRadio(fx, hover, t, d) {
  const { obj, notes } = fx;
  if (!obj) return;
  springRadio(fx, hover, t, d);
  fx.level = THREE.MathUtils.damp(fx.level, musicLevel(), 14, d);
  fx.timer -= d;   // emit notes while music is actually playing
  if (useMusic.getState().playing && fx.timer <= 0) {
    fx.timer = 0.32 + Math.random() * 0.3 - fx.level * 0.2;
    const free = notes.find((n) => n.userData.age >= LIFE);
    if (free) spawn(free, fx.top.set(obj.position.x, fx.baseY + 1.9, obj.position.z));
  }
  notes.forEach((n) => stepNote(n, d));
}

export default function Radio() {
  const radio = usePico('radio');
  const hovered = useRef(false);
  const fx = useMemo(() => {
    const obj = radio.tagged.radio?.[0];
    return {
      obj,
      baseY: obj?.position.y ?? 0,
      hulls: obj ? once(radio, 'outline', () => addOutline(obj, 0.09)) : [],
      notes: makeNotes(),
      timer: 0, level: 0, avg: 0, cool: 0, lastKick: 0, sy: 1, v: 0,
      top: new THREE.Vector3(),
    };
  }, [radio]);

  useFrame((state, dt) => tickRadio(fx, hovered.current, state.clock.elapsedTime, Math.min(dt, 0.05)));

  const interactive = () => useGame.getState().phase === 'menu' && !useGame.getState().panel;
  return (
    <group>
      <primitive
        object={radio.root}
        onPointerOver={(e) => {
          if (!interactive()) return;
          e.stopPropagation();
          hovered.current = true;
          showOutline(fx.hulls, true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => { hovered.current = false; showOutline(fx.hulls, false); document.body.style.cursor = ''; }}
        onClick={(e) => {
          if (!interactive()) return;
          e.stopPropagation();
          pressRadio(fx);
          playSound('radio');
          nextTrack();
        }}
      />
      {fx.notes.map((n, i) => <primitive key={i} object={n} />)}
    </group>
  );
}
