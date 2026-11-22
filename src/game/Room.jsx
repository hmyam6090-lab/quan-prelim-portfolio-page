import { useLayoutEffect, useMemo } from 'react';
import { usePico } from '../three/picoLoader';
import { applyEmissive, once } from '../three/prepare';
import Screen from './Screen';

// The office: room shell + furniture + computer (all picoCAD models, shared world space).
export default function Room() {
  const room = usePico('room');
  const furniture = usePico('furniture');
  const computer = usePico('computer');

  useMemo(() => {
    once(room, 'emissive', () => applyEmissive(room.tagged));
    once(furniture, 'emissive', () => applyEmissive(furniture.tagged));
    once(computer, 'emissive', () => applyEmissive(computer.tagged));
  }, [room, furniture, computer]);

  const glass = computer.tagged.screen?.[0];

  useLayoutEffect(() => {
    // The room's walls must block the sun from both sides.
    room.root.traverse((o) => {
      if (!o.isMesh) return;
      for (const m of [].concat(o.material)) m.shadowSide = 2; // DoubleSide
    });
  }, [room]);

  return (
    <group>
      <primitive object={room.root} />
      <primitive object={furniture.root} />
      <primitive object={computer.root} />
      {glass && <Screen glass={glass} />}
    </group>
  );
}
