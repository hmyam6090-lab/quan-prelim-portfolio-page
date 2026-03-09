import './Content.css';

const ContactContent = () => {
  const contactInfo = [
    {
      title: 'Email',
      value: 'hmyam6090@gmail.com',
      link: 'mailto:hmyam6090@gmail.com',
      icon: '\u2709'
    },
    {
      title: 'Email (University)',
      value: 'qhoang@wesleyan.edu',
      link: 'mailto:qhoang@wesleyan.edu',
      icon: '\u2709'
    },
    {
      title: 'GitHub',
      value: 'github.com/hmyam6090-lab',
      link: 'https://github.com/hmyam6090-lab',
      icon: '\u2302'
    },
    {
      title: 'LinkedIn',
      value: 'Quân M. Hoàng',
      link: 'https://www.linkedin.com/in/qu%C3%A2n-m-ho%C3%A0ng-251160383/',
      icon: '\u2B1C'
    },
    {
      title: 'Itch.io',
      value: 'hmyam6090-lab.itch.io',
      link: 'https://hmyam6090-lab.itch.io/',
      icon: '\uD83C\uDFAE'
    }
  ];

  return (
    <div className="contact-page content-section">
      <div className="contact-hero">
        <h2 className="contact-title">
          <span className="contact-title-serif">Get In</span>
          <span className="contact-title-sans">Touch</span>
        </h2>
        <p className="contact-subtitle">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
        </p>
      </div>

      <div className="contact-grid">
        {contactInfo.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="contact-icon">{item.icon}</span>
            <div className="contact-card-info">
              <h3>{item.title}</h3>
              <p>{item.value}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ContactContent;
