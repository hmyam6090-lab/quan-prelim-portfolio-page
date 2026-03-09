import './Content.css';

const SkillsContent = () => {
  const skillCategories = [
    {
      title: 'Game Development',
      icon: '\u2316',
      skills: ['Godot 2D/3D', 'GDScript', 'LOVE2D', 'Lua', 'Unity', 'C#', 'Rapid Prototyping']
    },
    {
      title: 'Web Development',
      icon: '\u269B',
      skills: ['React', 'Vue.js', 'Vite', 'Three.js', 'WebGL', 'CSS3', 'Firebase', 'Firestore', 'Canvas API']
    },
    {
      title: 'Creative Coding',
      icon: '\u272D',
      skills: ['p5.js', 'Processing', 'Lua', 'OpenCV', 'Blender', 'Generative Art', 'Audio Visualization']
    },
    {
      title: 'Mobile Development',
      icon: '\u260E',
      skills: ['Flutter', 'Dart', 'BLE Integration', 'AI/ML Integration', 'Android Testing', 'Localization']
    },
    {
      title: 'Backend & Data',
      icon: '\u2692',
      skills: ['Python', 'Node.js', 'ROS', 'C++', 'Arduino IDE', 'Data Processing', 'Scientific Computing']
    },
    {
      title: 'Hardware & IoT',
      icon: '\u262F',
      skills: ['Arduino', 'Sensor Fabrication', 'Capacitive Sensing', 'Wearable Electronics', 'BLE', 'FDC1004 Chips']
    }
  ];

  return (
    <div className="skills-page content-section">
      <div className="skills-header">
        <h2 className="skills-title">
          <span className="skills-title-serif">Technical</span>
          <span className="skills-title-sans">Skills</span>
        </h2>
        <p className="skills-subtitle">Game dev, web technologies, creative coding, mobile apps, and robotics research</p>
      </div>

      <div className="skills-grid">
        {skillCategories.map((category, index) => (
          <div
            key={index}
            className="skill-category-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="skill-category-header">
              <span className="skill-icon">{category.icon}</span>
              <h3>{category.title}</h3>
            </div>
            <div className="skill-items">
              {category.skills.map((skill, i) => (
                <span key={i} className="skill-item">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsContent;

