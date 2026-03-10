import { useState, useEffect, useRef } from 'react';
import useSound from '../hooks/useSound';
import './LoginScreen.css';

const KERNEL_LINES = [
  { text: 'QuanOS v4.2.6 — Advanced Creative Computing Platform', type: 'header' },
  { text: '════════════════════════════════════════════════════════════', type: 'divider' },
  { text: '[  0.000] BIOS-provided physical RAM map:', type: 'info' },
  { text: '[  0.012]   Total memory: 32.0 GB', type: 'ok' },
  { text: '[  0.024]   Available: 28.4 GB', type: 'ok' },
  { text: '[  0.036] CPU: Quan Creative Processor @ 3.8GHz', type: 'ok' },
  { text: '[  0.048]   Cores: 8 (Multithreading × 2)', type: 'ok' },
  { text: '[  0.068] GPU acceleration ............. ✓', type: 'ok' },
  { text: '[  0.084] NVIDIA RTX A6000 detected', type: 'ok' },
  { text: '[  0.098] Audio system ................ ✓', type: 'ok' },
  { text: '[  0.112] Network interfaces:', type: 'info' },
  { text: '[  0.124]   eth0: 1000 Mbps connected', type: 'ok' },
  { text: '[  0.140] Loading portfolio modules:', type: 'work' },
  { text: '[  0.156]   ├─ AboutModule ............ ✓', type: 'ok' },
  { text: '[  0.172]   ├─ ProjectsModule ........ ✓', type: 'ok' },
  { text: '[  0.188]   ├─ SkillsModule ......... ✓', type: 'ok' },
  { text: '[  0.204]   ├─ ContactModule ........ ✓', type: 'ok' },
  { text: '[  0.220]   ├─ GameEngine .......... ✓', type: 'ok' },
  { text: '[  0.240]   └─ PortfolioEngine ..... ✓', type: 'ok' },
  { text: '[  0.260] Typography engine ............ ✓', type: 'ok' },
  { text: '[  0.280] Parallax depth buffer ........ ✓', type: 'ok' },
  { text: '[  0.300] 3D perspective transform ..... ✓', type: 'ok' },
  { text: '[  0.320] Canvas rendering engine ...... ✓', type: 'ok' },
  { text: '[  0.340] Desktop compositor ........... ✓', type: 'ok' },
  { text: '[  0.360] Sound framework .............. ✓', type: 'ok' },
  { text: '[  0.380] Gesture recognition .......... ✓', type: 'ok' },
  { text: '[  0.396] System diagnostics:', type: 'work' },
  { text: '[  0.412]   ├─ Memory check ......... OK', type: 'ok' },
  { text: '[  0.428]   ├─ Disk I/O ........... OK', type: 'ok' },
  { text: '[  0.444]   ├─ Thermal status ..... NORMAL', type: 'ok' },
  { text: '[  0.460]   └─ Security checks .... PASSED', type: 'ok' },
  { text: '════════════════════════════════════════════════════════════', type: 'divider' },
  { text: '[  0.480] Initializing QuanOS Desktop..', type: 'go' },
];

