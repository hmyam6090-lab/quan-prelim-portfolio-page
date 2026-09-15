import useTypewriter from '../hooks/useTypewriter';
import './Content.css';

const AboutContent = () => {
  const typedSubtitle = useTypewriter('Gameplay Programmer specializing in interactive systems', 40, 300);

  const highlights = [
    { label: 'Unity', category: 'Gameplay Systems' },
    { label: 'C#', category: 'Programming' },
    { label: 'Godot', category: 'Game Engines' },
    { label: 'GDScript', category: 'Programming' },
    { label: 'Lua', category: 'Programming' },
    { label: 'LOVE2D', category: 'Game Engines' },
    { label: 'Agile/Scrum', category: 'Development' },
  ];

  return (
    <div className="about-page content-section">
      <div className="about-hero">
        <div className="about-hero-text">
          <h1 className="about-name">
            <span className="name-line">
              <span className="name-hi">Hello, I'm</span>
            </span>
            <span className="name-line name-big">
              <span className="name-serif">Quan Hoang</span>
            </span>
          </h1>
          <p className="about-subtitle">{typedSubtitle}<span className="type-caret" aria-hidden="true">|</span></p>
        </div>
        <div className="about-image-section">
          <img src="./photos/headshot.png" alt="Profile" className="about-profile-image" />
        </div>
      </div>

      <div className="about-body">
        <div className="about-text">
          <p>
            I'm a gameplay programmer passionate about building interactive systems that create meaningful player experiences. I specialize in implementing core mechanics, puzzle systems, and game loops across Unity and Godot, with experience leading development teams in Agile environments.
          </p>
          <p>
            My recent work includes leading programming on a 5-person team for IndieCade's Climate Jam 2026, where I built custom tooling that reduced asset import time by 35% and build size by 50%. I've shipped multiple games ranging from educational platformers with physics-based state switching to narrative deduction games with complex evidence systems. I thrive on turning design concepts into shippable mechanics through clean architecture and iterative development.
          </p>
        </div>

        <div className="about-highlights">
          <h3 className="highlights-title">What I Do</h3>
          <div className="highlight-tags">
            {highlights.map((item) => (
              <span key={item.label} className="highlight-tag">
                <span className="tag-category">{item.category}</span>
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="about-links">
          <a href="./images/Quan_Hoang_Resume_Aug28.pdf" target="_blank" rel="noopener noreferrer" className="about-link">Resume</a>
          <a href="mailto:hmyam6090@gmail.com" className="about-link">Email</a>
          <a href="https://github.com/hmyam6090-lab" target="_blank" rel="noopener noreferrer" className="about-link">GitHub</a>
          <a href="https://www.linkedin.com/in/qu%C3%A2n-m-ho%C3%A0ng-251160383/" target="_blank" rel="noopener noreferrer" className="about-link">LinkedIn</a>
          <a href="https://hmyam6090-lab.itch.io/" target="_blank" rel="noopener noreferrer" className="about-link">Itch.io</a>
        </div>  
      </div>
    </div>
  );
};

export default AboutContent;
