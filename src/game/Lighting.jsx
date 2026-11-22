import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DAYNIGHT, SUN_DAY, SUN_NIGHT } from './timeOfDay';
import { useGame } from './store';

// Warm late-afternoon office (see .claude/STYLE.md → Lighting).
export default function Lighting() {
  const quality = useGame((s) => s.settings.quality);
  const sun = useRef();
  const top = useRef();

  useEffect(() => {
    sun.current?.target.position.set(6, 0, 4);
    sun.current?.target.updateMatrixWorld();
    top.current?.target.position.set(3, 0, -1);
    top.current?.target.updateMatrixWorld();
  }, []);

  // the sun swings over to the moon's position as night falls (its shadow drives the
  // highlights, so moonlight comes through the window too)
  useFrame(() => { if (sun.current) moveSun(sun.current, DAYNIGHT.e); });

  const hi = quality === 'high';
  return (
    <>
      <hemisphereLight args={['#fff4e0', '#8a9a78', 1.25]} />
      <ambientLight color="#ffe6c8" intensity={0.2} />

      {/* Light #0 — sun through the window (x -2..6 on the back wall, z = -20).
          The pico shader reads its shadow map: lit faces step up to a warm highlight. */}
      <directionalLight
        ref={sun}
        position={SUN_DAY.toArray()}
        color="#ffcb88"
        intensity={6}
        castShadow={hi}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.12}
        shadow-radius={2}
        shadow-camera-left={-34}
        shadow-camera-right={34}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
        shadow-camera-near={10}
        shadow-camera-far={140}
      />

      {/* Light #1 — ceiling light, nearly straight down. Only its SHADOW is used:
          upward faces it can't reach step down = contact shadows (picoCAD 2 style).
          Must stay declared after the sun (shadow-map index 1 in picoMaterial.js). */}
      <directionalLight
        ref={top}
        position={[-4, 60, 16]}
        intensity={0.0001}
        castShadow={hi}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.1}
        shadow-radius={2}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
        shadow-camera-near={30}
        shadow-camera-far={90}
      />

      {/* No point lights: picoCAD shading is per-face (sun + sky only). The tubes and
          the CRT glow via emissive faces + bloom instead. */}
    </>
  );
}

function moveSun(light, e) {
  light.position.lerpVectors(SUN_DAY, SUN_NIGHT, e);
}
