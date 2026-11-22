import { Suspense, useEffect, useState } from 'react';
import { PICO_UNIFORMS } from '../three/picoMaterial';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Room from './Room';
import Lighting from './Lighting';
import SunBeams from './SunBeams';
import Sky from './Sky';
import DayNight from './DayNight';
import CameraVignette from './CameraVignette';
import Effects from './Effects';
import CameraRig from './CameraRig';
import Menu3D from './Menu3D';
import MenuUI from './ui/MenuUI';
import CrtLens from './CrtLens';
import { useGame } from './store';
import './game.css';

// Fixed picoCAD-style render resolution: the scene is drawn this many pixels tall and
// scaled up with nearest-neighbour filtering (not user-configurable).
const PIXEL_HEIGHT = 420;

function useDpr() {
  const calc = () => Math.min(1, PIXEL_HEIGHT / window.innerHeight);
  const [dpr, setDpr] = useState(calc);
  useEffect(() => {
    const on = () => setDpr(calc());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return dpr;
}

function Ready({ onReady }) {
  useEffect(() => { onReady(); }, [onReady]);
  return null;
}

export default function Experience() {
  const [ready, setReady] = useState(false);
  const dither = useGame((s) => s.settings.dither);
  const phase = useGame((s) => s.phase);
  const dpr = useDpr();
  const crt = useGame((s) => s.settings.crt);
  const lens = crt && phase !== 'menu';
  const pixelated = true;

  useEffect(() => { PICO_UNIFORMS.uDither.value = dither ? 1 : 0; }, [dither]);

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
    <div className={`game phase-${phase} ${pixelated ? 'pixelated' : ''} ${lens ? 'lens' : ''}`}>
      <CrtLens />
      <Canvas
        className="game-canvas"
        shadows={{ type: THREE.PCFShadowMap }}
        dpr={dpr}
        camera={{ fov: 40, near: 0.3, far: 400, position: [0, 15, 31] }}
        gl={{ antialias: !pixelated, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => { gl.setClearColor('#14182b'); }}
      >
        <Suspense fallback={null}>
          <Lighting />
          <DayNight />
          <Room />
          <Sky />
          <SunBeams />
          <Menu3D />
          <CameraRig />
          {/* after the rig so it follows this frame's camera, not last frame's */}
          <CameraVignette />
          <Effects />
          <Ready onReady={() => setReady(true)} />
        </Suspense>
      </Canvas>
      <div className="crt-vignette" aria-hidden />
      <MenuUI />
      <div className={`loading-screen ${ready ? 'done' : ''}`} aria-hidden={ready}>
        <div className="loading-title">LOADING<span className="dots" /></div>
      </div>
    </div>
  );
}
