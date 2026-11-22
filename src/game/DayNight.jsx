import { useFrame } from '@react-three/fiber';
import { useGame } from './store';
import { PICO_UNIFORMS } from '../three/picoMaterial';
import { DAYNIGHT, TINT_DAY, TINT_NIGHT } from './timeOfDay';

const DURATION = 2.6;   // seconds for sunset / sunrise

/** Eases the shared day/night amount toward the light-switch setting and feeds the shader. */
export default function DayNight() {
  useFrame((_, dt) => {
    const { settings, reducedMotion } = useGame.getState();
    const target = settings.night ? 1 : 0;
    // first frame: start already in the saved mode (no sunset animation on page load)
    const step = !DAYNIGHT.init || reducedMotion || !settings.motion ? 1 : Math.min(dt, 0.05) / DURATION;
    DAYNIGHT.init = true;
    advance(target, step);
  });
  return null;
}

function advance(target, step) {
  const t = DAYNIGHT.t;
  DAYNIGHT.t = t < target ? Math.min(target, t + step) : Math.max(target, t - step);
  const e = DAYNIGHT.t * DAYNIGHT.t * (3 - 2 * DAYNIGHT.t);
  PICO_UNIFORMS.uNight.value = e;
  PICO_UNIFORMS.uSunTint.value.lerpColors(TINT_DAY, TINT_NIGHT, e);
  DAYNIGHT.e = e;
}
