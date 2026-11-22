import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';
import { useGame } from './store';
import { menuPose, screenPose } from './poses';

const tmp = new THREE.Vector3();

/** Eases the camera between the menu shot and the CRT close-up.
 *  Reports arrival back to the store (zoomIn -> os, zoomOut -> menu). */
export default function CameraRig() {
  const size = useThree((s) => s.size);
  const target = useRef(null);

  useFrame((state, dt) => {
    const camera = state.camera;
    const { phase, settings, reducedMotion, arrived, backHome } = useGame.getState();
    const aspect = size.width / size.height;
    const toScreen = phase === 'zoomIn' || phase === 'os';
    const goal = toScreen ? screenPose(aspect) : menuPose(aspect);
    const still = reducedMotion || !settings.motion;

    if (!target.current) {          // first frame: snap to the menu shot
      target.current = goal.target.clone();
      camera.position.copy(goal.pos);
      camera.fov = goal.fov;
    }

    // gentle parallax sway on the menu
    if (phase === 'menu' && !still) {
      goal.pos.x += state.pointer.x * 0.9;
      goal.pos.y += state.pointer.y * 0.5;
      goal.target.x += state.pointer.x * 0.25;
      goal.pos.y += Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    }

    const smooth = still ? 0.0001 : toScreen ? 0.45 : 0.4;
    const d = Math.min(dt, 0.05);
    easing.damp3(camera.position, goal.pos, smooth, d);
    easing.damp3(target.current, goal.target, smooth, d);
    camera.fov = THREE.MathUtils.damp(camera.fov, goal.fov, 1 / Math.max(smooth, 0.05), d);
    camera.lookAt(target.current);
    camera.updateProjectionMatrix();

    const dist = tmp.copy(camera.position).sub(goal.pos).length();
    if (phase === 'zoomIn' && dist < 0.08) arrived();
    if (phase === 'zoomOut' && dist < 1.2) backHome();
  });

  return null;
}
