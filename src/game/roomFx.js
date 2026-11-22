import * as THREE from 'three';

/* Helpers for the room's interactive / time-of-day bits (kept out of components so the
   per-frame mutations of three.js objects stay in plain functions). */

export const DRAWER_OPEN = 1.5;    // how far the desk drawer sticks out (units, +z)

/** Is `o` (or one of its parents) tagged with `tag`? */
export function hasTag(o, tag) {
  while (o) {
    if (o.userData?.tags?.[tag]) return true;
    o = o.parent;
  }
  return false;
}

/** Remember each emissive object's daytime brightness so night can dim it. */
export function collectEmissive(tagged) {
  return (tagged.emissive || []).map((obj) => {
    const mats = [];
    obj.traverse((o) => { if (o.isMesh) mats.push(...[].concat(o.material)); });
    return { name: obj.name, k: parseFloat(obj.userData.tags.emissive) || 1.5, mats };
  });
}

const NIGHT_SKY = new THREE.Color(0.2, 0.25, 0.55);

/** Ceiling tubes switch off, the outside view turns to night. e = eased night amount. */
export function applyNightToEmissive(list, e) {
  for (const { name, k, mats } of list) {
    for (const m of mats) {
      if (!m.isMeshBasicMaterial) continue;
      if (name === 'tubes') m.color.setScalar(k * (1 - 0.93 * e));
      else if (name === 'outside') m.color.setScalar(k).lerp(NIGHT_SKY, e);
    }
  }
}

export function easeDrawer(drawer, open, dt) {
  drawer.position.z = THREE.MathUtils.damp(drawer.position.z, open ? DRAWER_OPEN : 0, 10, dt);
}

export function flipLever(lever, night, dt) {
  lever.position.y = THREE.MathUtils.damp(lever.position.y, night ? -0.42 : 0, 16, dt);
}

/** Pixel "click me" arrow sprite for the light switch. */
export function makeArrowSprite() {
  const c = document.createElement('canvas');
  c.width = 9; c.height = 10;
  const g = c.getContext('2d');
  const rows = ['...###...', '...###...', '...###...', '...###...', '#########', '.#######.', '..#####..', '...###...', '....#....', '.........'];
  rows.forEach((r, y) => [...r].forEach((p, x) => {
    if (p === '#') { g.fillStyle = '#ffd21f'; g.fillRect(x, y, 1, 1); }
  }));
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, toneMapped: false }));
  s.scale.set(0.9, 1.0, 1);
  s.renderOrder = 4;
  return s;
}

/** Soft additive glow card facing into the room (-x) behind the switch plate. */
export function makeSwitchGlow() {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(16, 16, 2, 16, 16, 16);
  grd.addColorStop(0, '#ffffff'); grd.addColorStop(1, '#000000');
  g.fillStyle = grd;
  g.fillRect(0, 0, 32, 32);
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 3.4),
    new THREE.MeshBasicMaterial({
      color: '#ffd96a', alphaMap: new THREE.CanvasTexture(c), transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0,
    }),
  );
  m.rotation.y = -Math.PI / 2;
  m.raycast = () => {};
  return m;
}

export function pulseSwitchHint({ glow, arrow, basePos }, show, hovered, t, dt) {
  const target = hovered ? 0.55 : show ? 0.22 + Math.sin(t * 3.2) * 0.12 : 0;
  glow.material.opacity = THREE.MathUtils.damp(glow.material.opacity, target, 8, dt);
  arrow.material.opacity = THREE.MathUtils.damp(arrow.material.opacity, show ? 1 : 0, 6, dt);
  arrow.position.set(basePos.x - 0.4, basePos.y + 2.1 + Math.sin(t * 4) * 0.18, basePos.z);
}
