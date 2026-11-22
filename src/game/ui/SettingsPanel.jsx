import { useGame } from '../store';
import { playSound } from '../sound';
import Panel from './Panel';

function Toggle({ label, value, onChange, hint }) {
  return (
    <label className="set-row">
      <span className="set-label">{label}{hint && <small>{hint}</small>}</span>
      <button
        type="button"
        className={`set-toggle ${value ? 'on' : ''}`}
        aria-pressed={value}
        onClick={() => { playSound('click'); onChange(!value); }}
      >
        {value ? 'ON' : 'OFF'}
      </button>
    </label>
  );
}

export default function SettingsPanel() {
  const s = useGame((st) => st.settings);
  const update = useGame((st) => st.updateSettings);
  const reset = useGame((st) => st.resetSettings);
  const close = useGame((st) => st.closePanel);

  return (
    <Panel title="SETTINGS" className="settings-panel">
      <div className="set-row">
        <span className="set-label">Volume</span>
        <input
          type="range" min="0" max="1" step="0.05" value={s.volume}
          onChange={(e) => update({ volume: parseFloat(e.target.value) })}
          onPointerUp={() => playSound('click')}
          aria-label="Volume"
        />
        <span className="set-value">{Math.round(s.volume * 100)}</span>
      </div>
      <div className="set-row">
        <span className="set-label">Graphics<small>Low = no shadows / effects</small></span>
        <div className="set-seg">
          {['low', 'high'].map((q) => (
            <button key={q} className={s.quality === q ? 'on' : ''} onClick={() => { playSound('click'); update({ quality: q }); }}>
              {q.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <Toggle label="Bloom" value={s.bloom} onChange={(v) => update({ bloom: v })} />
      <Toggle label="Film grain" value={s.grain} onChange={(v) => update({ grain: v })} />
      <Toggle label="CRT scanlines" value={s.crt} onChange={(v) => update({ crt: v })} />
      <Toggle label="Camera motion" value={s.motion} onChange={(v) => update({ motion: v })} />
      <div className="panel-actions">
        <button className="btn" onClick={() => { playSound('click'); reset(); }}>Reset</button>
        <button className="btn primary" onClick={() => { playSound('click'); close(); }}>Done</button>
      </div>
    </Panel>
  );
}
