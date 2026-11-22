import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';
import { usePico } from '../three/picoLoader';
import { bakePicoShading, once } from '../three/prepare';
import { useGame } from './store';
import { menuPose } from './poses';
import { playSound } from './sound';

const DEPTH = 15;          // distance of the title/menu plane in front of the menu camera
const _box = new THREE.Box3();
const _size = new THREE.Vector3();

/** Places `obj` so its bounding box's left/top edge sits at (x, y) (local, pre-scale). */
function anchorTopLeft(obj) {
  obj.updateMatrixWorld(true);
  _box.setFromObject(obj);
  const pivot = new THREE.Group();
  obj.position.sub(new THREE.Vector3(_box.min.x, _box.max.y, 0));
  pivot.add(obj);
  _box.getSize(_size);
  pivot.userData.w = _size.x;
  pivot.userData.h = _size.y;
  return pivot;
}

const ACTIONS = {
  play: () => useGame.getState().play(),
  settings: () => useGame.getState().openPanel('settings'),
  credits: () => useGame.getState().openPanel('credits'),
  quit: () => useGame.getState().openPanel('quit'),
};

export default function Menu3D() {
  const title = usePico('title');
  const menu = usePico('menu');
  const size = useThree((s) => s.size);
  const plane = useRef();
  const hovered = useGame((s) => s.hovered);
  const setHovered = useGame((s) => s.setHovered);

  const parts = useMemo(() => once(title, 'menu-parts', () => {
    bakePicoShading(title.root);
    bakePicoShading(menu.root);
    const quanhoang = title.root.getObjectByName('quanhoang');
    const portfolio = title.root.getObjectByName('portfolio');
    const letters = quanhoang.children.map((l) => ({ obj: l, y: l.position.y }));
    const items = Object.keys(ACTIONS).map((id) => {
      const obj = menu.root.getObjectByName(id);
      obj.position.set(0, 0, 0);
      obj.userData.menuId = id;
      const pivot = anchorTopLeft(obj);
      // invisible hit area so the gaps between letters are clickable too
      const hit = new THREE.Mesh(
        new THREE.PlaneGeometry(pivot.userData.w + 4, pivot.userData.h + 3),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      );
      hit.position.set(pivot.userData.w / 2, -pivot.userData.h / 2, 0.5);
      hit.userData.menuId = id;
      pivot.add(hit);
      return { id, pivot };
    });
    return {
      title: anchorTopLeft(quanhoang),
      portfolio: anchorTopLeft(portfolio),
      letters,
      items,
    };
  }), [title, menu]);

  // Layout in "plane space": a plane DEPTH units in front of the menu camera, x right, y up.
  useLayoutEffect(() => {
    const aspect = size.width / size.height;
    const pose = menuPose(aspect);
    const cam = new THREE.PerspectiveCamera(pose.fov, aspect);
    cam.position.copy(pose.pos);
    cam.lookAt(pose.target);
    cam.updateMatrixWorld();
    const g = plane.current;
    g.position.copy(new THREE.Vector3(0, 0, -DEPTH).applyMatrix4(cam.matrixWorld));
    g.quaternion.copy(cam.quaternion);

    const halfH = DEPTH * Math.tan(THREE.MathUtils.degToRad(pose.fov / 2));
    const halfW = halfH * aspect;
    const portrait = aspect < 1;
    const margin = halfW * (portrait ? 0.08 : 0.06);

    // title: ~44 % of the width on desktop, full width on portrait
    const t = parts.title;
    const ts = Math.min(((portrait ? 1.84 : 0.88) * halfW) / t.userData.w, (0.34 * halfH) / t.userData.h);
    t.scale.setScalar(ts);
    t.position.set(-halfW + margin, halfH - halfH * 0.1, 0);
    const p = parts.portfolio;
    p.scale.setScalar(ts);
    p.position.set(t.position.x + t.userData.w * ts - p.userData.w * ts - 1.2 * ts,
      t.position.y - t.userData.h * ts - 0.4 * ts, 0.3);

    // menu items: stacked under the title, left aligned
    const ms = Math.min((portrait ? 0.062 : 0.09) * halfH, (portrait ? 0.16 : 0.2) * halfW) / 7;
    const top = portrait ? -halfH * 0.38 : halfH * 0.12;
    parts.items.forEach(({ pivot }, i) => {
      pivot.scale.setScalar(ms);
      pivot.position.set(-halfW + margin + (portrait ? 0 : 0.4 * ms), top - i * 11.5 * ms, 0);
      pivot.userData.baseX = pivot.position.x;
    });
  }, [size, parts]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    parts.letters.forEach((l, i) => { l.obj.position.y = l.y + Math.sin(t * 2.2 - i * 0.55) * 0.35; });
    parts.items.forEach(({ id, pivot }) => {
      const on = hovered === id;
      easing.damp(pivot.position, 'x', pivot.userData.baseX + (on ? pivot.scale.x * 3 : 0), 0.08, dt);
      const s = pivot.userData.s ?? 1;
      pivot.userData.s = THREE.MathUtils.damp(s, on ? 1.12 : 1, 14, dt);
      pivot.children[0].scale.setScalar(pivot.userData.s);
      pivot.children[0].rotation.z = on ? Math.sin(t * 9) * 0.03 : 0;
    });
  });

  const phase = useGame((s) => s.phase);
  const panel = useGame((s) => s.panel);
  const interactive = phase === 'menu' && !panel;

  const onOver = (e) => {
    if (!interactive) return;
    e.stopPropagation();
    const id = findId(e.object);
    if (id && id !== useGame.getState().hovered) { setHovered(id); playSound('hover'); }
    document.body.style.cursor = 'pointer';
  };
  const onOut = () => { setHovered(null); document.body.style.cursor = ''; };
  const onClick = (e) => {
    if (!interactive) return;
    e.stopPropagation();
    const id = findId(e.object);
    if (!id) return;
    playSound('click');
    document.body.style.cursor = '';
    setHovered(null);
    ACTIONS[id]();
  };

  return (
    <group ref={plane}>
      <primitive object={parts.title} />
      <primitive object={parts.portfolio} />
      {parts.items.map(({ id, pivot }) => (
        <primitive key={id} object={pivot} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick} />
      ))}
    </group>
  );
}

function findId(o) {
  while (o) {
    if (o.userData?.menuId) return o.userData.menuId;
    o = o.parent;
  }
  return null;
}
