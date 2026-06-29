import { useState, useEffect, useRef } from 'react';
import ProjectDetailModal from './ProjectDetailModal';
import './Showcase.css';

const projectSections = [
  {
    id: 'fluidity',
    index: '01',
    label: 'Fluidity',
    title: 'Fluidity',
    subtitle: 'Softbody Physics-based educational platformer • Lead Gameplay Programmer',
    desc: 'State-switching gameplay across solid, liquid, and gas forms to solve educational puzzle levels.',
    tags: ['Godot 2D', 'GDScript', 'Physics'],
    media: { type: 'youtube', youtubeId: 'vgPaHUHjU-Q' },
    externalUrl: 'https://fluidity-website.vercel.app/',
    externalLabel: 'Project Page',
    photos: [
      { src: './images/fluidity1.png', alt: 'Fluidity screenshot 1' },
      { src: './images/fluidity2.png', alt: 'Fluidity screenshot 2' },
    ],
    buttonClass: 'fluidity-btn',
    rowClass: 'fluidity-row',
  },
  {
    id: 'trustme',
    index: '02',
    label: 'Trust Me, I Was There!',
    title: 'Trust Me, I Was There!',
    subtitle: 'Narrative deduction game about evidence and truth • Lead Gameplay Programmer & Producer',
    desc: 'Players edit a summer camp newspaper by cross-referencing conflicting witness accounts and evidence. Built for Summer Comfy Jam 2026, ranked 75th out of ~450 submissions.',
    tags: ['Godot 4', 'GDScript', 'Narrative Systems'],
    media: { type: 'youtube', youtubeId: 'SXn_OBy1RS4' },
    externalUrl: 'https://hmyam6090-lab.itch.io/trust-me-i-was-there',
    externalLabel: 'Itch.io Page',
    photos: [
      { src: './images/tmiwt1.png', alt: 'Trust Me screenshot 1' },
      { src: './images/tmiwt2.png', alt: 'Trust Me screenshot 2' },
    ],
    buttonClass: 'trust-btn',
    rowClass: 'trust-row',
    reverse: true,
  },
  {
    id: 'houseofillusions',
    index: '03',
    label: 'House Of Illusions',
    title: 'House Of Illusions',
    subtitle: 'Dual-reality puzzle platformer built in 48 hours • Gameplay Programmer',
    desc: 'A hackathon-winning game where players swap between real and mirror worlds mid-movement.',
    tags: ['Godot 2D', 'GDScript', 'Game Jam'],
    media: { type: 'youtube', youtubeId: '0NA3VAn1G3o' },
    externalUrl: 'https://hmyam6090-lab.itch.io/',
    externalLabel: 'Itch.io Page',
    photos: [
      { src: './images/house1.png', alt: 'House of Illusions screenshot 1' },
      { src: './images/house2.png', alt: 'House of Illusions screenshot 2' },
    ],
    buttonClass: 'illusions-btn',
    rowClass: 'illusions-row',
  },
  {
    id: 'bytediep',
    index: '04',
    label: 'BYTEDIEP',
    title: 'BYTEDIEP',
    subtitle: 'Replayable class-based arcade shooter • Gameplay Programmer',
    desc: 'A BYTEPATH variation with class diversification and build theorycrafting inspired by diep.io.',
    tags: ['Lua', 'LOVE2D', 'Arcade Systems'],
    media: { type: 'gif', src: './images/gameplay_bytediep.gif', alt: 'BYTEDIEP gameplay gif' },
    externalUrl: 'https://github.com/hmyam6090-lab/BYTEDIEP---BYTEPATH-VARIATION',
    externalLabel: 'GitHub Repo',
    photos: [
      { src: './images/gameover_bytediep.png', alt: 'BYTEDIEP gameover screenshot' },
    ],
    buttonClass: 'bytediep-btn',
    rowClass: 'bytediep-row',
    reverse: true,
  },
  {
    id: 'beyondcooked',
    index: '05',
    label: 'Beyond Cooked',
    title: 'Beyond Cooked',
    subtitle: 'Chaotic co-op cooking in hostile dimensions • Gameplay Programmer',
    desc: 'Players gather ingredients in dangerous zones, then coordinate kitchen workflows under pressure.',
    tags: ['Godot 3D', 'GDScript', 'Co-op Gameplay'],
    media: {
      type: 'images',
      images: [
        { src: './images/beyond-cooked-1.png', alt: 'Beyond Cooked screenshot 1' },
        { src: './images/beyond-cooked-2.png', alt: 'Beyond Cooked screenshot 2' },
      ],
    },
    externalUrl: 'https://github.com/hmyam6090-lab/Beyond-Cooked',
    externalLabel: 'GitHub Repo',
    photos: [
      { src: './images/beyond-cooked-1.png', alt: 'Beyond Cooked pinned screenshot 1' },
      { src: './images/beyond-cooked-2.png', alt: 'Beyond Cooked pinned screenshot 2' },
    ],
    buttonClass: 'beyond-btn',
    rowClass: 'beyond-row',
  },
];

