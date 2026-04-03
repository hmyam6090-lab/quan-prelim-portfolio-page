import { useState, useEffect, useRef } from 'react';
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

const LoginScreen = ({ onLogin }) => {
  const [lineCount, setLineCount] = useState(0);
  const [bootProgress, setBootProgress] = useState(0);
  const kernelRef = useRef(null);

  useEffect(() => {
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
        setTimeout(() => {
          if (alive) onLogin();
        }, 600);
      }
    }, 80);
    return () => { alive = false; clearInterval(timer); };
  }, [onLogin]);

  useEffect(() => {
    if (kernelRef.current) {
      kernelRef.current.scrollTop = kernelRef.current.scrollHeight;
    }
  }, [lineCount]);

  const kernelDisplay = KERNEL_LINES.slice(0, lineCount);

  return (
    <div className="login-overlay">
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
    </div>
  );
};

export default LoginScreen;
