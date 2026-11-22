import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from './store';
import { DAYNIGHT } from './timeOfDay';

// Must match the sun in Lighting.jsx (position -> target) and the window in room.py.
const SUN_FROM = new THREE.Vector3(-6, 40, -62);
const SUN_TO = new THREE.Vector3(6, 0, 4);
const DIR = SUN_TO.clone().sub(SUN_FROM).normalize();
const WIN_Z = -20.2;
// the four panes between the mullions (x -2..6, y 12..22, mullions at x 2 / y 17)
const PANES = [[-1.75, 1.75, 12.25, 16.75], [2.25, 5.75, 12.25, 16.75],
  [-1.75, 1.75, 17.25, 21.75], [2.25, 5.75, 17.25, 21.75]];
const BEAM_COLOR = new THREE.Color('#ffd08a');

/** Where a ray from window point p along the sun direction reaches the floor. */
const toFloor = (p) => p.clone().addScaledVector(DIR, p.y / -DIR.y);

function buildBeams() {
  const pos = [];
  const col = [];
  const near = 0.05;  // alpha at the window (keep subtle)
  const far = 0.0;    // fades out by the floor
  for (const [x0, x1, y0, y1] of PANES) {
    const w = [new THREE.Vector3(x0, y1, WIN_Z), new THREE.Vector3(x1, y1, WIN_Z),
      new THREE.Vector3(x1, y0, WIN_Z), new THREE.Vector3(x0, y0, WIN_Z)];
    const f = w.map(toFloor);
    for (let i = 0; i < 4; i++) {           // four side walls of each light shaft
      const a = w[i], b = w[(i + 1) % 4], c = f[(i + 1) % 4], d = f[i];
      for (const [p, al] of [[a, near], [b, near], [c, far], [a, near], [c, far], [d, far]]) {
        pos.push(p.x, p.y, p.z);
        col.push(BEAM_COLOR.r, BEAM_COLOR.g, BEAM_COLOR.b, al);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4));
  return g;
}

function buildDust(n) {
  const base = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < n; i++) {
    const [x0, x1, y0, y1] = PANES[i % PANES.length];
    const p = new THREE.Vector3(rnd(x0, x1), rnd(y0, y1), WIN_Z);
    const t = rnd(0.08, 0.85) * (p.y / -DIR.y);
    base.push(p.addScaledVector(DIR, t));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
  return { g, base, phase: base.map(() => Math.random() * Math.PI * 2) };
}

/** Slow Brownian-ish drift around each mote's home position. */
function driftDust(dust, t) {
  const arr = dust.g.attributes.position.array;
  dust.base.forEach((b, i) => {
    const ph = dust.phase[i];
    arr[i * 3] = b.x + Math.sin(t * 0.21 + ph) * 0.6;
    arr[i * 3 + 1] = b.y + Math.sin(t * 0.13 + ph * 2) * 0.8;
    arr[i * 3 + 2] = b.z + Math.cos(t * 0.17 + ph) * 0.6;
  });
  dust.g.attributes.position.needsUpdate = true;
}

const MOON_TINT = new THREE.Color('#9fb8ff');
const WHITE = new THREE.Color('#ffffff');
function tintBeams(m, e) {
  m.color.lerpColors(WHITE, MOON_TINT, e);
  m.opacity = 1 - 0.45 * e;
}

/** Volumetric-looking sun shafts from the window + floating dust motes. */
export default function SunBeams() {
  const quality = useGame((s) => s.settings.quality);
  const beams = useMemo(() => buildBeams(), []);
  const dust = useMemo(() => buildDust(24), []);
  const dustMat = useRef();
  const beamMat = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    driftDust(dust, t);
    const e = DAYNIGHT.e;   // night: shafts turn into faint cool moonlight, dust settles
    if (dustMat.current) dustMat.current.opacity = (0.3 + Math.sin(t * 1.7) * 0.08) * (1 - e);
    if (beamMat.current) tintBeams(beamMat.current, e);
  });

  if (quality === 'low') return null;
  return (
    <group>
      <mesh geometry={beams} renderOrder={1} frustumCulled={false}>
        <meshBasicMaterial
          ref={beamMat}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <points geometry={dust.g} renderOrder={1} frustumCulled={false}>
        <pointsMaterial
          ref={dustMat}
          color="#fff1c4"
          size={2}
          sizeAttenuation={false}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
