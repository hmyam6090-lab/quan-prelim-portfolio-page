import { useEffect, useRef, useState } from 'react';
import { useGame } from '../game/store';
import { playSound } from '../game/sound';
import { LOGIN_PHOTO, PASSWORD } from './config';
import { Logo } from './Logo';

const HINTS = [
  'Wrong password. Psst… check the sticky note →',
  'Still wrong. It\'s literally on the monitor →',
  'Hint: i _ _ _ _ c _ _ s',
];

/** Ref 2: "LOGIN REQUIRED" window with photo, password field and SUBMIT. */
export default function LoginScreen({ active }) {
  const login = useGame((s) => s.login);
  const [value, setValue] = useState('');
  const [fails, setFails] = useState(0);
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const input = useRef(null);

  useEffect(() => {
    if (active) {
      const t = setTimeout(() => input.current?.focus({ preventScroll: true }), 50);
      return () => clearTimeout(t);
    }
  }, [active]);

  const enter = () => {
    setBusy(true);
    playSound('login');
    setTimeout(() => login(), 900);
  };

  const submit = (e) => {
    e.preventDefault();
    if (busy) return;
    if (value.replace(/[\s-]/g, '').toLowerCase() === PASSWORD) {
      enter();
    } else {
      playSound('click');
      setFails((f) => f + 1);
      setShake(true);
      setTimeout(() => setShake(false), 450);
      setValue('');
      input.current?.focus({ preventScroll: true });
    }
  };

  return (
    <div className="os-login">
      <div className="win login-win">
        <div className="win-titlebar">
          <span className="win-title"><span className="login-badge" />LOGIN REQUIRED</span>
          <Logo className="login-logo" />
          <span className="win-buttons" aria-hidden><i className="wb-min" /><i className="wb-x" /></span>
        </div>
        <form className="login-body" onSubmit={submit}>
          <div className="photo-frame">
            <img src={import.meta.env.BASE_URL + LOGIN_PHOTO} alt="Quan Hoang" draggable={false} />
            <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
          </div>
          <label className={`pw-row ${shake ? 'shake' : ''}`}>
            <span>Password:</span>
            <input
              ref={input}
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              disabled={busy}
              aria-describedby="pw-hint"
            />
          </label>
          <p id="pw-hint" className="pw-hint" aria-live="polite">
            {busy ? 'Welcome back! Loading desktop…' : fails ? HINTS[Math.min(fails - 1, HINTS.length - 1)] : ' '}
          </p>
          {busy ? <div className="login-progress"><div /></div> : (
            <button className="os-btn submit-btn" type="submit">SUBMIT</button>
          )}
          {!busy && (
            <button type="button" className="guest-link" onClick={() => { playSound('click'); enter(); }}>
              guest login
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
