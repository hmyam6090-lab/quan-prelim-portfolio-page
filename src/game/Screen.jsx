import { useEffect } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from './store';
import { SCREEN } from './poses';
import QuanOS from '../os/QuanOS';
import { setMaterial } from '../three/prepare';

const TITLE_COLS = ['#ffd21f', '#ff9a1f', '#5fd23a', '#3ac85a', null, '#ff3b3b', '#ff5fa8', '#5fd23a', '#3aa8ff', '#5a7cff'];

/** The idle CRT image seen from the menu (ref 1): blue screen + rainbow logo. */
function makeLogoTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 192;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 96, 20, 128, 96, 150);
  grd.addColorStop(0, '#1d2a78');
  grd.addColorStop(1, '#0d1440');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 192);
  g.textBaseline = 'alphabetic';
  g.font = 'italic 700 34px "Pixelify Sans", monospace';
  const word = 'Quan Hoang';
  let x = 30;
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    if (ch !== ' ') {
      g.fillStyle = '#0b0b20';
      g.fillText(ch, x + 2, 98);
      g.fillStyle = TITLE_COLS[i];
      g.fillText(ch, x, 96);
    }
    x += g.measureText(ch).width + (ch === ' ' ? -2 : 0);
  }
  g.font = '700 15px "Pixelify Sans", monospace';
  g.fillStyle = '#fbf7ee';
  g.fillText('Portfolio', 150, 118);
  // scanlines
  g.fillStyle = 'rgba(0,0,0,0.18)';
  for (let y = 0; y < 192; y += 2) g.fillRect(0, y, 256, 1);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.NearestFilter;
  t.flipY = false; // picoCAD UVs: v = 0 at the top
  return t;
}

export default function Screen({ glass }) {
  const phase = useGame((s) => s.phase);
  const showOS = phase !== 'menu';

  // Swap the glass material for the glowing idle image. Re-made once fonts are ready.
  useEffect(() => {
    const apply = () => setMaterial(glass, new THREE.MeshBasicMaterial({
      map: makeLogoTexture(), toneMapped: false, color: new THREE.Color(1.25, 1.25, 1.25),
    }));
    apply();
    document.fonts?.ready.then(apply);
  }, [glass]);

  const k = SCREEN.width / (SCREEN.px.w / 40); // drei Html transform: 40 css px per unit
  return (
    <group position={[SCREEN.center.x, SCREEN.center.y, SCREEN.center.z + 0.004]} scale={k}>
      {showOS && (
        <Html transform pointerEvents="auto" zIndexRange={[20, 0]} className="crt-html">
          <QuanOS />
        </Html>
      )}
    </group>
  );
}
