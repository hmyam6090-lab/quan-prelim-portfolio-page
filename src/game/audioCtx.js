// One shared WebAudio context for music + synthesized SFX (created lazily; browsers only
// allow audio to start after a user gesture).
let ctx = null;

export function getAudioCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}
