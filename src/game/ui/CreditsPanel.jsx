import Panel from './Panel';
import { TRACKS } from '../music';

const CREDITS = [
  ['Designed, modelled & built by', 'Quan Hoang'],
  ['3D models', 'made in picoCAD 2 by Johan Peitz / Apskeppet'],
  ['Rendering', 'three.js · React Three Fiber · drei · postprocessing'],
  ['Sound effects', 'by me, Quan Hoang'],
  ['Fonts', 'Pixelify Sans · VT323 (SIL Open Font License)'],
  ['Cats', 'all the cats on the internet'],
  ['Special thanks', 'you, for actually opening the credits'],
];

export default function CreditsPanel() {
  return (
    <Panel title="CREDITS" className="credits-panel">
      <div className="credits-roll">
        {CREDITS.map(([role, who]) => (
          <div className="credit" key={role}>
            <div className="credit-role">{role}</div>
            <div className="credit-who">{who}</div>
          </div>
        ))}
        <div className="credit">
          <div className="credit-role">Music (Newgrounds, open license)</div>
          {TRACKS.map((t) => (
            <div className="credit-who" key={t.id}>
              <a href={t.url} target="_blank" rel="noopener noreferrer">{t.title}</a>
              {' by '}
              {t.artistUrl ? <a href={t.artistUrl} target="_blank" rel="noopener noreferrer">{t.artist}</a> : t.artist}
            </div>
          ))}
        </div>
        <div className="credit-end">THANKS FOR PLAYING</div>
      </div>
    </Panel>
  );
}
