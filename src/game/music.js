import { create } from 'zustand';
import { useGame } from './store';
import { getAudioCtx } from './audioCtx';

/*
 * Background music. All tracks are openly licensed from Newgrounds — credit kept here and
 * in the Credits panel. The first track is random per page load; tracks then cycle.
 * `startMusic()` runs as soon as the scene has loaded; if the browser blocks autoplay it is
 * retried on the first pointer/key event.
 */
export const TRACKS = [
  {
    id: 'crazy-tutorial', title: 'Crazy Tutorial', artist: 'MarcoVicii',
    artistUrl: 'https://marcovicii.newgrounds.com/',
    url: 'https://www.newgrounds.com/audio/listen/1647070', src: 'music/crazy-tutorial.mp3',
  },
  {
    id: 'the-hub-home', title: 'The Hub Home', artist: 'ConnorHeather',
    artistUrl: 'https://connorheather.newgrounds.com/',
    url: 'https://www.newgrounds.com/audio/listen/1641690', src: 'music/the-hub-home.mp3',
  },
  {
    id: 'off-shore', title: 'Off-Shore', artist: 'ItsOceanus',
    url: 'https://www.newgrounds.com/audio/listen/1639862', src: 'music/off-shore.mp3',
  },
];

export const useMusic = create(() => ({
  index: Math.floor(Math.random() * TRACKS.length),
  playing: false,
  toastId: 0,          // bumps whenever a track starts -> "now playing" toast
}));

let audio = null;
let analyser = null;
let freq = null;

function ensureAudio() {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = 'auto';
  audio.addEventListener('ended', () => nextTrack(false));
  audio.addEventListener('play', () => useMusic.setState({ playing: true }));
  audio.addEventListener('pause', () => useMusic.setState({ playing: false }));
  try {   // route through an analyser so the radio can bounce to the music
    const ac = getAudioCtx();
    if (ac) {
      const srcNode = ac.createMediaElementSource(audio);
      analyser = ac.createAnalyser();
      analyser.fftSize = 256;
      freq = new Uint8Array(analyser.frequencyBinCount);
      srcNode.connect(analyser).connect(ac.destination);
    }
  } catch { analyser = null; }
  return audio;
}

// The music slider maps to a gentler element volume so music sits under the SFX.
const MUSIC_GAIN = 0.5;
const musicVolume = () => Math.min(1, useGame.getState().settings.music * MUSIC_GAIN);

function load(index, autoplay) {
  const a = ensureAudio();
  if (!a.src.endsWith(TRACKS[index].src)) a.src = import.meta.env.BASE_URL + TRACKS[index].src;
  a.volume = musicVolume();
  useMusic.setState({ index });
  if (!autoplay || a.volume <= 0) return Promise.resolve();
  return a.play().then(() => useMusic.setState((s) => ({ toastId: s.toastId + 1 })));
}

let started = false;
let startedAt = 0;
/** Start the (randomly chosen) first track. Called when loading finishes (autoplay) and
 *  again on user gestures until it succeeds — browsers block audio before a gesture. */
export function startMusic() {
  if (started) return;
  started = true;
  startedAt = performance.now();
  load(useMusic.getState().index, true).catch(() => { started = false; });
}

/** Radio click / Settings: switch to the next track. If this very click is the gesture
 *  that just started the music, keep the random first track instead of skipping it. */
export function nextTrack(fromUser = true) {
  if (fromUser && performance.now() - startedAt < 600) return;
  started = true;
  const i = (useMusic.getState().index + 1) % TRACKS.length;
  load(i, true);
}

/** True when music is actually audible: the track is playing AND the shared audio
 *  context is running (a suspended context = silent even while "playing"). */
export function musicAudible() {
  return !!audio && !audio.paused && (!analyser || analyser.context.state === 'running');
}

/** 0..1 loudness of the low end, for the radio's squash animation (0 when silent). */
export function musicLevel() {
  if (!analyser || !audio || audio.paused) return 0;
  analyser.getByteFrequencyData(freq);
  let sum = 0;
  for (let i = 1; i < 12; i++) sum += freq[i];
  return sum / (11 * 255);
}

// keep the element in sync with the Music volume setting
useGame.subscribe((s, prev) => {
  if (!audio || s.settings.music === prev.settings.music) return;
  audio.volume = musicVolume();
  if (s.settings.music <= 0) audio.pause();
  else if (started && audio.paused) audio.play().catch(() => {});
});
