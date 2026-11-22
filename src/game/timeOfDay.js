import * as THREE from 'three';

/** Shared, frame-animated day/night amount: t = 0 day .. 1 night (see DayNight.jsx). */
export const DAYNIGHT = { t: 0, e: 0, init: false };

export const SUN_DAY = new THREE.Vector3(-6, 40, -62);
export const SUN_NIGHT = new THREE.Vector3(10, 28, -62);   // the moon, a bit lower / to the right
export const TINT_DAY = new THREE.Color(1.02, 1.0, 0.96);
export const TINT_NIGHT = new THREE.Color(0.8, 0.9, 1.3);
