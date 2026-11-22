import { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from './store';

/*
 * Fisheye / barrel lens for the CRT close-up (refs 2 & 3).
 * QuanOS is HTML, so a WebGL post effect can't bend it; instead an SVG
 * feDisplacementMap is applied to the whole .game layer (canvas + HTML together).
 * The displacement map encodes, per pixel, how far outwards to sample:
 * offset ∝ p * |p|², i.e. classic barrel distortion (edges compressed, lines bow out).
 */

const MAP_SIZE = 256;
const FADE_IN = 1.8;    // seconds
const FADE_OUT = 0.8;

function makeBarrelMap() {
  const c = document.createElement('canvas');
  c.width = c.height = MAP_SIZE;
  const g = c.getContext('2d');
  const img = g.createImageData(MAP_SIZE, MAP_SIZE);
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      const nx = (x / (MAP_SIZE - 1)) * 2 - 1;
      const ny = (y / (MAP_SIZE - 1)) * 2 - 1;
      const r2 = nx * nx + ny * ny;
      const i = (y * MAP_SIZE + x) * 4;
      img.data[i] = Math.round(128 + ((nx * r2) / 2) * 127);
      img.data[i + 1] = Math.round(128 + ((ny * r2) / 2) * 127);
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return c.toDataURL();
}

export const LENS_FILTER_ID = 'crt-fisheye';

/** Renders the SVG filter definition and animates its strength in/out. */
export default function CrtLens() {
  const phase = useGame((s) => s.phase);
  const motion = useGame((s) => s.settings.motion);
  const crt = useGame((s) => s.settings.crt);
  const clean = useGame((s) => s.osClean);
  const map = useMemo(() => makeBarrelMap(), []);
  const disp = useRef(null);
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const strength = useRef(0);

  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  // Fades in over FADE_IN seconds as soon as the zoom starts (so it grows while the
  // camera is still moving), and out faster when leaving the computer.
  // reading mode (resume / project folders) relaxes the lens so text stays crisp
  const target = (phase === 'zoomIn' || phase === 'os') && crt && !clean ? 1 : 0;
  useEffect(() => {
    let raf;
    let last = performance.now();
    const maxScale = Math.min(size.w, size.h) * 0.13;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const dur = !motion ? 0.001 : target ? FADE_IN : FADE_OUT;
      const p = strength.current + Math.sign(target - strength.current) * (dt / dur);
      strength.current = target ? Math.min(target, p) : Math.max(0, p);
      const eased = strength.current * strength.current * (3 - 2 * strength.current);   // smoothstep
      disp.current?.setAttribute('scale', String(eased * maxScale));
      if (strength.current !== target) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, size, motion]);

  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <filter id={LENS_FILTER_ID} x="0" y="0" width="100%" height="100%"
        filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feImage href={map} x="0" y="0" width={size.w} height={size.h} preserveAspectRatio="none" result="map" />
        <feDisplacementMap ref={disp} in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
