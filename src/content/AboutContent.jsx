import useTypewriter from '../hooks/useTypewriter';
import './Content.css';

const AboutContent = () => {
  const typedSubtitle = useTypewriter('Game Dev + Creative Coder trying to make cool stuff', 40, 300);

  const highlights = [
    { label: 'React', category: 'Web Dev' },
    { label: 'Godot', category: 'Game Dev' },
    { label: 'Unity', category: 'Game Dev' },
    { label: 'Love2D', category: 'Game Dev' },
    { label: 'Processing', category: 'Creative Coding' },
    { label: 'Figma', category: 'Design' },
    { label: 'Flutter', category: 'Mobile Dev' },
  ];

  return (
    <div className="about-page content-section">
      <div className="about-hero">
        <h1 className="about-name">
          <span className="name-line">
            <span className="name-hi">Hello, I'm</span>
          </span>
          <span className="name-line name-big">
            <span className="name-serif">Quan</span>
          </span>
        </h1>
        <p className="about-subtitle">{typedSubtitle}<span className="type-caret" aria-hidden="true">|</span></p>
      </div>

      <div className="about-body">
        <div className="about-text">
          <p>
            I'm a game developer and creative coder with a passion for crafting engaging interactive experiences. I love exploring the intersection of technology and creativity, and I'm always eager to learn new tools and techniques to bring my ideas to life.
          </p>
          <p>
            My work spans React, Godot, Unity, and more, with projects ranging from web apps to experimental games. I'm currently focused on honing my game development skills and building a portfolio of fun, innovative projects. When I'm not coding, you can find me sketching game concepts, playing around with generative art, or diving into the latest game design trends.
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
          <a href="https://github.com/hmyam6090-lab" target="_blank" rel="noopener noreferrer" className="about-link">GitHub</a>
          <a href="https://www.linkedin.com/in/qu%C3%A2n-m-ho%C3%A0ng-251160383/" target="_blank" rel="noopener noreferrer" className="about-link">LinkedIn</a>
          <a href="https://www.instagram.com/jamesyboi64/" target="_blank" rel="noopener noreferrer" className="about-link">Instagram</a>
        </div>  
      </div>
    </div>
  );
};

export default AboutContent;
