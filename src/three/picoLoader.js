import * as THREE from 'three';
import { suspend } from 'suspend-react';
import { buildIndexTexture, buildRamps, makePicoMaterial } from './picoMaterial';

/*
 * Loads a picoCAD 2 project (JSON) into a three.js Group.
 *
 * - Texture: 128x128 palette indices -> nearest-filtered sRGB DataTexture.
 *   Pixels using `transparent_color` become alpha 0 (cut out with alphaTest).
 * - Faces: `notex` faces use their palette colour as a vertex colour, other faces
 *   sample the texture. `dbl` -> double sided, `noshade` -> unlit (MeshBasic).
 *   Lit faces get picoCAD palette-ramp + dither shading (see picoMaterial.js).
 * - Node names may carry tags: "crt glass #screen #emissive:2.5".
 *   They end up in `object.userData.tags` and in the returned `tagged` map.
 */

const TAG_RE = /#([a-z]+)(?::([\w.-]+))?/gi;

function parseTags(name) {
  const tags = {};
  for (const m of name.matchAll(TAG_RE)) tags[m[1].toLowerCase()] = m[2] ?? true;
  return tags;
}

function buildTexture(tex) {
  const data = new Uint8Array(128 * 128 * 4);
  const cols = tex.colors.map(c => c.map(v => Math.round(v * 255)));
  const px = tex.pixels;
  for (let i = 0; i < 128 * 128; i++) {
    const idx = parseInt(px[i], 16);
    const c = cols[idx] || [255, 0, 255];
    data[i * 4] = c[0];
    data[i * 4 + 1] = c[1];
    data[i * 4 + 2] = c[2];
    data[i * 4 + 3] = idx === tex.transparent_color ? 0 : 255;
  }
  // picoCAD row 0 is the top of the texture and v=0 -> keep flipY false.
  const t = new THREE.DataTexture(data, 128, 128, THREE.RGBAFormat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.flipY = false;
  t.needsUpdate = true;
  return t;
}

function makeMaterialFactory(map, idxMap, ramps) {
  const cache = new Map();
  return (textured, dbl, unlit) => {
    const key = `${textured}|${dbl}|${unlit}`;
    if (cache.has(key)) return cache.get(key);
    const common = {
      side: dbl ? THREE.DoubleSide : THREE.FrontSide,
      vertexColors: !textured,
      map: textured ? map : null,
      alphaTest: textured ? 0.5 : 0,
    };
    // Unlit faces keep their exact colour; lit faces use picoCAD palette-ramp dithering.
    const mat = unlit
      ? new THREE.MeshBasicMaterial({ ...common, toneMapped: false })
      : makePicoMaterial({ textured, map, idxMap, ramps, side: common.side });
    mat.userData.textured = textured;
    mat.userData.unlit = unlit;
    cache.set(key, mat);
    return mat;
  };
}

function buildMesh(meshData, colors, getMat) {
  const V = meshData.vertices;
  const buckets = new Map(); // matKey -> {pos, nor, uv, col}

  for (const f of meshData.faces) {
    const textured = !f.notex;
    const key = `${textured}|${!!f.dbl}|${!!f.noshade}`;
    if (!buckets.has(key)) buckets.set(key, { textured, dbl: !!f.dbl, unlit: !!f.noshade, pos: [], nor: [], uv: [], col: [], idx: [] });
    const b = buckets.get(key);

    const pts = f.vertex_ids.map(id => new THREE.Vector3(V[(id - 1) * 3], V[(id - 1) * 3 + 1], V[(id - 1) * 3 + 2]));
    const uvs = f.vertex_ids.map((_, i) => [f.uvs[i * 2] ?? 0, f.uvs[i * 2 + 1] ?? 0]);
    // Newell normal (robust for slightly non-planar quads)
    const n = new THREE.Vector3();
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], c = pts[(i + 1) % pts.length];
      n.x += (a.y - c.y) * (a.z + c.z);
      n.y += (a.z - c.z) * (a.x + c.x);
      n.z += (a.x - c.x) * (a.y + c.y);
    }
    n.normalize();
    const color = new THREE.Color().setRGB(...(colors[f.color] || [1, 0, 1]), THREE.SRGBColorSpace);

    for (let i = 1; i < pts.length - 1; i++) {
      for (const j of [0, i, i + 1]) {
        b.pos.push(pts[j].x, pts[j].y, pts[j].z);
        b.nor.push(n.x, n.y, n.z);
        b.uv.push(uvs[j][0], uvs[j][1]);
        b.col.push(color.r, color.g, color.b);
        b.idx.push(f.color);
      }
    }
  }

  const pos = [], nor = [], uv = [], col = [], idx = [], materials = [];
  const geo = new THREE.BufferGeometry();
  let start = 0;
  for (const b of buckets.values()) {
    for (const k of ['pos', 'nor', 'uv', 'col', 'idx']) { const dst = { pos, nor, uv, col, idx }[k]; for (const v of b[k]) dst.push(v); }
    const count = b.pos.length / 3;
    geo.addGroup(start, count, materials.length);
    materials.push(getMat(b.textured, b.dbl, b.unlit));
    start += count;
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setAttribute('palIdx', new THREE.Float32BufferAttribute(idx, 1));
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return new THREE.Mesh(geo, materials);
}

export function parsePico(project) {
  const tex = project.texture;
  const map = buildTexture(tex);
  const idxMap = buildIndexTexture(tex.pixels);
  const ramps = buildRamps(tex.colors, tex.shade_pal_1, tex.shade_pal_2);
  const getMat = makeMaterialFactory(map, idxMap, ramps);
  const tagged = {};

  const walk = (n) => {
    const tags = parseTags(n.name || '');
    const obj = n.mesh ? buildMesh(n.mesh, tex.colors, getMat) : new THREE.Group();
    obj.name = (n.name || '').replace(TAG_RE, '').trim();
    obj.userData.tags = tags;
    const t = n.transform || {};
    if (t.pos) obj.position.set(t.pos.x, t.pos.y, t.pos.z);
    // picoCAD rotation unit is assumed to be turns (our generators never rotate).
    if (t.rot) obj.rotation.set(t.rot.x * Math.PI * 2, t.rot.y * Math.PI * 2, t.rot.z * Math.PI * 2);
    if (t.scale) obj.scale.set(t.scale.x, t.scale.y, t.scale.z);
    if (n.visible === false) obj.visible = false;
    if (n.mesh) {
      obj.castShadow = !tags.noshadow;
      obj.receiveShadow = true;
    }
    for (const k of Object.keys(tags)) (tagged[k] ||= []).push(obj);
    for (const c of n.children || []) obj.add(walk(c));
    return obj;
  };

  const root = walk(project.graph);
  return { root, tagged, texture: map, colors: tex.colors };
}

export async function loadPico(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`picoCAD model failed to load: ${url}`);
  return parsePico(await res.json());
}

/** Suspense hook. Every call site gets its own parsed copy (models are used once). */
export function usePico(name) {
  return suspend(() => loadPico(`${import.meta.env.BASE_URL}models/${name}.picocad.json`), ['pico', name]);
}
