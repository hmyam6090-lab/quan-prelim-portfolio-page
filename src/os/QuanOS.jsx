import { useEffect } from 'react';
import { useGame } from '../game/store';
import LoginScreen from './LoginScreen';
import Desktop from './Desktop';
import './os.css';

/** QuanOS: the HTML "operating system" shown on the CRT (1024 x 768 internal pixels). */
export default function QuanOS() {
  const screen = useGame((s) => s.osScreen);
  const crt = useGame((s) => s.settings.crt);
  const phase = useGame((s) => s.phase);
  const clean = useGame((s) => s.osClean);
  const setOsClean = useGame((s) => s.setOsClean);
  const active = phase === 'os';

  useEffect(() => () => setOsClean(null), [setOsClean]);
  useEffect(() => { if (screen !== 'desktop') setOsClean(null); }, [screen, setOsClean]);

  return (
    <div className={`quanos ${active ? 'active' : 'inactive'}`} inert={!active}>
      {screen === 'login' ? <LoginScreen active={active} /> : <Desktop />}
      <div className={`crt-overlay ${crt ? 'on' : ''} ${clean ? `clean-${clean}` : ''}`} aria-hidden />
    </div>
  );
}
