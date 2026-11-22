import { useEffect, useState } from 'react';
import { useGame } from '../game/store';
import { playSound } from '../game/sound';
import { ICONS } from './icons';

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);
  return <span className="tb-clock">{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>;
}

export default function Taskbar({ wins, active, onTask, onOpen }) {
  const [menu, setMenu] = useState(false);
  const logout = useGame((s) => s.logout);
  const exit = useGame((s) => s.exitToMenu);

  const item = (label, icon, fn) => (
    <button className="sm-item" onClick={() => { setMenu(false); playSound('click'); fn(); }}>
      <img src={ICONS[icon]} alt="" />{label}
    </button>
  );

  return (
    <>
      {menu && (
        <div className="start-menu" role="menu">
          <div className="sm-side">QuanOS</div>
          <div className="sm-items">
            {item('Greeting.txt', 'notepad', () => onOpen('notepad'))}
            {item('Resume.pdf', 'pdf', () => onOpen('resume'))}
            {item('My Games', 'folder', () => onOpen('folder:games'))}
            <hr />
            {item('Log out', 'logo', logout)}
            {item('Shut down', 'logo', exit)}
          </div>
        </div>
      )}
      <div className="taskbar">
        <button className={`tb-start ${menu ? 'open' : ''}`} onClick={() => { playSound('click'); setMenu((m) => !m); }}>
          <img src={ICONS.logo} alt="" />QuanOS
        </button>
        <div className="tb-tasks">
          {wins.filter((w) => w.id !== 'preview').map((w) => (
            <button key={w.id} className={`tb-task ${active === w.id && !w.min ? 'active' : ''}`} onClick={() => onTask(w.id)}>
              <img src={ICONS[w.icon]} alt="" />{w.title}
            </button>
          ))}
        </div>
        <Clock />
      </div>
    </>
  );
}
