import * as THREE from 'three';

/** Apply `#emissive:<k>` tags: unlit faces get brighter than 1 so bloom picks them up,
 *  lit faces get an emissive term of the same colour. */
export function applyEmissive(tagged) {
  for (const obj of tagged.emissive || []) {
    const k = parseFloat(obj.userData.tags.emissive) || 1.5;
    obj.traverse((o) => {
      if (!o.isMesh) return;
      o.material = (Array.isArray(o.material) ? o.material : [o.material]).map((m) => {
        const c = m.clone();
        if (c.isMeshBasicMaterial) c.color.setScalar(k);
        else {
          c.emissive = new THREE.Color(1, 1, 1);
          c.emissiveIntensity = k - 1;
          if (c.map) c.emissiveMap = c.map;
        }
        return c;
      });
    });
  }
}

/** picoCAD-style baked face shading for UI text: unlit material, vertex colours
 *  darkened by face direction (top/front full, sides 78 %, bottom 60 %). */
export function bakePicoShading(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    const g = o.geometry;
    const n = g.getAttribute('normal');
    const c = g.getAttribute('color');
    for (let i = 0; i < n.count; i++) {
      const nx = n.getX(i), ny = n.getY(i), nz = n.getZ(i);
      let k = 1;
      if (ny < -0.5) k = 0.6;
      else if (Math.abs(nx) > 0.5) k = 0.78;
      else if (nz < -0.5) k = 0.7;
      c.setXYZ(i, c.getX(i) * k, c.getY(i) * k, c.getZ(i) * k);
    }
    c.needsUpdate = true;
    o.material = new THREE.MeshBasicMaterial({ vertexColors: true });
    o.castShadow = false;
    o.receiveShadow = false;
  });
}

export function setShadows(root, cast, receive = true) {
  root.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = cast && !o.userData.tags?.noshadow;
      o.receiveShadow = receive;
    }
  });
}

/** Run a mutating setup step once per loaded model (StrictMode renders twice in dev). */
export function once(model, key, fn) {
  model.__once ||= {};
  if (!(key in model.__once)) model.__once[key] = fn();
  return model.__once[key];
}

/** Swap a mesh's material (disposing the old one's map if it was a canvas texture). */
export function setMaterial(mesh, material) {
  const old = mesh.material;
  mesh.material = material;
  if (old && !Array.isArray(old) && old.map?.isCanvasTexture) old.map.dispose();
}
