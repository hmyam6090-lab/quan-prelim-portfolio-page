import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from './store';
import { RENDER_ORDER } from './renderOrder';

/*
 * Screen-space "camera filter" for the main menu: darkens the left side (and a touch of
 * the right) so the 3D title + buttons pop. It is a full-screen quad glued to the camera,
 * drawn AFTER the room but BEFORE the title/menu (render order 5; the text uses 7), so the
 * text itself is never darkened. Fades out when PLAY / skip starts the zoom.
 */

function vignetteTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#000';                              // alphaMap reads the green channel:
  g.fillRect(0, 0, 128, 64);                         // grey levels on an opaque black base
  const h = g.createLinearGradient(0, 0, 128, 0);
  // stops account for the 1.35x overscan (visible area is roughly 0.13..0.87)
  h.addColorStop(0, 'rgba(255,255,255,1)');
  h.addColorStop(0.14, 'rgba(255,255,255,0.92)');
  h.addColorStop(0.3, 'rgba(255,255,255,0.5)');
  h.addColorStop(0.52, 'rgba(255,255,255,0.0)');
  h.addColorStop(0.8, 'rgba(255,255,255,0.0)');
  h.addColorStop(1, 'rgba(255,255,255,0.55)');
  g.fillStyle = h;
  g.fillRect(0, 0, 128, 64);
  const v = g.createLinearGradient(0, 0, 0, 64);   // a little top/bottom falloff
  v.addColorStop(0, 'rgba(255,255,255,0.25)');
  v.addColorStop(0.25, 'rgba(255,255,255,0)');
  v.addColorStop(0.75, 'rgba(255,255,255,0)');
  v.addColorStop(1, 'rgba(255,255,255,0.3)');
  g.fillStyle = v;
  g.fillRect(0, 0, 128, 64);
  return new THREE.CanvasTexture(c);
}

const _fwd = new THREE.Vector3();
const OVERSCAN = 1.35;

export default function CameraVignette() {
  const mesh = useMemo(() => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        color: '#05040c', alphaMap: vignetteTexture(), transparent: true,
        depthTest: false, depthWrite: false, opacity: 0, toneMapped: false,
      }),
    );
    m.renderOrder = RENDER_ORDER.vignette;
    m.frustumCulled = false;
    m.raycast = () => {};
    return m;
  }, []);

  useFrame(({ camera }, dt) => {
    const { phase } = useGame.getState();
    const d = 1;                                       // 1 unit in front of the lens
    const hh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * d;
    camera.getWorldDirection(_fwd);
    placeOnLens(mesh, camera, _fwd, d, hh * 2 * camera.aspect, hh * 2,
      THREE.MathUtils.damp(mesh.material.opacity, phase === 'menu' ? 0.82 : 0, phase === 'menu' ? 3 : 6, dt));
  });

  return <primitive object={mesh} />;
}

function placeOnLens(mesh, camera, fwd, d, w, h, opacity) {
  mesh.position.copy(camera.position).addScaledVector(fwd, d);
  mesh.quaternion.copy(camera.quaternion);
  mesh.scale.set(w * OVERSCAN, h * OVERSCAN, 1);   // overscan so camera moves never reveal an edge
  mesh.material.opacity = opacity;
}
