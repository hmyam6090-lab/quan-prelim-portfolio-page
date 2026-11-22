import { useEffect } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from './store';
import { SCREEN } from './poses';
import QuanOS from '../os/QuanOS';
import { setMaterial } from '../three/prepare';

// Same chunky glyphs as the 3D title (tools/picocad/assets/pixel_text.py).
const GLYPH = {
  Q: ['.####.', '##..##', '##..##', '##..##', '##.###', '##..##', '.###.#'],
  H: ['##..##', '##..##', '##..##', '######', '##..##', '##..##', '##..##'],
};
const TINY = { // 3x5 font for "PORTFOLIO"
  P: ['##.', '#.#', '##.', '#..', '#..'], O: ['.#.', '#.#', '#.#', '#.#', '.#.'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'], T: ['###', '.#.', '.#.', '.#.', '.#.'],
  F: ['###', '#..', '##.', '#..', '#..'], L: ['#..', '#..', '#..', '#..', '###'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
};

/** The idle CRT image seen from the menu: a pixel "QH" boot logo in the title's colours
 *  (Q yellow→orange, H red→pink, dark rim + drop shadow) on the QuanOS blue. 48 x 36
 *  texels so it stays crisp at the picoCAD render resolution. */
function makeLogoTexture() {
  const W = 48, H = 36, S = 2;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const px = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  px(0, 0, W, H, '#2b3aa6');
  for (let y = 0; y < H; y += 2) px(0, y, W, 1, '#2836a0');           // faint scanlines
  px(0, 0, W, 2, '#1e2a86'); px(0, H - 2, W, 2, '#1e2a86');
  const glyph = (rows, x0, y0, colAt, off = [0, 0]) => rows.forEach((r, gy) => [...r].forEach((ch, gx) => {
    if (ch === '#') px(x0 + gx * S + off[0], y0 + gy * S + off[1], S, S, colAt(gy));
  }));
  const letters = [
    [GLYPH.Q, 8, (gy) => (gy < 3 ? '#ffd21f' : gy < 5 ? '#ffb41f' : '#ff9a1f')],
    [GLYPH.H, 26, (gy) => (gy < 3 ? '#ff3b3b' : gy < 5 ? '#ff4d78' : '#ff5fa8')],
  ];
  const y0 = 6;
  for (const [rows, x0] of letters) glyph(rows, x0, y0, () => '#13184a', [1, 2]);        // shadow
  for (const [rows, x0] of letters) for (const o of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
    glyph(rows, x0, y0, () => '#1d1a33', o);                                             // rim
  }
  for (const [rows, x0, col] of letters) glyph(rows, x0, y0, col);
  px(9, y0, 3, 1, '#fff3a8'); px(27, y0, 2, 1, '#ffb3b3');                               // glints
  let x = 7;
  for (const ch of 'PORTFOLIO') {
    TINY[ch].forEach((r, gy) => [...r].forEach((p, gx) => { if (p === '#') px(x + gx, 26 + gy, 1, 1, '#fbf7ee'); }));
    x += 4;
  }
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
