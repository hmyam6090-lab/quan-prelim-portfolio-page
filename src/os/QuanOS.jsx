import { useGame } from '../game/store';
import LoginScreen from './LoginScreen';
import Desktop from './Desktop';
import './os.css';

/** QuanOS: the HTML "operating system" shown on the CRT (1024 x 768 internal pixels). */
export default function QuanOS() {
  const screen = useGame((s) => s.osScreen);
  const crt = useGame((s) => s.settings.crt);
  const phase = useGame((s) => s.phase);
  const active = phase === 'os';

  return (
    <div className={`quanos ${active ? 'active' : 'inactive'}`} inert={!active ? '' : undefined}>
      {screen === 'login' ? <LoginScreen active={active} /> : <Desktop />}
      <div className={`crt-overlay ${crt ? 'on' : ''}`} aria-hidden />
    </div>
  );
}
