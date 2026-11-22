import * as THREE from 'three';

/*
 * picoCAD-style shading.
 *
 * picoCAD never blends colours: every pixel is one of the model's 16 palette colours.
 * Each face is shaded by a fixed view-space light onto a per-colour "shade ramp"
 * (shade 2 / shade 1 / base), with whole-face 50 % checkerboards between steps, just
 * like picoCAD's viewport. Two shadow-mapped directional lights add drama: the sun
 * (faces it reaches step up to a warm highlight) and a straight-down ceiling light
 * (upward faces it can't reach step down = contact shadows). Ramps are hue-shifted. Combined with the low-res canvas
 * (Experience.jsx) this reproduces picoCAD's chunky look.
 */

// Shared across every pico material so Settings can retune them live.
export const PICO_UNIFORMS = {
  uDither: { value: 1.0 },     // 0 = hard bands, 1 = Bayer dither
  uHighlight: { value: 0.08 }, // brightness of the sun-patch highlight level
  uNight: { value: 0 },        // 0 day .. 1 night (driven by DayNight.jsx)
  uSunTint: { value: new THREE.Color(1.02, 1.0, 0.96) },  // tint of sun/moon-lit highlights
};

const lum = (c) => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];

/** Auto shade ramps when a project still has identity ramps (our generators):
 *  each colour's shade is the nearest *darker* palette colour to colour * 0.62,
 *  or that darkened colour itself if the palette has nothing close (picoCAD would
 *  force a palette colour; we allow off-palette darks to keep hues). */
export function buildRamps(colors, sp1, sp2) {
  const identity = (sp) => !sp || sp.every((v, i) => v === i);
  // Pixel-art style shading: shadows get darker AND cooler (towards dusky purple),
  // so the room reads warm in light and cool in shade instead of just grey-darker.
  const mix = (a, b, t) => a.map((v, i) => v * (1 - t) + b[i] * t);
  const shade1 = (c) => mix(c.map((v) => v * 0.7), [0.2, 0.17, 0.38], 0.07);
  const shade2 = (c) => mix(c.map((v) => v * 0.7), [0.13, 0.1, 0.28], 0.1);
  const nearestDark = (c, selfIdx, darker = shade1) => {
    const target = darker(c);
    let best = null;
    let bestD = Infinity;
    colors.forEach((p, j) => {
      if (j === selfIdx || j === 0 || lum(p) >= lum(c) - 0.02) return;
      const d = Math.hypot(p[0] - target[0], p[1] - target[1], p[2] - target[2]);
      if (d < bestD) { bestD = d; best = p; }
    });
    return bestD < 0.05 ? best : target;
  };
  let s1;
  let s2;
  if (identity(sp1)) {
    s1 = colors.map((c, i) => nearestDark(c, i));
    s2 = s1.map((c) => nearestDark(c, -1, shade2));
  } else {
    s1 = sp1.map((j) => colors[j]);
    s2 = (identity(sp2) ? s1.map((c) => nearestDark(c, -1, shade2)) : sp2.map((j) => colors[j]));
  }
  const toLinear = (arr) => arr.map((c) => new THREE.Color().setRGB(c[0], c[1], c[2], THREE.SRGBColorSpace));
  return { base: toLinear(colors), s1: toLinear(s1), s2: toLinear(s2) };
}

const PARS = /* glsl */`
uniform vec3 uPal[16];
uniform vec3 uS1[16];
uniform vec3 uS2[16];
uniform float uDither;
uniform float uHighlight;
uniform float uNight;
uniform vec3 uSunTint;
#ifdef PICO_TEX
  uniform sampler2D uIdxMap;
#else
  varying float vPalIdx;
#endif
vec3 picoLevel(int idx, float lv) {
  if (lv >= 3.0) return uPal[idx] * (1.0 + uHighlight) * uSunTint;
  if (lv >= 2.0) return uPal[idx];
  if (lv >= 1.0) return uS1[idx];
  return uS2[idx];
}
`;

