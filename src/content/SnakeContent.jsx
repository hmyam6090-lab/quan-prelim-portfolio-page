import { useState, useEffect, useCallback, useRef } from 'react';

const GRID = 20;
const CELL = 18;
const SPEED = 120;

const SnakeContent = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 10 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const dirRef = useRef(dir);
  const gameRef = useRef(null);

  const spawnFood = useCallback((snakeBody) => {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID),
      };
    } while (snakeBody.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }, []);

  const resetGame = useCallback(() => {
    const initial = [{ x: 10, y: 10 }];
    setSnake(initial);
    setFood(spawnFood(initial));
    setDir({ x: 1, y: 0 });
    dirRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameOver(false);
    setRunning(true);
  }, [spawnFood]);

  useEffect(() => {
    const handleKey = (e) => {
      const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      };

      const newDir = keyMap[e.key];
      if (newDir) {
        e.preventDefault();
        // Prevent reversing direction
        if (newDir.x !== -dirRef.current.x || newDir.y !== -dirRef.current.y) {
          dirRef.current = newDir;
          setDir(newDir);
        }
        if (!running && !gameOver) {
          setRunning(true);
        }
      }

      if (e.key === ' ' && gameOver) {
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [running, gameOver, resetGame]);

  useEffect(() => {
    if (!running || gameOver) return;

    gameRef.current = setInterval(() => {
      setSnake(prev => {
        const head = {
          x: prev[0].x + dirRef.current.x,
          y: prev[0].y + dirRef.current.y,
        };

        // Wall collision
        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
          setGameOver(true);
          setRunning(false);
          setHighScore(h => Math.max(h, score));
          return prev;
        }

        // Self collision
        if (prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          setRunning(false);
          setHighScore(h => Math.max(h, score));
          return prev;
        }

        const newSnake = [head, ...prev];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, SPEED);

    return () => clearInterval(gameRef.current);
  }, [running, gameOver, food, score, spawnFood]);

  const styles = {
    wrapper: {
      padding: '16px',
      fontFamily: "'Space Grotesk', sans-serif",
      background: '#1a1a2e',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      width: `${GRID * CELL}px`,
      padding: '8px 0',
    },
    score: {
      fontFamily: "'VT323', monospace",
      fontSize: '22px',
      color: '#00ff88',
    },
    highScore: {
      fontFamily: "'VT323', monospace",
      fontSize: '16px',
      color: '#888',
    },
    board: {
      display: 'grid',
      gridTemplateColumns: `repeat(${GRID}, ${CELL}px)`,
      gridTemplateRows: `repeat(${GRID}, ${CELL}px)`,
      gap: '0',
      border: '2px solid #333',
      background: '#0f3460',
      borderRadius: '4px',
      boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
    },
    cell: (isSnake, isHead, isFood) => ({
      width: `${CELL}px`,
      height: `${CELL}px`,
      background: isHead
        ? '#00ff88'
        : isSnake
        ? '#00cc6a'
        : isFood
        ? '#ff4757'
        : 'transparent',
      borderRadius: isHead ? '4px' : isFood ? '50%' : '2px',
      border: isSnake || isFood ? 'none' : '1px solid rgba(255,255,255,0.03)',
      transition: 'none',
      boxShadow: isHead ? '0 0 8px rgba(0,255,136,0.5)' : isFood ? '0 0 8px rgba(255,71,87,0.5)' : 'none',
    }),
    overlay: {
      position: 'absolute',
      inset: '0',
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      borderRadius: '4px',
    },
    btn: {
      padding: '10px 24px',
      background: '#00ff88',
      color: '#1a1a2e',
      border: 'none',
      borderRadius: '6px',
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
    },
    instructions: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: '11px',
      color: '#666',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.score}>Score: {score}</span>
        <span style={styles.highScore}>Best: {highScore}</span>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={styles.board}>
          {Array(GRID).fill(null).map((_, y) =>
            Array(GRID).fill(null).map((_, x) => {
              const isHead = snake[0].x === x && snake[0].y === y;
              const isSnake = snake.some(s => s.x === x && s.y === y);
              const isFood = food.x === x && food.y === y;
              return (
                <div key={`${x}-${y}`} style={styles.cell(isSnake, isHead, isFood)} />
              );
            })
          )}
        </div>

        {!running && !gameOver && (
          <div style={styles.overlay}>
            <div style={{ color: '#00ff88', fontFamily: "'VT323', monospace", fontSize: '28px' }}>
              SNAKE
            </div>
            <button style={styles.btn} onClick={resetGame}>
              Start Game
            </button>
            <div style={styles.instructions}>
              Arrow keys or WASD to move
            </div>
          </div>
        )}

        {gameOver && (
          <div style={styles.overlay}>
            <div style={{ color: '#ff4757', fontFamily: "'VT323', monospace", fontSize: '24px' }}>
              GAME OVER
            </div>
            <div style={{ color: '#00ff88', fontFamily: "'VT323', monospace", fontSize: '20px' }}>
              Score: {score}
            </div>
            <button style={styles.btn} onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}
      </div>

      <div style={styles.instructions}>
        Use Arrow Keys or WASD to move • Space to restart
      </div>
    </div>
  );
};

export default SnakeContent;
