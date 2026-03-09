import { useState, useRef, useEffect } from 'react';
import AboutContent from '../content/AboutContent';
import ProjectsContent from '../content/ProjectsContent';
import SkillsContent from '../content/SkillsContent';
import ContactContent from '../content/ContactContent';
import MinesweeperContent from '../content/MinesweeperContent';
import SnakeContent from '../content/SnakeContent';
import PaintContent from '../content/PaintContent';
import GalleryContent from '../content/GalleryContent';
import './Window.css';

const Window = ({
  id,
  isActive,
  isMinimized,
  isMaximized,
  zIndex,
  position,
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  onPositionChange
}) => {
  const windowRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const windowConfig = {
    about: {
      title: 'About Me',
      color: '#4a90e2',
      Component: AboutContent,
      address: 'About Me',
      toolbar: ['◀ Back', '▶ Forward', 'Search', 'Folders']
    },
    projects: {
      title: 'My Projects',
      color: '#1f7fd3',
      Component: ProjectsContent,
      address: 'https://www.myprojects.com',
      toolbar: ['⌂ Home', '◀ Back', '▶ Forward', '★ Favorites', '🗲 Light/Dark']
    },
    skills: {
      title: 'My Resume',
      color: '#db3f2f',
      Component: SkillsContent,
      address: 'My Resume',
      toolbar: ['◀ Back', '▶ Forward', 'Search', 'Folders']
    },
    contact: {
      title: 'Contact Me',
      color: '#f4c137',
      Component: ContactContent,
      address: 'Contact Me',
      toolbar: ['◀ Back', '▶ Forward', 'Search', 'Folders']
    },
    minesweeper: {
      title: 'Minesweeper',
      color: '#888888',
      Component: MinesweeperContent,
      address: 'C:\\Windows\\System32\\Minesweeper.exe',
      toolbar: ['Game', 'Help']
    },
    snake: {
      title: 'Snake',
      color: '#00cc6a',
      Component: SnakeContent,
      address: 'C:\\Windows\\System32\\Snake.exe',
      toolbar: ['Game', 'Help']
    },
    paint: {
      title: 'Paint',
      color: '#4A90D9',
      Component: PaintContent,
      address: 'C:\\Windows\\System32\\mspaint.exe',
      toolbar: ['File', 'Edit', 'View', 'Image', 'Colors', 'Help']
    },
    gallery: {
      title: 'Photos',
      color: '#66BB6A',
      Component: GalleryContent,
      address: 'C:\\Users\\Quan\\Pictures',
      toolbar: ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help']
    }
  };

  const config = windowConfig[id];
  const ContentComponent = config.Component;

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    
    onFocus();
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && !isMaximized) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        const maxX = window.innerWidth - windowRef.current.offsetWidth;
        const maxY = window.innerHeight - windowRef.current.offsetHeight - 40;
        
        onPositionChange({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMaximized, onPositionChange]);

  const iconSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect fill='${encodeURIComponent(config.color)}' width='16' height='16' rx='1'/%3E%3C/svg%3E`;

  if (isMinimized) return null;

  const windowStyle = {
    left: isMaximized ? '10px' : `${position.x}px`,
    top: isMaximized ? '10px' : `${position.y}px`,
    width: isMaximized ? 'calc(100vw - 20px)' : id === 'about' ? '820px' : id === 'paint' ? '780px' : id === 'snake' ? '480px' : id === 'minesweeper' ? '380px' : id === 'gallery' ? '720px' : '650px',
    height: isMaximized ? 'calc(100vh - 60px)' : id === 'paint' ? '620px' : id === 'snake' ? '580px' : id === 'minesweeper' ? '500px' : id === 'gallery' ? '540px' : 'auto',
    zIndex: zIndex
  };

  return (
    <div
      ref={windowRef}
      className={`window ${isActive ? 'active' : ''}`}
      style={windowStyle}
      onMouseDown={onFocus}
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <div className="window-title">
          <img className="window-icon" src={iconSvg} alt="" />
          <span>{config.title}</span>
        </div>
        <div className="window-controls">
          <button className="minimize" onClick={onMinimize}>_</button>
          <button className="maximize" onClick={onToggleMaximize}>□</button>
          <button className="close" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="window-menu">File&nbsp;&nbsp;&nbsp;Edit&nbsp;&nbsp;&nbsp;View&nbsp;&nbsp;&nbsp;Favorites&nbsp;&nbsp;&nbsp;Tools&nbsp;&nbsp;&nbsp;Help</div>
      <div className="window-toolbar">
        {config.toolbar.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="window-address-bar">
        <span className="window-address-label">Address</span>
        <div className="window-address-input">{config.address}</div>
      </div>
      <div className="window-content">
        <ContentComponent />
      </div>
    </div>
  );
};

export default Window;
