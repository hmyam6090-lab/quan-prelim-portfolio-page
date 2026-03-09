import { useState } from 'react';
import './Content.css';

const ProjectsContent = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Web', 'Design', 'Video', 'Personal'];

  const projects = [
    {
      title: 'Retro Devices',
      description: 'A nostalgic collection of 3D-rendered retro computing devices.',
      tags: ['React', 'Three.js', 'CSS'],
      category: 'Web',
    },
    {
      title: 'DoodleDev',
      description: 'Creative coding playground with generative art experiments.',
      tags: ['Canvas', 'JavaScript', 'Animation'],
      category: 'Web',
    },
    {
      title: 'Brand Identity',
      description: 'Full brand identity system including logo, typography, and guidelines.',
      tags: ['Figma', 'Illustrator', 'Design'],
      category: 'Design',
    },
    {
      title: 'Motion Reel',
      description: 'Compilation of motion graphics and video editing projects.',
      tags: ['After Effects', 'Premiere', 'Motion'],
      category: 'Video',
    },
  ];

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="projects-page content-section">
      <div className="projects-header">
        <h2 className="projects-title">
          <span className="projects-title-serif">Selected</span>
          <span className="projects-title-sans">Works</span>
        </h2>
        <div className="projects-filters">
          {filters.map(filter => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="projects-grid">
        {filtered.map((project, index) => (
          <article
            key={project.title}
            className="project-card-new"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="project-thumb-new">
              <div className="project-overlay">
                <span className="project-view">View Project</span>
              </div>
            </div>
            <div className="project-details">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map(tag => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ProjectsContent;
