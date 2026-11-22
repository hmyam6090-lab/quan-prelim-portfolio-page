import { useEffect, useRef } from 'react';
import { useGame } from './store';

// Warm late-afternoon office (see .claude/STYLE.md → Lighting).
export default function Lighting() {
  const quality = useGame((s) => s.settings.quality);
  const sun = useRef();

  useEffect(() => {
    if (sun.current) sun.current.target.position.set(6, 0, 4);
    sun.current?.target.updateMatrixWorld();
  }, []);

  const hi = quality === 'high';
  return (
    <>
      <hemisphereLight args={['#ffeccc', '#5f7a4e', 0.9]} />
      <ambientLight color="#ffe6c8" intensity={0.2} />

      {/* sun through the window (window is at x 4..12 on the back wall, z = -20) */}
      <directionalLight
        ref={sun}
        position={[-6, 40, -62]}
        color="#ffcb88"
        intensity={6}
        castShadow={hi}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.06}
        shadow-radius={4}
        shadow-camera-left={-34}
        shadow-camera-right={34}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
        shadow-camera-near={10}
        shadow-camera-far={140}
      />

      {/* soft warm fill from the camera side so the front of the desk isn't black */}
      <directionalLight position={[-10, 20, 40]} color="#ffe2c0" intensity={0.55} />

      {/* fluorescent fixtures */}
      <pointLight position={[-3, 23.5, 4.5]} color="#fff6e0" intensity={260} distance={70} decay={1.6} />
      <pointLight position={[16, 23.5, -10.5]} color="#fff6e0" intensity={200} distance={60} decay={1.6} />

      {/* CRT glow */}
      <pointLight position={[8, 11.2, 1.2]} color="#7aa6ff" intensity={14} distance={12} decay={1.8} />
    </>
  );
}
