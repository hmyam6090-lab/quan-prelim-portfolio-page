import { useState } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import LoginScreen from './components/LoginScreen';
import Showcase from './components/Showcase';
import useSound from './hooks/useSound';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [highestZIndex, setHighestZIndex] = useState(100);
  const { play: playSound, unlock: unlockSound } = useSound();

  const openWindow = (windowId) => {
    const existingWindow = windows.find(w => w.id === windowId);
    
    if (existingWindow) {
      bringToFront(windowId);
      return;
    }

    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);

    const newWindow = {
      id: windowId,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZIndex,
      position: {
        x: 100 + (windows.length * 30),
        y: 100 + (windows.length * 30)
      }
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(windowId);
    playSound('windowOpen');
  };

  const closeWindow = (windowId) => {
    playSound('click');
    setWindows(windows.filter(w => w.id !== windowId));
    if (activeWindowId === windowId) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (windowId) => {
    playSound('click');
    setWindows(windows.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
  };

  const restoreWindow = (windowId) => {
    setWindows(windows.map(w => 
      w.id === windowId ? { ...w, isMinimized: false } : w
    ));
    bringToFront(windowId);
  };

  const toggleMaximize = (windowId) => {
    setWindows(windows.map(w => 
      w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const bringToFront = (windowId) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    setWindows(windows.map(w => 
      w.id === windowId ? { ...w, zIndex: newZIndex } : w
    ));
    setActiveWindowId(windowId);
  };

  const updateWindowPosition = (windowId, position) => {
    setWindows(windows.map(w => 
      w.id === windowId ? { ...w, position } : w
    ));
  };

  const toggleStartMenu = () => {
    playSound('click');
    setShowStartMenu(!showStartMenu);
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} unlockSound={unlockSound} />
      ) : (
        <>
          <Desktop 
            key="desktop-after-login"
            windows={windows}
            activeWindowId={activeWindowId}
            openWindow={openWindow}
            closeWindow={closeWindow}
            minimizeWindow={minimizeWindow}
            toggleMaximize={toggleMaximize}
            bringToFront={bringToFront}
            updateWindowPosition={updateWindowPosition}
            playSound={playSound}
          />
          
          <Taskbar
            windows={windows}
            activeWindowId={activeWindowId}
            openWindow={openWindow}
            restoreWindow={restoreWindow}
            minimizeWindow={minimizeWindow}
            toggleStartMenu={toggleStartMenu}
            showStartMenu={showStartMenu}
          />

          <StartMenu
            show={showStartMenu}
            openWindow={openWindow}
            onClose={() => setShowStartMenu(false)}
          />

          <Showcase />
        </>
      )}
    </div>
  );
}

export default App;
