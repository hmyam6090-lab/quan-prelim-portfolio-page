import { useState, useEffect } from 'react';
import './Taskbar.css';

const Taskbar = ({ 
  windows, 
  activeWindowId, 
  restoreWindow, 
  minimizeWindow,
  toggleStartMenu,
  showStartMenu 
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const windowTitles = {
    about: 'About Me',
    projects: 'My Projects',
    skills: 'My Resume',
    contact: 'Contact Me',
    minesweeper: 'Minesweeper',
    snake: 'Snake',
    paint: 'Paint',
    gallery: 'Photos',
  };

  const handleTaskbarItemClick = (window) => {
    if (window.isMinimized || window.id !== activeWindowId) {
      restoreWindow(window.id);
    } else {
      minimizeWindow(window.id);
    }
  };

  const startIconSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='2' y='2' width='9' height='9' rx='2' fill='%234A90D9'/%3E%3Crect x='13' y='2' width='9' height='9' rx='2' fill='%2366BB6A'/%3E%3Crect x='2' y='13' width='9' height='9' rx='2' fill='%23FFB74D'/%3E%3Crect x='13' y='13' width='9' height='9' rx='2' fill='%23EF5350'/%3E%3C/svg%3E";

  return (
    <div className="taskbar">
      <button 
        className={`start-button ${showStartMenu ? 'active' : ''}`}
        onClick={toggleStartMenu}
      >
        <img src={startIconSvg} alt="Start" />
        <span>QuanOS</span>
      </button>

      <div className="taskbar-items">
        {windows.map(window => (
          <div
            key={window.id}
            className={`taskbar-item ${window.id === activeWindowId && !window.isMinimized ? 'active' : ''}`}
            onClick={() => handleTaskbarItemClick(window)}
          >
            {windowTitles[window.id]}
          </div>
        ))}
      </div>

      <div className="system-tray">
        <span className="time">{time}</span>
      </div>
    </div>
  );
};

export default Taskbar;
