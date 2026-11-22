import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Room from './Room';
import Lighting from './Lighting';
import Effects from './Effects';
import CameraRig from './CameraRig';
import Menu3D from './Menu3D';
import MenuUI from './ui/MenuUI';
import { useGame } from './store';
import './game.css';

function Ready({ onReady }) {
  useEffect(() => { onReady(); }, [onReady]);
  return null;
}

export default function Experience() {
  const [ready, setReady] = useState(false);
  const quality = useGame((s) => s.settings.quality);
  const phase = useGame((s) => s.phase);

  // Esc backs out of the computer to the main menu.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      const s = useGame.getState();
      if (s.panel) s.closePanel();
      else s.exitToMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={`game phase-${phase}`}>
      <Canvas
        className="game-canvas"
        shadows={{ type: THREE.PCFSoftShadowMap }}
        dpr={quality === 'high' ? [1, 1.75] : [0.75, 1]}
        camera={{ fov: 40, near: 0.3, far: 400, position: [0, 15, 31] }}
        gl={{ antialias: quality !== 'high', powerPreference: 'high-performance' }}
        onCreated={({ gl }) => { gl.setClearColor('#14182b'); }}
      >
        <Suspense fallback={null}>
          <Lighting />
          <Room />
          <Menu3D />
          <CameraRig />
          <Effects />
          <Ready onReady={() => setReady(true)} />
        </Suspense>
      </Canvas>
      <MenuUI />
      <div className={`loading-screen ${ready ? 'done' : ''}`} aria-hidden={ready}>
        <div className="loading-title">LOADING<span className="dots" /></div>
      </div>
    </div>
  );
}
