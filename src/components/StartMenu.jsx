import { useEffect, useRef } from 'react';
import './StartMenu.css';

const StartMenu = ({ show, openWindow, onClose }) => {
  const menuRef = useRef(null);

  const menuItems = [
    { id: 'about', label: 'About Me' },
    { id: 'projects', label: 'My Projects' },
    { id: 'skills', label: 'My Resume' },
    { id: 'contact', label: 'Contact Me' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          !event.target.closest('.start-button')) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  const handleMenuItemClick = (id) => {
    if (id === 'projects') {
      const showcase = document.querySelector('.showcase');
      if (showcase) showcase.scrollIntoView({ behavior: 'smooth' });
    } else {
      openWindow(id);
    }
    onClose();
  };

  if (!show) return null;

  return (
    <div ref={menuRef} className="start-menu">
      <div className="start-menu-header">
        <div className="user-avatar"></div>
        <span className="username">QuanOS</span>
      </div>
      <div className="start-menu-items">
        {menuItems.map(item => (
          <div 
            key={item.id}
            className="menu-item" 
            onClick={() => handleMenuItemClick(item.id)}
          >
            <span>{item.label}</span>
          </div>
        ))}
        <hr />
        <div className="menu-item">
          <span>My Documents</span>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
