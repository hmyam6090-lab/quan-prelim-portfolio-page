import { useState, useEffect, useRef, useCallback } from 'react';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import './Desktop.css';

const Desktop = ({ 
  windows, 
  activeWindowId, 
  openWindow, 
  closeWindow, 
  minimizeWindow, 
  toggleMaximize,
  bringToFront,
  updateWindowPosition,
  playSound
}) => {
  const desktopRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  // Desktop icons — matching the screenshot layout
  const desktopIcons = [
    // Left column (top to bottom)
    { id: 'story1', label: 'Story', iconType: 'folder-small', x: 4, y: 47, depth: 0.5 },
    { id: 'story5', label: 'Story 06', iconType: 'folder-small', x: 3, y: 7, depth: 1.0 },
    { id: 'about', label: 'About Me', iconType: 'folder', x: 20, y: 25, depth: 0.8 },
    { id: 'projects', label: 'Projects', iconType: 'folder', x: 18, y: 40, depth: 0.6 },
    { id: 'contact', label: 'Contact Me', iconType: 'mail', x: 21, y: 55, depth: 1.0 },
    { id: 'skills', label: 'Resume.pdf', iconType: 'pdf', x: 24, y: 70, depth: 1.2 },
    { id: 'demo', label: 'demo-reel.mov', iconType: 'video', x: 8, y: 60, depth: 0.8 },
    { id: 'gallery', label: 'Photos', iconType: 'gallery', x: 4, y: 76, depth: 0.7 },

    // Center top
    { id: 'paint', label: 'Paint.exe', iconType: 'paint', x: 27, y: 12, depth: 0.5 },

    // Right column (top to bottom)
    { id: 'link-github', label: 'GitHub', iconType: 'github', x: 68, y: 15, depth: 1.4, url: 'https://github.com/hmyam6090-lab' },
    { id: 'readme', label: 'README.md', iconType: 'document', x: 92, y: 18, depth: 1.3 },
    { id: 'link-linkedin', label: 'LinkedIn', iconType: 'linkedin', x: 72, y: 30, depth: 1.1, url: 'https://www.linkedin.com/in/qu%C3%A2n-m-ho%C3%A0ng-251160383/' },
    { id: 'mockup', label: 'mockup.fig', iconType: 'image', x: 87, y: 36, depth: 0.6 },
    { id: 'link-itchio', label: 'Itch.io', iconType: 'itchio', x: 76, y: 43, depth: 0.9, url: 'https://hmyam6090-lab.itch.io/' },
    { id: 'minesweeper', label: 'Minesweeper.exe', iconType: 'minesweeper', x: 72, y: 58, depth: 0.7 },
    { id: 'brand', label: 'brand-assets', iconType: 'folder-small', x: 85, y: 72, depth: 0.4 },
    { id: 'snake', label: 'Snake.exe', iconType: 'game', x: 68, y: 75, depth: 1.1 },
  ];

  // Openable icons (respond to double-click) — projects excluded (scrolls instead)
  const openableIds = ['about', 'skills', 'contact', 'minesweeper', 'snake', 'paint', 'gallery'];
  // Icons that open external URLs
  const urlIcons = desktopIcons.filter(i => i.url).reduce((acc, i) => { acc[i.id] = i.url; return acc; }, {});

  // ── Draggable icon state ──
  const [iconPositions, setIconPositions] = useState({});
  const [dragging, setDragging] = useState(null); // { iconId, offsetX, offsetY }
  const dragStartPos = useRef(null);

  // ── Draggable photo window state ──
  const [photoPositions, setPhotoPositions] = useState({
    pw1: { x: 3, y: 23 },
    pw2: { x: 78, y: 8 },
    pw3: { x: 85, y: 50 },
  });
  const [draggingPhoto, setDraggingPhoto] = useState(null);

  const handleIconMouseDown = useCallback((e, iconId) => {
    e.preventDefault();
    e.stopPropagation();
    const desktopRect = desktopRef.current.getBoundingClientRect();
    const target = e.currentTarget;
    const iconRect = target.getBoundingClientRect();
    
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    
    setDragging({
      iconId,
      offsetX: e.clientX - iconRect.left,
      offsetY: e.clientY - iconRect.top,
      desktopWidth: desktopRect.width,
      desktopHeight: desktopRect.height,
      desktopLeft: desktopRect.left,
      desktopTop: desktopRect.top,
    });
  }, []);

  const handlePhotoMouseDown = useCallback((e, photoId) => {
    e.preventDefault();
    e.stopPropagation();
    const desktopRect = desktopRef.current.getBoundingClientRect();
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    
    setDraggingPhoto({
      photoId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      desktopWidth: desktopRect.width,
      desktopHeight: desktopRect.height,
      desktopLeft: desktopRect.left,
      desktopTop: desktopRect.top,
    });
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e) => {
      const x = ((e.clientX - dragging.offsetX - dragging.desktopLeft) / dragging.desktopWidth) * 100;
      const y = ((e.clientY - dragging.offsetY - dragging.desktopTop) / dragging.desktopHeight) * 100;

      setIconPositions(prev => ({
        ...prev,
        [dragging.iconId]: {
          x: Math.max(0, Math.min(92, x)),
          y: Math.max(0, Math.min(88, y)),
        },
      }));
    };

    const handleMouseUp = () => {
      setDragging(null);
      dragStartPos.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  // Photo window dragging
  useEffect(() => {
    if (!draggingPhoto) return;

    const handleMouseMove = (e) => {
      const x = ((e.clientX - draggingPhoto.offsetX - draggingPhoto.desktopLeft) / draggingPhoto.desktopWidth) * 100;
      const y = ((e.clientY - draggingPhoto.offsetY - draggingPhoto.desktopTop) / draggingPhoto.desktopHeight) * 100;

      setPhotoPositions(prev => ({
        ...prev,
        [draggingPhoto.photoId]: {
          x: Math.max(0, Math.min(88, x)),
          y: Math.max(0, Math.min(85, y)),
        },
      }));
    };

    const handleMouseUp = () => {
      setDraggingPhoto(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingPhoto]);

  // Scroll to showcase when Projects icon is double-clicked
  const scrollToShowcase = useCallback(() => {
    playSound?.('click');
    const showcase = document.querySelector('.showcase');
    if (showcase) {
      showcase.scrollIntoView({ behavior: 'smooth' });
    }
  }, [playSound]);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e) => {
      const x = ((e.clientX - dragging.offsetX - dragging.desktopLeft) / dragging.desktopWidth) * 100;
      const y = ((e.clientY - dragging.offsetY - dragging.desktopTop) / dragging.desktopHeight) * 100;

      setIconPositions(prev => ({
        ...prev,
        [dragging.iconId]: {
          x: Math.max(0, Math.min(92, x)),
          y: Math.max(0, Math.min(88, y)),
        },
      }));
    };

    const handleMouseUp = () => {
      setDragging(null);
      dragStartPos.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!desktopRef.current) return;
      const rect = desktopRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.height / 2) / rect.height;
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getParallaxStyle = (depth) => ({
    transform: `translate(${mouse.x * depth * 20}px, ${mouse.y * depth * 20}px)`,
  });

  // Whole-screen perspective tilt
  const perspectiveStyle = {
    transform: `perspective(1200px) rotateY(${mouse.x * 3}deg) rotateX(${-mouse.y * 3}deg)`,
  };

  return (
    <div className="desktop" ref={desktopRef}>
      <div className="desktop-perspective" style={perspectiveStyle}>
      {/* Hero Typography */}
      <div className={`hero-typography ${loaded ? 'visible' : ''}`}>
        <div className="hero-line hero-line-1" style={getParallaxStyle(0.3)}>
          <span className="hero-word hero-italic hero-gray hero-sm">A</span>
          <span className="hero-word hero-serif hero-blue hero-lg">Creative</span>
        </div>
        <div className="hero-line hero-line-2" style={getParallaxStyle(0.15)}>
          <span className="hero-word hero-serif hero-gray hero-xl">Portfolio</span>
        </div>
        <div className="hero-line hero-line-3" style={getParallaxStyle(0.25)}>
          <span className="hero-word hero-italic hero-gray hero-sm">by</span>
          <span className="hero-word hero-serif hero-blue hero-xl">Quan</span>
        </div>
      </div>

      {/* Scattered Desktop Icons */}
      <div className="desktop-icons-scattered">
        {desktopIcons.map((icon, index) => {
          const pos = iconPositions[icon.id] || { x: icon.x, y: icon.y };
          const isDraggingThis = dragging?.iconId === icon.id;
          const isOpenable = openableIds.includes(icon.id);

          return (
            <div
              key={icon.id}
              className={`scattered-icon ${loaded ? 'visible' : ''} ${isDraggingThis ? 'dragging' : ''}`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                ...(isDraggingThis ? {} : getParallaxStyle(icon.depth)),
                animationDelay: `${index * 0.06}s`,
                transitionDelay: isDraggingThis ? '0s' : `${index * 0.04}s`,
                zIndex: isDraggingThis ? 100 : undefined,
              }}
              onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
            >
              <DesktopIcon
                id={icon.id}
                label={icon.label}
                iconType={icon.iconType}
                onDoubleClick={
                  icon.id === 'projects'
                    ? scrollToShowcase
                    : urlIcons[icon.id]
                    ? () => { playSound?.('click'); window.open(urlIcons[icon.id], '_blank'); }
                    : isOpenable
                    ? () => { playSound?.('click'); openWindow(icon.id); }
                    : undefined
                }
                isInteractive={isOpenable || !!urlIcons[icon.id] || icon.id === 'projects'}
              />
            </div>
          );
        })}
      </div>

      {/* Pre-opened photo windows (draggable) */}
      {loaded && (
        <>
          <div
            className={`desktop-photo-window pw-1 ${draggingPhoto?.photoId === 'pw1' ? 'dragging' : ''}`}
            style={{
              left: `${photoPositions.pw1.x}%`,
              top: `${photoPositions.pw1.y}%`,
              ...(draggingPhoto?.photoId === 'pw1' ? {} : getParallaxStyle(0.4)),
            }}
            onMouseDown={(e) => handlePhotoMouseDown(e, 'pw1')}
          >
            <div className="photo-win-bar">
              <span>photo1.jpg — Preview</span>
              <span className="photo-win-x">×</span>
            </div>
            <img src="./photos/photo1.jpg" alt="" draggable={false} />
          </div>
          <div
            className={`desktop-photo-window pw-2 ${draggingPhoto?.photoId === 'pw2' ? 'dragging' : ''}`}
            style={{
              left: `${photoPositions.pw2.x}%`,
              top: `${photoPositions.pw2.y}%`,
              ...(draggingPhoto?.photoId === 'pw2' ? {} : getParallaxStyle(0.6)),
            }}
            onMouseDown={(e) => handlePhotoMouseDown(e, 'pw2')}
          >
            <div className="photo-win-bar">
              <span>photo3.jpg — Preview</span>
              <span className="photo-win-x">×</span>
            </div>
            <img src="./photos/photo3.jpg" alt="" draggable={false} />
          </div>
          <div
            className={`desktop-photo-window pw-3 ${draggingPhoto?.photoId === 'pw3' ? 'dragging' : ''}`}
            style={{
              left: `${photoPositions.pw3.x}%`,
              top: `${photoPositions.pw3.y}%`,
              ...(draggingPhoto?.photoId === 'pw3' ? {} : getParallaxStyle(0.3)),
            }}
            onMouseDown={(e) => handlePhotoMouseDown(e, 'pw3')}
          >
            <div className="photo-win-bar">
              <span>photo5.jpg — Preview</span>
              <span className="photo-win-x">×</span>
            </div>
            <img src="./photos/photo5.jpg" alt="" draggable={false} />
          </div>
        </>
      )}

      </div>{/* end desktop-perspective */}

      {/* Scroll-down indicator */}
      <div className="scroll-indicator" onClick={() => {
        const showcase = document.querySelector('.showcase');
        if (showcase) showcase.scrollIntoView({ behavior: 'smooth' });
      }}>
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
      </div>

      {/* Windows */}
      {windows.map(window => (
        <Window
          key={window.id}
          id={window.id}
          isActive={activeWindowId === window.id}
          isMinimized={window.isMinimized}
          isMaximized={window.isMaximized}
          zIndex={window.zIndex}
          position={window.position}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onToggleMaximize={() => toggleMaximize(window.id)}
          onFocus={() => bringToFront(window.id)}
          onPositionChange={(pos) => updateWindowPosition(window.id, pos)}
        />
      ))}
    </div>
  );
};

export default Desktop;
