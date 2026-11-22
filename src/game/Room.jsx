import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePico } from '../three/picoLoader';
import { applyEmissive, once } from '../three/prepare';
import { useGame } from './store';
import { playSound } from './sound';
import { DAYNIGHT } from './timeOfDay';
import {
  applyNightToEmissive, collectEmissive, easeDrawer, flipLever, hasTag,
  makeArrowSprite, makeSwitchGlow, makeWallFrame, pulseSwitchHint, showOutline,
} from './roomFx';
import Screen from './Screen';

const REOPEN_MS = 1400;   // drawer slides back out this long after the pointer leaves

// The office: room shell + furniture + decor + poster + computer (picoCAD models, one
// shared world space) and the interactive bits (desk drawer, light switch).
export default function Room() {
  const room = usePico('room');
  const furniture = usePico('furniture');
  const decor = usePico('decor');
  const poster = usePico('poster');
  const computer = usePico('computer');
  const [switchUsed, setSwitchUsed] = useState(false);
  const hover = useRef({ drawer: false, drawerLeft: 0, switch: false });

  const fx = useMemo(() => {
    for (const [m, k] of [[room, 'r'], [furniture, 'f'], [decor, 'd'], [poster, 'p'], [computer, 'c']]) {
      once(m, `emissive-${k}`, () => applyEmissive(m.tagged));
    }
    const sw = room.tagged.switch?.[0];
    const swBox = sw ? new THREE.Box3().setFromObject(sw) : null;
    const basePos = swBox ? swBox.getCenter(new THREE.Vector3()) : new THREE.Vector3();
    const glow = makeSwitchGlow();
    glow.position.set(basePos.x - 0.3, basePos.y, basePos.z);
    return {
      emissive: collectEmissive(room.tagged),
      drawer: furniture.tagged.drawer?.[0],
      lever: room.tagged.lever?.[0],
      switchHulls: swBox ? makeWallFrame(swBox) : [],
      glow,
      arrow: makeArrowSprite(),
      basePos,
    };
  }, [room, furniture, decor, poster, computer]);

  const glass = computer.tagged.screen?.[0];

  useLayoutEffect(() => {
    // The room's walls must block the sun from both sides.
    room.root.traverse((o) => {
      if (!o.isMesh) return;
      for (const m of [].concat(o.material)) m.shadowSide = 2; // DoubleSide
    });
  }, [room]);

  useFrame((state, dt) => {
    const { phase, settings } = useGame.getState();
    applyNightToEmissive(fx.emissive, DAYNIGHT.e);
    if (fx.lever) flipLever(fx.lever, settings.night, dt);
    if (fx.drawer) {
      const h = hover.current;
      const recentlyLeft = performance.now() - h.drawerLeft < REOPEN_MS;
      easeDrawer(fx.drawer, !(h.drawer || recentlyLeft), dt);
    }
    pulseSwitchHint(fx, phase === 'menu' && !switchUsed, phase === 'menu' && hover.current.switch,
      state.clock.elapsedTime, dt);
  });

  // pointer handling for the furniture (drawer) and the room (switch); menu phase only
  const interactive = () => useGame.getState().phase === 'menu' && !useGame.getState().panel;
  const setCursor = (on) => { document.body.style.cursor = on ? 'pointer' : ''; };

  // R3F calls these once per intersected surface (nearest first): only the nearest counts,
  // otherwise the wall behind the switch / desk behind the drawer would cancel the hover.
  const onFurnitureMove = (e) => {
    if (!interactive()) return;
    e.stopPropagation();
    const over = hasTag(e.object, 'drawer');
    if (over !== hover.current.drawer) {
      hover.current.drawer = over;
      if (!over) hover.current.drawerLeft = performance.now();
      else playSound('drawer');
    }
  };
  const onFurnitureOut = () => {
    if (hover.current.drawer) hover.current.drawerLeft = performance.now();
    hover.current.drawer = false;
  };

  const onRoomMove = (e) => {
    if (!interactive()) return;
    e.stopPropagation();
    const over = hasTag(e.object, 'switch');
    if (over !== hover.current.switch) {
      hover.current.switch = over;
      setCursor(over);
      showOutline(fx.switchHulls, over);
    }
  };
  const onRoomOut = () => {
    if (hover.current.switch) { setCursor(false); showOutline(fx.switchHulls, false); }
    hover.current.switch = false;
  };
  const onRoomClick = (e) => {
    if (!interactive() || !hasTag(e.object, 'switch')) return;
    e.stopPropagation();
    playSound('switch');
    useGame.getState().toggleNight();
    setSwitchUsed(true);
  };

  return (
    <group>
      <primitive object={room.root} onPointerMove={onRoomMove} onPointerOut={onRoomOut} onClick={onRoomClick} />
      <primitive object={furniture.root} onPointerMove={onFurnitureMove} onPointerOut={onFurnitureOut} />
      <primitive object={decor.root} />
      <primitive object={poster.root} />
      <primitive object={computer.root} />
      <primitive object={fx.glow} />
      <primitive object={fx.arrow} />
      {fx.switchHulls.map((m, i) => <primitive key={`swf${i}`} object={m} />)}
      {glass && <Screen glass={glass} />}
    </group>
  );
}
