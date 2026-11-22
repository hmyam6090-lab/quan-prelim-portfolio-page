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

/** White "inverted hull" hover outline: for every mesh under `root`, a copy whose faces are
 *  pushed out along their own (flat) normals by `thickness` and drawn back-face only, so it
 *  only shows as a rim around the silhouette. Hidden until hover. */
const OUTLINE_MAT = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.BackSide, toneMapped: false });
export function addOutline(root, thickness = 0.12) {
  const hulls = [];
  const meshes = [];
  root.traverse((o) => { if (o.isMesh && !o.userData.outline) meshes.push(o); });
  for (const m of meshes) {
    const g = new THREE.BufferGeometry();
    const pos = m.geometry.getAttribute('position');
    const nor = m.geometry.getAttribute('normal');
    const out = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      out[i * 3] = pos.getX(i) + nor.getX(i) * thickness;
      out[i * 3 + 1] = pos.getY(i) + nor.getY(i) * thickness;
      out[i * 3 + 2] = pos.getZ(i) + nor.getZ(i) * thickness;
    }
    g.setAttribute('position', new THREE.BufferAttribute(out, 3));
    const hull = new THREE.Mesh(g, OUTLINE_MAT);
    hull.userData.outline = true;
    hull.visible = false;
    hull.raycast = () => {};
    hull.castShadow = false;
    m.add(hull);
    hulls.push(hull);
  }
  return hulls;
}

export function showOutline(hulls, on) {
  for (const h of hulls) h.visible = on;
}

/** Hover outline for flat things mounted on the right wall (the light switch): a white
 *  card on the wall, slightly larger than the object, facing into the room (-x). */
export function makeWallFrame(box, border = 0.14) {
  const size = box.getSize(new THREE.Vector3());
  const c = box.getCenter(new THREE.Vector3());
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size.z + border * 2, size.y + border * 2),
    new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
  );
  m.rotation.y = -Math.PI / 2;
  m.position.set(box.max.x - 0.01, c.y, c.z);
  m.visible = false;
  m.raycast = () => {};
  return [m];
}