const Showcase = () => {
  const [visible, setVisible] = useState(new Set());
  const [activeModal, setActiveModal] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => new Set([...prev, entry.target.dataset.section]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = sectionRef.current?.querySelectorAll('[data-section]');
    sections?.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="showcase" ref={sectionRef}>
      <div className="showcase-intro">
        <div className="showcase-intro-line">
          <span className="sc-serif sc-blue sc-huge">Game Dev</span>
        </div>
        <div className="showcase-intro-line">
          <span className="sc-italic sc-gray sc-big">Selected</span>
          <span className="sc-serif sc-gray sc-big">Projects</span>
        </div>
      </div>

      {projectSections.map((section) => (
        <div
          key={section.id}
          className={`showcase-row ${section.reverse ? 'reverse' : ''} ${section.rowClass} ${visible.has(section.id) ? 'visible' : ''}`}
          data-section={section.id}
        >
          <div className="showcase-type game-project-type">
            <span className="project-label">{section.index}</span>
            <h2 className="project-title">{section.title}</h2>
            <p className="project-subtitle">{section.subtitle}</p>
            <p className="showcase-desc">{section.desc}</p>
            <div className="project-tags">
              {section.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="project-action-buttons">
              <button className={`see-more-btn ${section.buttonClass}`} onClick={() => setActiveModal(section.id)}>
                See More <span className="see-more-arrow">→</span>
              </button>
              <a
                className={`external-btn ${section.buttonClass}`}
                href={section.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {section.externalLabel} <span className="see-more-arrow">↗</span>
              </a>
            </div>
          </div>

          <div className="showcase-win game-project-win">
            <div className={`game-media-stage ${section.id}-stage`}>
              <div className="game-player-window">
                <div className="sc-win-bar game-media-bar">
                  <div className="sc-win-dots"><span /><span /><span /></div>
                </div>
                <div className="sc-win-body game-media-body">
                  {section.media.type === 'youtube' && (
                    <div className="game-media-youtube-wrap">
                      <iframe
                        className="game-media-youtube"
                        src={`https://www.youtube.com/embed/${section.media.youtubeId}`}
                        title={`${section.label} video`}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {section.media.type === 'gif' && (
                    <div className="game-media-gif-wrap">
                      <img src={section.media.src} alt={section.media.alt} className="game-media-gif" />
                    </div>
                  )}

                  {section.media.type === 'images' && (
                    <div className="game-media-image-grid">
                      {section.media.images.map((img) => (
                        <div key={img.alt} className="game-media-image-cell">
                          <img src={img.src} alt={img.alt} className="game-media-image" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="floating-shots" aria-hidden="true">
                {section.photos.map((photo, idx) => (
                  <figure key={photo.alt} className={`floating-shot shot-${idx + 1}`}>
                    <img src={photo.src} alt={photo.alt} className="game-photo" />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {activeModal && (
        <ProjectDetailModal
          sectionId={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}

      <div className="showcase-foot">
        <p><span className="sc-serif sc-blue">Quan</span> Game Developer Portfolio</p>
        <p className="showcase-foot-sub">Built with React + Vite</p>
      </div>
    </section>
  );
};

export default Showcase;