const FRAG = /* glsl */`
  // 1) picoCAD face shading: a FIXED light in view space (up-left, towards the viewer).
  //    Every face lands on a solid step of its colour's ramp; in-between angles get a
  //    whole-face 50 % checkerboard. No gradients.
  vec3 picoN = normalize(normal);
  float picoD = dot(picoN, normalize(vec3(-0.35, 0.6, 0.72)));
  float picoL;
  if (picoD >= 0.43) picoL = 2.0;
  else if (picoD >= 0.39) picoL = 1.5;
  else if (picoD >= -0.06) picoL = 1.0;
  else if (picoD >= -0.1) picoL = 0.5;
  else picoL = 0.0;
  // 2) Sun (directional light #0): faces it reaches step UP to a warm highlight.
  // 3) Ceiling light (directional light #1, straight down): upward faces it can't reach
  //    step DOWN -> picoCAD 2-style contact/drop shadows under desks, chair, shelves.
  #if NUM_DIR_LIGHT_SHADOWS > 0
    float picoSunSh = receiveShadow ? getShadow(directionalShadowMap[0], directionalLightShadows[0].shadowMapSize,
      directionalLightShadows[0].shadowIntensity, directionalLightShadows[0].shadowBias,
      directionalLightShadows[0].shadowRadius, vDirectionalShadowCoord[0]) : 1.0;
    if (picoSunSh > 0.5 && dot(picoN, directionalLights[0].direction) > 0.08) picoL += 1.0;
  #endif
  #if NUM_DIR_LIGHT_SHADOWS > 1
    float picoTopSh = receiveShadow ? getShadow(directionalShadowMap[1], directionalLightShadows[1].shadowMapSize,
      directionalLightShadows[1].shadowIntensity, directionalLightShadows[1].shadowBias,
      directionalLightShadows[1].shadowRadius, vDirectionalShadowCoord[1]) : 1.0;
    vec3 picoUp = normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
    if (picoTopSh < 0.5 && dot(picoN, picoUp) > 0.5) picoL -= 1.0;
  #endif
  // night: everything drops one step (the in-between fraction gives a dithered fade)
  picoL = max(picoL - uNight, 0.0);
  #ifdef PICO_TEX
    int picoIdx = int(texture2D(uIdxMap, vMapUv).r * 255.0 / 16.0);
  #else
    int picoIdx = int(vPalIdx + 0.5);
  #endif
  float picoStep = floor(picoL);
  if (fract(picoL) > 0.25) picoStep += uDither > 0.5 ? mod(floor(gl_FragCoord.x) + floor(gl_FragCoord.y), 2.0) : 0.0;
  outgoingLight = picoLevel(picoIdx, min(picoStep, 3.0)) * mix(vec3(1.0), vec3(0.58, 0.64, 1.0), uNight);
  #include <opaque_fragment>
`;

/** Lambert material whose output is snapped to the model's palette ramps. */
export function makePicoMaterial({ textured, map, idxMap, ramps, side }) {
  const mat = new THREE.MeshLambertMaterial({
    side,
    map: textured ? map : null,
    vertexColors: !textured,
    alphaTest: textured ? 0.5 : 0,
  });
  mat.defines = textured ? { PICO_TEX: '' } : {};
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uPal = { value: ramps.base };
    shader.uniforms.uS1 = { value: ramps.s1 };
    shader.uniforms.uS2 = { value: ramps.s2 };
    Object.assign(shader.uniforms, PICO_UNIFORMS);
    if (textured) shader.uniforms.uIdxMap = { value: idxMap };
    else {
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', 'attribute float palIdx;\nvarying float vPalIdx;\n#include <common>')
        .replace('#include <uv_vertex>', '#include <uv_vertex>\nvPalIdx = palIdx;');
    }
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${PARS}`)
      .replace('#include <opaque_fragment>', FRAG);
  };
  mat.customProgramCacheKey = () => (textured ? 'pico-tex' : 'pico-col');
  mat.userData.pico = true;
  return mat;
}

/** Index texture: same layout as the colour texture but storing palette indices. */
export function buildIndexTexture(pixels) {
  const data = new Uint8Array(128 * 128 * 4);
  for (let i = 0; i < 128 * 128; i++) {
    data[i * 4] = parseInt(pixels[i], 16) * 16 + 8;
    data[i * 4 + 3] = 255;
  }
  const t = new THREE.DataTexture(data, 128, 128, THREE.RGBAFormat);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.flipY = false;
  t.needsUpdate = true;
  return t;
}
