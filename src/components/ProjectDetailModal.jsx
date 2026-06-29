import { useState, useEffect, useRef } from 'react';
import './ProjectDetailModal.css';

/* ═══════════════════════════════════════
   README-style Detail Content per Section
   ═══════════════════════════════════════ */

const sectionContent = {
  fluidity: {
    title: 'Fluidity',
    windowTitle: 'fluidity-README.md - QuanOS Viewer',
    barColor: '#2a2a2a',
    accent: '#45c9ff',
    projects: [
      {
        name: 'Fluidity',
        subtitle: 'Lead Gameplay Programmer | Godot 2D | Team Project',
        role: 'Lead Gameplay Programmer',
        tags: ['Godot 2D', 'GDScript', 'Educational Games', 'Physics Systems'],
        description: `A physics-forward educational platformer where players switch between water states to solve level puzzles. The project focused on making science concepts playful while keeping controls readable for younger players.`,
        myRole: 'I led gameplay programming and technical direction. I owned the player-state architecture, puzzle-system implementation, and the team workflow for turning paper design goals into shippable mechanics across a 13-week production cycle.',
        keyContributions: [
          'Designed and implemented solid/liquid/gas state switching with puzzle-aware transition rules',
          'Built player controller, progression logic, and mechanic onboarding across levels',
          'Scoped and tracked engineering tasks in a weekly Agile/Scrum pipeline',
          'Collaborated with art, music, and design to integrate content into gameplay systems',
          'Refined pacing and clarity through elementary school playtest feedback',
        ],
        technicalHighlights: [
          'Finite state architecture for water-form transitions',
          'Data-driven puzzle setup for level scripting',
          'Gameplay telemetry-informed iteration after live playtests',
          'Modular controller logic for future mechanic expansion',
        ],
        skills: ['Godot 2D', 'GDScript', 'Gameplay Programming', 'System Design', 'Scrum'],
        media: [
          { type: 'youtube', videoId: 'vgPaHUHjU-Q', caption: 'Gameplay trailer' },
          { type: 'image', src: './images/fluidity1.png', caption: 'Gameplay screenshot' },
          { type: 'image', src: './images/fluidity2.png', caption: 'Puzzle system screenshot' },
        ],
        links: [
          { label: 'Visit Project Website', url: 'https://fluidity-website.vercel.app/' },
        ],
      },
    ],
  },
  houseofillusions: {
    title: 'House Of Illusions',
    windowTitle: 'house-of-illusions-README.md - QuanOS Viewer',
    barColor: '#2a2a2a',
    accent: '#f8f4e3',
    projects: [
      {
        name: 'House Of Illusions',
        subtitle: 'Gameplay Programmer | Godot 2D | Hackathon Winner',
        role: 'Gameplay Programmer',
        tags: ['Godot 2D', 'GDScript', 'Puzzle Platformer', 'Game Jam'],
        description: `A fast-paced puzzle platformer built around switching between a Real World and a Mirror World with different traversal rules. Progress depends on precise mid-air transitions and timing under pressure.`,
        myRole: 'I focused on implementing the dual-world gameplay loop and making the swap mechanic feel responsive enough for speed-platforming. I also helped tune level beats for readability within a 48-hour jam scope.',
        keyContributions: [
          'Implemented real-world/mirror-world switching logic tied to movement physics',
          'Prototyped traversal interactions that force decision-making during jumps and falls',
          'Balanced difficulty and pacing for short-session replayability',
          'Delivered a polished jam build within a strict 48-hour production window',
        ],
        technicalHighlights: [
          'Dual-physics state transitions',
          'Checkpoint and restart flow optimized for rapid retries',
          'Compact scene architecture for jam-time iteration speed',
          'Mechanic-first level scripting in Godot',
        ],
        skills: ['Godot 2D', 'GDScript', 'Gameplay Programming', 'Rapid Prototyping', 'Level Iteration'],
        media: [
          { type: 'youtube', videoId: '0NA3VAn1G3o', caption: 'Gameplay trailer' },
          { type: 'image', src: './images/house1.png', caption: 'Mirror world screenshot' },
          { type: 'image', src: './images/house2.png', caption: 'Level progression screenshot' },
        ],
        links: [
          { label: 'Play on Itch.io', url: 'https://hmyam6090-lab.itch.io/' },
        ],
      },
    ],
  },
  bytediep: {
    title: 'BYTEDIEP',
    windowTitle: 'bytediep-README.md - QuanOS Viewer',
    barColor: '#101418',
    accent: '#8aff52',
    projects: [
      {
        name: 'BYTEDIEP: A BYTEPATH Variation',
        subtitle: 'Gameplay Programmer | LOVE2D | In Progress',
        role: 'Gameplay Programmer',
        tags: ['Lua', 'LOVE2D', 'Arcade Shooter', 'Systems Design'],
        description: `A class-based arcade shooter inspired by BYTEPATH and diep.io, focused on highly replayable runs and player-driven build theorycrafting through differentiated ship archetypes.`,
        myRole: 'I am designing and implementing the combat sandbox, including class progression, stat interactions, and run-to-run variability that supports experimentation rather than a single optimal build.',
        keyContributions: [
          'Implemented modular ship class progression and branching playstyles',
          'Built combat tuning loops around movement, firing cadence, and survivability',
          'Developed systems for replayability and progression readability',
          'Maintained architecture for adding new classes without refactoring core combat',
        ],
        technicalHighlights: [
          'Data-driven class and stat definition tables',
          'Reusable weapon and behavior component patterns in Lua',
          'Difficulty scaling hooks for longer sessions',
          'Separation of render, simulation, and input layers',
        ],
        skills: ['Lua', 'LOVE2D', 'Gameplay Systems', 'Balancing', 'Data-Driven Design'],
        media: [
          { type: 'gif', src: './images/gameplay_bytediep.gif', caption: 'Gameplay gif' },
          { type: 'image', src: './images/gameover_bytediep.png', caption: 'Game over screenshot' },
        ],
        links: [
          { label: 'Check out on GitHub', url: 'https://github.com/hmyam6090-lab/BYTEDIEP---BYTEPATH-VARIATION' },
        ],
      },
    ],
  },
  beyondcooked: {
    title: 'Beyond Cooked',
    windowTitle: 'beyond-cooked-README.md - QuanOS Viewer',
    barColor: '#231233',
    accent: '#ffb347',
    projects: [
      {
        name: 'Beyond Cooked',
        subtitle: 'Gameplay Programmer | Godot 3D | Co-op Prototype',
        role: 'Gameplay Programmer',
        tags: ['Godot 3D', 'GDScript', 'Co-op Design', 'Systems Prototyping'],
        description: `A chaotic co-op cooking game set across dangerous dimensions. Teams gather ingredients in hostile environments and return to the kitchen to complete randomized orders under pressure.`,
        myRole: 'I built the gameplay loop from ingredient retrieval to recipe completion, with emphasis on cooperative chaos and readable task handoffs between players.',
        keyContributions: [
          'Implemented recipe and order-flow systems for dynamic level pacing',
          'Built pickup/use interactions for ingredients and kitchen tools',
          'Designed traversal-to-cooking loop inspired by high-risk scavenging games',
          'Integrated and tuned prototype content for short co-op sessions',
        ],
        technicalHighlights: [
          'Rule-based recipe validation and completion states',
          'Data tables for level recipes and spawnable resources',
          'Event-driven interaction architecture for tools and appliances',
          'Co-op-oriented gameplay feedback loops',
        ],
        skills: ['Godot 3D', 'GDScript', 'Gameplay Loop Design', 'UI Feedback', 'Rapid Iteration'],
        media: [
          { type: 'image', src: './images/beyond-cooked-1.png', caption: 'Kitchen gameplay screenshot' },
          { type: 'image', src: './images/beyond-cooked-2.png', caption: 'Planet scavenging screenshot' },
        ],
        links: [
          { label: 'Source Code on GitHub', url: 'https://github.com/hmyam6090-lab/Beyond-Cooked' },
        ],
      },
    ],
  },
  trustme: {
    title: 'Trust Me, I Was There!',
    windowTitle: 'trust-me-i-was-there-README.md - QuanOS Viewer',
    barColor: '#f4efe4',
    accent: '#1b1b1b',
    lightTheme: true,
    projects: [
      {
        name: 'Trust Me, I Was There!',
        subtitle: 'Lead Gameplay Programmer & Producer | Godot 4 | Team Project (Game Jam / Internship)',
        role: 'Lead Gameplay Programmer & Producer',
        tags: ['Godot 4', 'GDScript', 'Narrative Deduction', 'Puzzle Systems'],
        description: `A narrative deduction game where players act as the editor of a summer camp newspaper. NPCs submit conflicting witness reports, photographs, and physical evidence, and the player cross-references information to reconstruct the most plausible version of events before publishing the next day\'s paper.\n\nBuilt for Summer Comfy Jam 2026, the project ranked 75th out of approximately 450 submissions.`,
        myRole: 'As the gameplay programmer, I was responsible for designing and implementing the game\'s core deduction systems and player interaction loop.',
        keyContributions: [
          'Architected the evidence system supporting witness testimonies, photographs, and physical objects',
          'Developed cross-referencing mechanics for comparing conflicting details across evidence sources',
          'Built the interactive evidence board with draggable cards, grouping mechanics, and support/conflict relationships',
          'Implemented newspaper drafting workflow for building headlines and articles from verified evidence',
          'Created scoring that evaluates consistency against the underlying true event instead of binary right/wrong answers',
          'Programmed day progression, package delivery, and full loop from investigation to publication',
          'Collaborated with artists and designers to turn paper prototypes into interactive systems',
        ],
        technicalHighlights: [
          'Data-driven evidence architecture',
          'Drag-and-drop UI interactions',
          'State management for branching investigations',
          'Rule-based evidence validation',
          'Modular systems for adding new stories and evidence packages',
        ],
        skills: ['Godot 4', 'GDScript', 'Gameplay Programming', 'UI Programming', 'System Architecture', 'Puzzle Game Design', 'Data-Driven Development'],
        media: [
          { type: 'youtube', videoId: 'SXn_OBy1RS4', caption: 'Gameplay video' },
          { type: 'image', src: './images/tmiwt1.png', caption: 'Evidence board screenshot' },
          { type: 'image', src: './images/tmiwt2.png', caption: 'Newspaper drafting screenshot' },
        ],
        links: [
          { label: 'Play on Itch.io', url: 'https://hmyam6090-lab.itch.io/trust-me-i-was-there' },
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

  const isLight = Boolean(section.lightTheme);

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

              {project.role && (
                <div className="pdm-my-role">
                  <h3 className="pdm-features-title">Role</h3>
                  <p>{project.role}</p>
                </div>
              )}

              {project.myRole && (
                <div className="pdm-my-role">
                  <h3 className="pdm-features-title">My Role</h3>
                  <p>{project.myRole}</p>
                </div>
              )}

              {project.keyContributions?.length > 0 && (
                <div className="pdm-features">
                  <h3 className="pdm-features-title">Key Contributions</h3>
                  <ul>
                    {project.keyContributions.map((item, i) => (
                      <li key={i}>
                        <span className="pdm-feat-bullet" style={{ color: section.accent }}>▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.technicalHighlights?.length > 0 && (
                <div className="pdm-tech-highlights">
                  <h3 className="pdm-features-title">Technical Highlights</h3>
                  <ul>
                    {project.technicalHighlights.map((item, i) => (
                      <li key={i}>
                        <span className="pdm-feat-bullet" style={{ color: section.accent }}>▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.skills?.length > 0 && (
                <div className="pdm-skills-block">
                  <h3 className="pdm-features-title">Skills</h3>
                  <div className="pdm-skills-row">
                    {project.skills.map((skill) => (
                      <span key={skill} className="pdm-tag" style={{ borderColor: section.accent, color: section.accent }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Media */}
              {project.media.length > 0 && (
                <div className="pdm-media">
                  {project.media.map((m, i) => (
                    <div key={i} className="pdm-media-item">
                      {m.type === 'youtube' ? (
                        <div className="pdm-youtube-wrap">
                          <iframe
                            className="pdm-youtube-embed"
                            src={`https://www.youtube.com/embed/${m.videoId}`}
                            title={m.caption}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />
                        </div>
                      ) : (m.type === 'image' || m.type === 'gif' || /\.(gif|png|jpe?g|webp|bmp|svg)$/i.test(m.src)) ? (
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
