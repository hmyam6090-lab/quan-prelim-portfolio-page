import { useState, useEffect, useRef, useCallback } from 'react';
import ProjectDetailModal from './ProjectDetailModal';
import './Showcase.css';

/* ═══════════════════════════════════════
   Interactive Terminal for Web Dev Section
   ═══════════════════════════════════════ */
const TerminalWindow = () => {
  const [history, setHistory] = useState([
    { type: 'sys', text: 'QuanOS Terminal v4.2.6' },
    { type: 'sys', text: 'Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('~/projects');
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const projects = {
    portfolio:  { name: 'Portfolio Site', desc: 'This very site, React + Vite, OS-themed creative portfolio', url: '#', tech: 'React, CSS3, Vite, Canvas API' },
    stg:     { name: 'Smart Tour Guide', desc: 'Award-winning Flutter-based multilingual tour guide app', url: '#', tech: 'Flutter, Dart, BLE, AI' },
    vbee:     { name: 'Vbee Testing Platform', desc: 'Full-stack manual testing platform for TTS models', url: 'https://mos-transcription.web.app/', tech: 'React, Vite, Firebase, Firestore' },
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    const parts = trimmed.split(/\s+/);
    const command = parts[0]?.toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    let output = [];

    switch (command) {
      case 'ls':
        output = [{ type: 'sys', text: Object.keys(projects).map(k => `  📁 ${k}/`).join('\n') }];
        break;
      case 'cd':
        if (projects[arg]) {
          const p = projects[arg];
          setCwd(`~/projects/${arg}`);
          output = [
            { type: 'sys', text: `\n  ┌─ ${p.name}` },
            { type: 'sys', text: `  ├─ ${p.desc}` },
            { type: 'sys', text: `  ├─ Stack: ${p.tech}` },
            { type: 'link', text: `  └─ Open → ${p.url}`, url: p.url },
            { type: 'sys', text: '' },
          ];
        } else if (arg === '..' || arg === '~') {
          setCwd('~/projects');
          output = [];
        } else {
          output = [{ type: 'err', text: `cd: no such directory: ${arg || '(empty)'}` }];
        }
        break;
      case 'open':
        if (projects[arg]?.url && projects[arg].url !== '#') {
          window.open(projects[arg].url, '_blank');
          output = [{ type: 'sys', text: `Opening ${projects[arg].name}...` }];
        } else if (projects[arg]) {
          output = [{ type: 'sys', text: `[placeholder] ${projects[arg].name} — update URL in Showcase.jsx` }];
        } else {
          output = [{ type: 'err', text: `open: project not found: ${arg || '(empty)'}` }];
        }
        break;
      case 'cat':
        if (projects[arg]) {
          const p = projects[arg];
          output = [
            { type: 'sys', text: `# ${p.name}\n${p.desc}\nTech: ${p.tech}` },
          ];
        } else {
          output = [{ type: 'err', text: `cat: ${arg || '(empty)'}: No such file` }];
        }
        break;
      case 'help':
        output = [{ type: 'sys', text: '  ls           List all projects\n  cd <name>    Navigate into project\n  cat <name>   Read project details\n  open <name>  Open project in browser\n  clear        Clear terminal\n  help         Show this message' }];
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'whoami':
        output = [{ type: 'sys', text: 'quan — creative developer' }];
        break;
      case 'pwd':
        output = [{ type: 'sys', text: cwd }];
        break;
      case undefined:
      case '':
        break;
      default:
        output = [{ type: 'err', text: `command not found: ${command}. Try "help"` }];
    }

    setHistory(prev => [
      ...prev,
      { type: 'input', text: `${cwd} $ ${cmd}` },
      ...output,
    ]);
    setInput('');
  };

  return (
    <div className="sc-terminal" onClick={() => inputRef.current?.focus()}>
      <div className="sc-terminal-bar">
        <div className="sc-term-dots">
          <span className="sc-dot-r" />
          <span className="sc-dot-y" />
          <span className="sc-dot-g" />
        </div>
        <span className="sc-term-title">{cwd}</span>
      </div>
      <div className="sc-terminal-body" ref={scrollRef}>
        {history.map((line, i) => (
          <div key={i} className={`sc-term-line ${line.type}`}>
            {line.url ? (
              <a href={line.url} target="_blank" rel="noopener noreferrer">{line.text}</a>
            ) : (
              <pre>{line.text}</pre>
            )}
          </div>
        ))}
        <div className="sc-term-prompt">
          <span className="sc-prompt-path">{cwd} $ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
            className="sc-term-input"
            spellCheck={false}
            autoComplete="off"
            placeholder='Try "ls" or "help"...'
          />
        </div>
        {history.length <= 2 && (
          <div className="sc-typing-hint">
            <span className="sc-hint-arrow">↑</span> Click here and type a command
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   Interactive p5.js Sketch for Creative Section
   ═══════════════════════════════════════ */
const P5Canvas = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;

    // Create particles
    const colors = ['#FF5252', '#FF9800', '#FFEB3B', '#66BB6A', '#42A5F5', '#7E57C2', '#EC407A', '#26C6DA'];
    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        r: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    particlesRef.current = particles;

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
      ctx.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        // Attract toward mouse
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          p.vx += (dx / dist) * 0.3;
          p.vy += (dy / dist) * 0.3;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();

        // Draw connections
        for (const q of particles) {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = 0.08;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="p5-canvas"
      onMouseMove={handleMouseMove}
      style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
    />
  );
};

/* ═══════════════════════════════════════
   Main Showcase Component
   ═══════════════════════════════════════ */
const Showcase = () => {
  const [visible, setVisible] = useState(new Set());
  const [activeModal, setActiveModal] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(prev => new Set([...prev, entry.target.dataset.section]));
          }
        });
      },
      { threshold: 0.1 }
    );
    const sections = sectionRef.current?.querySelectorAll('[data-section]');
    sections?.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="showcase" ref={sectionRef}>
      {/* ── Intro ── */}
      <div className="showcase-intro">
        <div className="showcase-intro-line">
          <span className="sc-serif sc-blue sc-huge">Selected</span>
        </div>
        <div className="showcase-intro-line">
          <span className="sc-italic sc-gray sc-big">Work</span>
          <span className="sc-serif sc-gray sc-big">&</span>
          <span className="sc-italic sc-blue sc-huge">Projects</span>
        </div>
      </div>

      {/* ═══ 1. GAME DEVELOPMENT ═══ */}
      <div className={`showcase-row ${visible.has('1') ? 'visible' : ''}`} data-section="1">
        <div className="showcase-type gamedev-type">
          <span className="gamedev-label">01</span>
          <h2 className="gamedev-title">
            <span className="gamedev-word-1">Game</span>
            <span className="gamedev-word-2">Dev</span>
          </h2>
          <p className="showcase-desc">Making worlds from pixels. Crafted retro & modern game experiences.</p>
          <div className="gamedev-tags">
            <span>Godot</span><span>GDScript</span><span>Lua</span><span>LOVE2D</span>
          </div>
          <button className="see-more-btn gamedev-btn" onClick={() => setActiveModal('gamedev')}>
            See More <span className="see-more-arrow">→</span>
          </button>
        </div>
        <div className="showcase-win gamedev-win">
          <div className="sc-win-bar gamedev-bar">
            <div className="sc-win-dots"><span /><span /><span /></div>
            <span>game_reel.mp4 — QuanOS Media Player</span>
          </div>
          <div className="sc-win-body gamedev-body">
            <video
              className="gamedev-video"
              src="./videos/game_reel.mov"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="gamedev-video-ph">
              <div className="pixel-grid">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="pixel" style={{ animationDelay: `${(i % 8) * 0.15 + Math.floor(i / 8) * 0.1}s` }} />
                ))}
              </div>
              <span className="gamedev-ph-text">▶ game_reel.mp4</span>
              <span className="gamedev-ph-sub">Place your video in /public/videos/</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 2. SOFTWARE & WEB DEV ═══ */}
      <div className={`showcase-row reverse ${visible.has('2') ? 'visible' : ''}`} data-section="2">
        <div className="showcase-type webdev-type">
          <span className="webdev-label">02</span>
          <h2 className="webdev-title">
            <span className="webdev-line-1">Software</span>
            <span className="webdev-line-2">&amp; Web Dev<span className="webdev-cursor">_</span></span>
          </h2>
          <p className="showcase-desc">Full-stack applications, developer tools, and open-source projects.</p>
          <button className="see-more-btn webdev-btn" onClick={() => setActiveModal('webdev')}>
            See More <span className="see-more-arrow">→</span>
          </button>
        </div>
        <div className="showcase-win webdev-win">
          <TerminalWindow />
          <div className="webdev-screenshots">
            <div className="webdev-ss-window">
              <div className="sc-win-bar webdev-ss-bar">
                <div className="sc-win-dots"><span /><span /><span /></div>
                <span>portfolio — Preview</span>
              </div>
              <div className="webdev-ss-body">
                <img src="./images/portfolio-screenshot.png" alt="Portfolio Site" className="webdev-ss-img" />
              </div>
            </div>
            <div className="webdev-ss-window">
              <div className="sc-win-bar webdev-ss-bar">
                <div className="sc-win-dots"><span /><span /><span /></div>
                <span>Vbee — Preview</span>
              </div>
              <div className="webdev-ss-body">
                <img src="./images/webapp-screenshot.png" alt="Web App" className="webdev-ss-img" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 3. CREATIVE CODING ═══ */}
      <div className={`showcase-row ${visible.has('3') ? 'visible' : ''}`} data-section="3">
        <div className="showcase-type creative-type">
          <span className="creative-label">03</span>
          <div className="creative-title-wrap">
            <span className="creative-word c-w-1">C</span>
            <span className="creative-word c-w-2">r</span>
            <span className="creative-word c-w-3">e</span>
            <span className="creative-word c-w-4">a</span>
            <span className="creative-word c-w-5">t</span>
            <span className="creative-word c-w-6">i</span>
            <span className="creative-word c-w-7">v</span>
            <span className="creative-word c-w-8">e</span>
          </div>
          <h3 className="creative-sub">Coding</h3>
          <p className="showcase-desc">Generative art, shaders, interactive installations, and visual experiments.</p>
          <button className="see-more-btn creative-btn" onClick={() => setActiveModal('creative')}>
            See More <span className="see-more-arrow">→</span>
          </button>
        </div>
        <div className="showcase-win creative-win">
          <div className="creative-windows-grid">
            {/* Main blob canvas */}
            <div className="creative-main-win">
              <div className="sc-win-bar creative-bar">
                <div className="sc-win-dots"><span /><span /><span /></div>
                <span>sketch.js — Creative Canvas</span>
              </div>
              <div className="sc-win-body creative-body">
                <div className="creative-canvas">
                  <div className="c-blob c-blob-1" />
                  <div className="c-blob c-blob-2" />
                  <div className="c-blob c-blob-3" />
                  <div className="c-ring c-ring-1" />
                  <div className="c-ring c-ring-2" />
                  <div className="c-grid-overlay" />
                  <div className="c-label">{"<canvas />"}</div>
                </div>
              </div>
            </div>
            {/* Two small windows side by side */}
            <div className="creative-side-windows">
              {/* Video trailer */}
              <div className="creative-side-win">
                <div className="sc-win-bar creative-bar">
                  <div className="sc-win-dots"><span /><span /><span /></div>
                  <span>creative_reel.mp4</span>
                </div>
                <div className="sc-win-body creative-video-body">
                  <video
                    className="creative-video"
                    src="./videos/creative_reel.mov"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="creative-video-ph">
                    <span className="creative-ph-icon">▶</span>
                    <span className="creative-ph-text">creative_reel.mp4</span>
                    <span className="creative-ph-sub">Place video in /public/videos/</span>
                  </div>
                </div>
              </div>
              {/* p5.js interactive sketch */}
              <div className="creative-side-win">
                <div className="sc-win-bar creative-bar">
                  <div className="sc-win-dots"><span /><span /><span /></div>
                  <span>particles.js — Interactive</span>
                </div>
                <div className="sc-win-body creative-p5-body">
                  <P5Canvas />
                  <div className="p5-interact-hint">move your mouse ↗</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 4. RESEARCH & CONTRIBUTING ═══ */}
      <div className={`showcase-row reverse ${visible.has('4') ? 'visible' : ''}`} data-section="4">
        <div className="showcase-type research-type">
          <span className="research-label">04</span>
          <h2 className="research-title">
            <span className="research-line-1">Research</span>
            <span className="research-line-2">& Contributing</span>
          </h2>
          <p className="showcase-desc">Academic exploration, open-source contributions, and collaborative knowledge building.</p>
          <button className="see-more-btn research-btn" onClick={() => setActiveModal('research')}>
            See More <span className="see-more-arrow">→</span>
          </button>
        </div>
        <div className="showcase-win research-win">
          <div className="sc-win-bar research-bar">
            <div className="sc-win-dots"><span /><span /><span /></div>
            <span>contributions.md — QuanOS Viewer</span>
          </div>
          <div className="sc-win-body research-body">
            <div className="research-paper">
              <h4 className="research-paper-title">Selected Research & Contributions</h4>
              <a href="https://github.com/hmyam6090-lab" target="_blank" rel="noopener noreferrer" className="research-item research-link">
                <span className="research-bullet">◆</span>
                <div>
                  <span className="ri-title">Open Source Contributions</span>
                  <p className="ri-desc">Active contributor to creative coding libraries — Lua, Python, JavaScript, Processing, C++, Arduino</p>
                </div>
              </a>
              <a href="https://github.com/Wesleyan-Soft-Robots-Lab" target="_blank" rel="noopener noreferrer" className="research-item research-link">
                <span className="research-bullet">◆</span>
                <div>
                  <span className="ri-title">Wesleyan Soft Robotics Lab</span>
                  <p className="ri-desc">Fabricating capacitive sensing sleeves, soldering FDC1004 chips, and testing wearable sensor hardware — ROS, Python, C++, Arduino</p>
                </div>
              </a>
              <a href="https://github.com/Wesleyan-Soft-Robots-Lab/Modular-NAPS" target="_blank" rel="noopener noreferrer" className="research-item research-link">
                <span className="research-bullet">◆</span>
                <div>
                  <span className="ri-title">McKenzie-Smith Lab — Modular NAPS</span>
                  <p className="ri-desc">Architecting a Python package for re-identification pipeline with fiducial tracking, AI locomotion models (ArUco & SLEAP)</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {activeModal && (
        <ProjectDetailModal
          sectionId={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* ── Footer ── */}
      <div className="showcase-foot">
        <p><span className="sc-serif sc-blue">Quan</span> Aspiring Game Developer </p>
        <p className="showcase-foot-sub">Built with React + Vite</p>
      </div>
    </section>
  );
};

export default Showcase;
