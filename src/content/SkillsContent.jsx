import './Content.css';

const SkillsContent = () => {
  return (
    <div className="skills-page content-section">
      <div className="pdf-preview-container">
        <iframe
          src="./images/Quan_Hoang_Resume_Aug28.pdf#toolbar=0&navpanes=0&zoom=70"
          title="Resume Preview"
          className="pdf-preview-iframe"
        />
      </div>
    </div>
  );
};

export default SkillsContent;

