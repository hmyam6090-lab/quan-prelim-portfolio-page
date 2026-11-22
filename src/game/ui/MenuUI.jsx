import { useGame } from '../store';
import { playSound } from '../sound';
import SettingsPanel from './SettingsPanel';
import CreditsPanel from './CreditsPanel';
import QuitDialog from './QuitDialog';

/** HTML layer over the canvas: skip button, back button, menu panels. */
export default function MenuUI() {
  const phase = useGame((s) => s.phase);
  const panel = useGame((s) => s.panel);
  const skip = useGame((s) => s.skipToPortfolio);
  const exit = useGame((s) => s.exitToMenu);

  return (
    <div className="menu-ui">
      {phase === 'menu' && !panel && (
        <button
          className="skip-btn"
          onClick={() => { playSound('click'); skip(); }}
        >
          Just show me the portfolio bro <span aria-hidden>»</span>
        </button>
      )}

      {phase === 'os' && (
        <button className="back-btn" onClick={() => { playSound('click'); exit(); }}>
          <span aria-hidden>«</span> Main menu <kbd>Esc</kbd>
        </button>
      )}

      {panel === 'settings' && <SettingsPanel />}
      {panel === 'credits' && <CreditsPanel />}
      {panel === 'quit' && <QuitDialog />}
    </div>
  );
}
