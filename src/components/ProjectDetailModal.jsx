import { useState, useEffect, useRef } from 'react';
import './ProjectDetailModal.css';

/* ═══════════════════════════════════════
   README-style Detail Content per Section
   ═══════════════════════════════════════ */

const sectionContent = {
  gamedev: {
    title: 'Game Development',
    windowTitle: 'game-dev-README.md — QuanOS Viewer',
    barColor: '#2a2a2a',
    accent: '#FFD54F',
    projects: [
      {
        name: 'House Of Illusions',
        subtitle: 'Fast-paced puzzle platformer — Hackathon Winner',
        tags: ['Godot 2D', 'GDScript'],
        description: `House Of Illusion is a fast-paced puzzle platformer built around the duality of reality. The core mechanic allows players to switch between the Real World and the Mirror World, each governed by different movement mechanics and level structure. Progression depends on switching worlds at precisely the right moment — sometimes mid-jump, sometimes mid-fall — to overcome obstacles and complete levels.\n\nHouse Of Illusion was created in 48 hours during the IDEA350: Video Game Development hackathon by Team WaterWorks. The game went on to win the hackathon of the course, which was taught by Professor Christopher Weaver, founder of Bethesda Softworks.`,
        features: [
          'Real/Mirror world-switching mechanic',
          'Precision platforming with dual physics systems',
          'Built in 48 hours during a game jam',
          'Won the IDEA350 course hackathon',
        ],
        media: [
          { type: 'video', src: './videos/game_reel.mov', caption: 'Gameplay trailer' },
        ],
        links: [
          { label: 'Play on Itch.io', url: 'https://hmyam6090-lab.itch.io/' },
        ],
      },
      {
        name: 'BYTEDIEP: A BYTEPATH Variation',
        subtitle: 'Replayable arcade shooter — In Progress',
        tags: ['Lua', 'LOVE2D'],
        description: `A variation of BYTEPATH: a replayable arcade shooter with a focus on build theorycrafting. This remake focuses more on the diversification of ship classes, inspired by diep.io.`,
        features: [
          'Diversified ship class system',
          'Build theorycrafting focus',
          'Diep.io–inspired class trees',
          'Replayable arcade loop',
        ],
        media: [
          { type: 'video', src: './videos/bytepath.mov', caption: 'Movement Prototype' },
        ],
        links: [],
      },
      {
        name: 'Beyond Cooked',
        subtitle: 'Chaotic co-op cooking game in space',
        tags: ['Godot 3D', 'GDScript'],
        description: `Beyond Cooked is a chaotic co-op cooking game in different dimensions. Players must prepare dishes under extreme conditions: zero gravity, possessed appliances, and rogue ingredients that fight back. Success requires communication (hopefully proximity chat).\n\nPlayers land on a different planet each level, they have their kitchen and they need to venture out (similar to Lethal Company) to gather ingredients or tools and cook it in their kitchen to satisfy their galactic customers.`,
        features: [
          'Goofy cooking mechanics',
          'Cooking simulator-ish gameplay with a mix of Lethal Company',
          'Randomized Recipes per level',
          'Lethal Company–inspired scavenging loop',
        ],
        media: [
          { type: 'image', src: './images/beyond-cooked-1.png', caption: 'Home Screen' },
          { type: 'image', src: './images/beyond-cooked-2.png', caption: 'Tutorial' },
        ],
        links: [],
      },
      {
        name: 'Solo Independent Game Development',
        subtitle: 'Published games & prototypes',
        tags: ['Godot', 'Unity', 'Processing', 'Scratch'],
        description: `Published 5 playable games/prototypes on Itch.io and additional projects on UGC platforms, including "Flappy Bird as a Volume Control", "Untitled Snowball Game", and more.\n\nExperienced in rapid prototyping, playtesting, debugging, and technical documentation across multiple engines (Godot, Unity, Processing, Scratch).`,
        features: [
          '5+ published games on Itch.io',
          'Projects on UGC platforms',
          'Rapid prototyping across multiple engines',
          'Playtesting & technical documentation',
        ],
        media: [
          { type: 'image', src: './images/indie-games-1.gif', caption: 'Flappy Bird as a Volume Control' },
          { type: 'image', src: './images/indie-games-2.gif', caption: 'Untitled Snowball Game' },
        ],
        links: [
          { label: 'Itch.io Profile', url: 'https://hmyam6090-lab.itch.io/' },
        ],
      },
    ],
  },
  webdev: {
    title: 'Software & Web Development',
    windowTitle: 'web-dev-README.md — QuanOS Viewer',
    barColor: '#2a2a2a',
    accent: '#4A90D9',
    projects: [
      {
        name: 'This Portfolio Site',
        subtitle: 'OS-themed creative portfolio — React + Vite',
        tags: ['React', 'CSS3', 'Vite', 'Canvas API'],
        description: `This very site! A QuanOS-inspired portfolio with draggable icons, perspective tilt, interactive terminal, kernel boot animation, and a full showcase section with deep-dive project READMEs.\n\nBuilt from scratch with React 19 and Vite, featuring custom window management, sound effects, CSS-driven animations, and a particle system.`,
        features: [
          'Draggable desktop icons with parallax',
          'Interactive terminal with custom commands',
          'Minigames: Minesweeper, Snake, Paint',
          'Kernel boot animation & login screen',
        ],
        media: [
          { type: 'image', src: './images/portfolio-screenshot.png', caption: 'Desktop view' },
        ],
        links: [
          { label: 'Source Code', url: 'https://github.com/hmyam6090-lab' },
        ],
      },
      {
        name: 'Vbee Internal Testing Platform',
        subtitle: 'Full-stack manual testing platform for TTS models',
        tags: ['React', 'Vite', 'Google Firestore', 'Firebase'],
        description: `Built an internal web platform using React & Vite enabling 20+ human evaluators to rate synthesized outputs and collect structured feedback (via MOS test and Transcription Test). Deployed using Google Firebase.`,
        features: [
          'MOS & Transcription Test evaluation tools',
          '20+ concurrent human evaluators',
          'Structured feedback collection pipeline',
          'Firebase authentication & Firestore backend',
        ],
        media: [
          { type: 'image', src: './images/testing-page.png', caption: 'Testing interface' },
          { type: 'image', src: './images/webapp-screenshot.png', caption: 'Dashboard' },
        ],
        links: [
          { label: 'Live Demo', url: 'https://mos-transcription.web.app/' },
        ],
      },
      {
        name: 'Three.js Portal Render Demonstration',
        subtitle: '3D portal scene with baked lighting',
        tags: ['Three.js', 'WebGL', 'Blender', 'Vite'],
        description: `Created a beautiful 3D portal scene using Blender and rendered using baking technique to get the best looking lights and shadows. A demo built as part of a course to learn how to develop beautiful 3D web experiences using Three.js.`,
        features: [
          'Blender-modeled 3D scene',
          'Baked lighting for realistic shadows',
          'Interactive WebGL rendering',
          'Optimized for web performance',
        ],
        media: [
          { type: 'video', src: './videos/portal.mov', caption: 'Portal scene demo' },
        ],
        links: [
          { label: 'Live Demo', url: 'https://hmyam6090-lab.github.io/portal-scene-threejs/' },
        ],
      },
      {
        name: 'STG — Smart Tour Guide Mobile App',
        subtitle: 'Award-winning Flutter-based tour guide',
        tags: ['Flutter', 'Dart', 'BLE', 'AI'],
        description: `Developed and released an award-winning Flutter-based mobile application integrating BLE and AI for multilingual, location-based guidance.\n\nPerformed extensive manual testing on Android devices and emulators, validating UI/UX consistency, BLE stability, performance under varying network conditions, and edge-case user flows.\n\nConducted localization testing across multiple languages to ensure accurate rendering and seamless language switching.\n\nPublished on Google Play Store and officially approved with documentation by Vietnamese government authorities for experimental deployment at a national relic area.`,
        features: [
          'BLE + AI multilingual guidance',
          'Extensive Android manual testing',
          'Localization testing across languages',
          'Published on Google Play Store',
          'Approved by Vietnamese government for national relic deployment',
        ],
        media: [
          { type: 'image', src: './images/stg-1.jpg', caption: 'Map Interface' },
          { type: 'image', src: './images/stg-2.jpg', caption: 'Hardware Installed Onsite' },
          { type: 'image', src: './images/stg-3.jpg', caption: 'Main Menu' },
          { type: 'image', src: './images/stg-4.jpg', caption: 'Multilingual support' },
        ],
        links: [
          { label: 'News Article', url: 'https://e.vnexpress.net/news/news/education/ai-tour-guide-invention-lands-vietnamese-student-400-000-scholarship-at-us-top-liberal-arts-university-4869263.html' },
        ],
      },
    ],
  },
  creative: {
    title: 'Creative Coding',
    windowTitle: 'creative-README.md — QuanOS Viewer',
    barColor: '#1a1a1a',
    accent: '#AB47BC',
    projects: [
      {
        name: 'Creative Coding Sketches',
        subtitle: 'Interactive visual experiments with code',
        tags: ['Processing', 'Lua', 'p5.js', 'OpenCV'],
        description: `Actively making creative coding sketches using Processing, Lua, and p5.js. Examples include an OpenCV musical instrument that responds to the player's hand using a webcam, a remake of a Plant vs Zombies level from scratch in Processing, 3D voxel-inspired drawing apps, audio visualizers, and more.`,
        features: [
          'OpenCV musical instrument (webcam-driven)',
          'Plant vs Zombies level remake in Processing',
          '3D voxel-inspired drawing app',
          'Audio visualizers & generative art',
        ],
        media: [
          { type: 'video', src: './videos/pvz.mov', caption: 'PvZ remake' },
          { type: 'video', src: './videos/creative_reel.mov', caption: 'Voxel drawing app' },
          { type: 'image', src: './images/candlepomo.png', caption: 'Candle Pomodoro' },
          { type: 'image', src: './images/breaking-bad.png', caption: 'Breaking Bad Poster' },
        ],
        links: [
          { label: 'GitHub Profile', url: 'https://github.com/hmyam6090-lab' },
        ],
      },
    ],
  },
  research: {
    title: 'Research & Contributing',
    windowTitle: 'research-README.md — QuanOS Viewer',
    barColor: '#f8f6f2',
    accent: '#4A90D9',
    projects: [
      {
        name: 'Open Source Contributions',
        subtitle: 'Active contributor to creative coding libraries',
        tags: ['Lua', 'Python', 'JavaScript', 'Processing', 'C++', 'Arduino IDE'],
        description: `Active contributor to creative coding libraries like L5 and various game libraries. Contributions include bug fixes, feature additions, and documentation improvements.`,
        features: [
          'Bug fixes and feature PRs',
          'Documentation improvements',
          'Community engagement and code reviews',
        ],
        media: [
          { type: 'image', src: './images/404custom.png', caption: 'Contributed custom 404 page to L5 Library' },
        ],
        links: [
          { label: 'GitHub Profile', url: 'https://github.com/hmyam6090-lab' },
        ],
      },
      {
        name: 'Wesleyan Soft Robotics Lab',
        subtitle: 'Capacitive sensing & wearable sensor research',
        tags: ['ROS', 'Python', 'C++', 'Arduino IDE', 'Hardware'],
        description: `Fabricated capacitive sensing sleeves by constructing elastic conductive tubes and soldering FDC1004 capacitance-to-digital converter chips for high-resolution charge measurement.\n\nTesting wearable sensor hardware integrating conductive materials for stretch-based capacitive sensing applications.`,
        features: [
          'Capacitive sensing sleeve fabrication',
          'FDC1004 chip soldering & integration',
          'Wearable stretch-based sensing applications',
          'ROS system integration',
        ],
        media: [
          { type: 'image', src: './images/finished_FDC.jpg', caption: 'Soldered FDC1004 chip' },
        ],
        links: [
          { label: 'Lab GitHub', url: 'https://github.com/Wesleyan-Soft-Robots-Lab' },
        ],
      },
      {
        name: 'McKenzie-Smith Lab — Modular NAPS',
        subtitle: 'Python package for entomological data analysis',
        tags: ['Python'],
        description: `Architecting a Python package for readability and reproducibility, targeting scientific users with limited Python experience; planned public release on PyPI alongside a forthcoming publication.\n\nRe-designing re-identification pipeline combining fiducial tracking, AI-based locomotion models, and image-based classifiers to resolve identity swaps during occlusion events (ArUco & SLEAP).`,
        features: [
          'PyPI-ready Python package architecture',
          'Fiducial tracking with ArUco markers',
          'AI-based locomotion models (SLEAP)',
          'Image-based classifier for re-identification',
          'Reproducible pipeline for non-expert users',
        ],
        media: [
          { type: 'image', src: './images/insects.gif', caption: 'Insect tracking in action' },
        ],
        links: [
          { label: 'GitHub Repo', url: 'https://github.com/Wesleyan-Soft-Robots-Lab/Modular-NAPS' },
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════ */

const ProjectDetailModal = ({ sectionId, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const contentRef = useRef(null);
  const section = sectionContent[sectionId];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(), 350);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!section) return null;

  const isLight = sectionId === 'research';

  return (
    <div className={`pdm-overlay ${isExiting ? 'pdm-exiting' : ''}`} onClick={handleBackdropClick}>
      <div className={`pdm-window ${isLight ? 'pdm-light' : 'pdm-dark'}`}>
        {/* Window chrome */}
        <div className="pdm-bar" style={{ background: section.barColor }}>
          <div className="pdm-dots">
            <span className="pdm-dot-r" onClick={handleClose} />
            <span className="pdm-dot-y" />
            <span className="pdm-dot-g" />
          </div>
          <span className={`pdm-bar-title ${isLight ? 'pdm-bar-light' : ''}`}>{section.windowTitle}</span>
          <button className="pdm-close-btn" onClick={handleClose}>×</button>
        </div>

        {/* Scrollable README content */}
        <div className="pdm-content" ref={contentRef}>
          {/* Header */}
          <div className="pdm-header">
            <h1 className="pdm-title" style={{ color: section.accent }}>{section.title}</h1>
            <div className="pdm-title-bar" style={{ background: section.accent }} />
          </div>

          {/* Projects */}
          {section.projects.map((project, idx) => (
            <div key={idx} className="pdm-project">
              <div className="pdm-project-divider">
                <span className="pdm-project-num" style={{ color: section.accent }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="pdm-divider-line" style={{ background: section.accent }} />
              </div>

              <h2 className="pdm-project-name">{project.name}</h2>
              <p className="pdm-project-sub">{project.subtitle}</p>

              {/* Tags */}
              <div className="pdm-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="pdm-tag" style={{ borderColor: section.accent, color: section.accent }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="pdm-desc">
                {project.description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Features */}
              {project.features.length > 0 && (
                <div className="pdm-features">
                  <h3 className="pdm-features-title">Key Features</h3>
                  <ul>
                    {project.features.map((f, i) => (
                      <li key={i}>
                        <span className="pdm-feat-bullet" style={{ color: section.accent }}>▸</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Media */}
              {project.media.length > 0 && (
                <div className="pdm-media">
                  {project.media.map((m, i) => (
                    <div key={i} className="pdm-media-item">
                      {m.type === 'image' ? (
                        <img src={m.src} alt={m.caption} className="pdm-media-img" />
                      ) : (
                        <video
                          src={m.src}
                          className="pdm-media-video"
                          controls
                          muted
                          playsInline
                        />
                      )}
                      <span className="pdm-media-caption">{m.caption}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Links */}
              {project.links.length > 0 && (
                <div className="pdm-links">
                  {project.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pdm-link"
                      style={{ borderColor: section.accent, color: section.accent }}
                    >
                      {link.label} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Footer */}
          <div className="pdm-footer">
            <span className="pdm-footer-text">— End of README —</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
