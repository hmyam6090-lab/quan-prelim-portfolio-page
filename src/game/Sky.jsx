import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DAYNIGHT } from './timeOfDay';

/*
 * What you see through the window: a pixel sun that sets and a pixel moon that rises
 * when the light switch flips to night, plus stars that fade in. Everything sits just in
 * front of the outside backdrop (z -25.5), so the wall hides it except through the window
 * (window opening: x -2..6, y 12..22 on the z = -20 wall).
 */

const Z = -25.4;
const SUN_PATH = [new THREE.Vector3(4.6, 19.8, Z), new THREE.Vector3(0.5, 6.5, Z)];     // day -> set
const MOON_PATH = [new THREE.Vector3(5.5, 6.0, Z), new THREE.Vector3(3.6, 19.6, Z)];   // hidden -> risen

function pixelDisc(kind) {
  const c = document.createElement('canvas');
  c.width = c.height = 16;
  const g = c.getContext('2d');
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const dx = x - 7.5, dy = y - 7.5;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r > 7.2) continue;
      if (kind === 'sun') {
        g.fillStyle = r < 4 ? '#fff6c8' : r < 6 ? '#ffd45a' : '#ffa830';
      } else {
        // crescent: carve out a second disc
        const cx = x - 10.5, cy = y - 6.0;
        if (Math.sqrt(cx * cx + cy * cy) < 6) continue;
        g.fillStyle = (x + y) % 5 === 0 ? '#c9d4f2' : '#eef2ff';
      }
      g.fillRect(x, y, 1, 1);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function disc(kind, size, glow) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ map: pixelDisc(kind), transparent: true, alphaTest: 0.5, toneMapped: false }),
  );
  m.material.color.setScalar(glow);
  m.raycast = () => {};
  return m;
}

function buildStars(n) {
  const pos = [];
  for (let i = 0; i < n; i++) pos.push(-1.8 + Math.random() * 7.6, 12.6 + Math.random() * 9.2, Z - 0.05);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  return g;
}

export default function Sky() {
  const parts = useMemo(() => ({
    sun: disc('sun', 3.2, 1.5),
    moon: disc('moon', 2.6, 1.3),
    stars: new THREE.Points(buildStars(26), new THREE.PointsMaterial({
      color: '#eef2ff', size: 2, sizeAttenuation: false, transparent: true, opacity: 0, toneMapped: false,
    })),
  }), []);

  useFrame((state) => updateSky(parts, DAYNIGHT.e, state.clock.elapsedTime));

  return (
    <group>
      <primitive object={parts.sun} />
      <primitive object={parts.moon} />
      <primitive object={parts.stars} />
    </group>
  );
}

function updateSky({ sun, moon, stars }, e, t) {
  sun.position.lerpVectors(SUN_PATH[0], SUN_PATH[1], Math.min(1, e * 1.25));
  moon.position.lerpVectors(MOON_PATH[0], MOON_PATH[1], Math.max(0, e * 1.25 - 0.25));
  sun.material.color.setRGB(1.5, 1.5 - e * 0.5, 1.5 - e * 0.9);         // reddens as it sets
  stars.material.opacity = Math.max(0, e - 0.4) / 0.6 * (0.75 + Math.sin(t * 3) * 0.2);
}