const LoginScreen = ({ onLogin, unlockSound }) => {
  const [phase, setPhase] = useState('kernel'); // 'kernel' | 'login' | 'exiting'
  const [lineCount, setLineCount] = useState(0);
  const [bootProgress, setBootProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const kernelRef = useRef(null);
  const startupAudioRef = useRef(null);
  const { play: playSound, unlock } = useSound();

  // Initialize and control startup audio based on phase
  useEffect(() => {
    if (phase === 'kernel') {
      // Create audio if not exists
      if (!startupAudioRef.current) {
        startupAudioRef.current = new Audio('./sounds/startup.mp3');
        startupAudioRef.current.volume = 0.4;
      }
      // Play it (will be blocked by autoplay until unlock)
      startupAudioRef.current.currentTime = 0;
      startupAudioRef.current.play().catch(() => {});
    } else if (phase === 'login' && startupAudioRef.current) {
      // Stop and clean up when leaving kernel phase
      startupAudioRef.current.pause();
      startupAudioRef.current.currentTime = 0;
    }
  }, [phase]);

  // Unlock audio on any click/touch during kernel phase
  useEffect(() => {
    const handleInteraction = () => {
      unlock();
      if (unlockSound) unlockSound();
      // Once unlock is called, try to play startup audio again (now that autoplay is allowed)
      if (phase === 'kernel' && startupAudioRef.current) {
        startupAudioRef.current.play().catch(() => {});
      }
    };
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [unlock, unlockSound, phase]);

  // Live clock for login screen
  useEffect(() => {
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Kernel boot
  useEffect(() => {
    if (phase !== 'kernel') return;
    let i = 0;
    let alive = true;
    const timer = setInterval(() => {
      if (!alive) return;
      if (i < KERNEL_LINES.length) {
        i++;
        setLineCount(i);
        setBootProgress(Math.floor((i / KERNEL_LINES.length) * 100));
      } else {
        clearInterval(timer);
        setTimeout(() => { if (alive) setPhase('login'); }, 600);
      }
    }, 80);
    return () => { alive = false; clearInterval(timer); };
  }, [phase]);

  // Auto-scroll kernel output
  useEffect(() => {
    if (kernelRef.current) {
      kernelRef.current.scrollTop = kernelRef.current.scrollHeight;
    }
  }, [lineCount]);

  const handleLogin = () => {
    if (phase !== 'login') return;
    playSound('login', 0.4);
    setPhase('exiting');
    setTimeout(() => onLogin(), 600);
  };

  const kernelDisplay = KERNEL_LINES.slice(0, lineCount);

  const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (d) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="login-overlay">
      {phase === 'kernel' && (
        <div className="login-screen kernel-screen">
          <div className="kernel-container">
            <div className="kernel-terminal" ref={kernelRef}>
              {kernelDisplay.map((line, i) => (
                <div key={i} className={`kernel-line kernel-${line.type}`}>
                  {line.text}
                </div>
              ))}
              <span className="kernel-cursor">_</span>
            </div>
            <div className="kernel-progress-bar">
              <div className="progress-fill" style={{ width: `${bootProgress}%` }} />
            </div>
            <div className="kernel-status">
              Booting QuanOS... {bootProgress}%
            </div>
          </div>
        </div>
      )}

      {(phase === 'login' || phase === 'exiting') && (
        <div className={`login-screen login-main${phase === 'exiting' ? ' fade-out' : ''}`}>
          {/* Background blur layer */}
          <div className="login-bg" />

          {/* Clock & Date — top center like GNOME/Ubuntu */}
          <div className="login-clock-area">
            <div className="login-time">{formatTime(currentTime)}</div>
            <div className="login-date">{formatDate(currentTime)}</div>
          </div>

          {/* Center: user profile */}
          <div className="login-center">
            <div className="login-user-area" onClick={handleLogin}>
              <div className="login-avatar-ring">
                <div className="login-avatar">Q</div>
              </div>
              <span className="login-name">Quan</span>
              <span className="login-role">Aspiring Game Developer </span>

              {phase === 'login' && (
                <button className="login-enter-btn" type="button">
                  <span className="login-enter-text">Log In</span>
                  <svg className="login-enter-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}

              {phase === 'exiting' && (
                <div className="login-loading">
                  <div className="login-spinner" />
                </div>
              )}
            </div>
          </div>

          {/* Bottom bar — system tray style */}
          <div className="login-bottom">
            <div className="login-bottom-left">
              <span className="login-os-badge">QuanOS v4.2.6</span>
            </div>
            <div className="login-bottom-right">
              {/* Wifi icon */}
              <div className="login-indicator" title="Connected">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
              </div>
              {/* Battery icon */}
              <div className="login-indicator" title="Battery OK">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z"/></svg>
              </div>
              {/* Power button */}
              <div className="login-power-btn" onClick={handleLogin} title="Enter Desktop">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A6.92 6.92 0 0119 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.27 1.08-4.28 2.59-5.41L6.17 5.17A8.932 8.932 0 003 12a9 9 0 0018 0c0-2.74-1.23-5.18-3.17-6.83z"/></svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
