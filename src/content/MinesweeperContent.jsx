import { useState, useCallback, useEffect, useRef } from 'react';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

const NUMBER_COLORS = {
  1: '#0000FF', 2: '#008000', 3: '#FF0000', 4: '#000080',
  5: '#800000', 6: '#008080', 7: '#000000', 8: '#808080',
};

const createGrid = () => Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
const createBoolGrid = () => Array(ROWS).fill(null).map(() => Array(COLS).fill(false));

const MinesweeperContent = () => {
  const [grid, setGrid] = useState(createGrid);
  const [revealed, setRevealed] = useState(createBoolGrid);
  const [flagged, setFlagged] = useState(createBoolGrid);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [face, setFace] = useState('🙂');
  const timerRef = useRef(null);

  const mineCount = MINES - flagged.flat().filter(Boolean).length;

  useEffect(() => {
    if (started && !gameOver && !won) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, gameOver, won]);

  const placeMines = useCallback((excludeR, excludeC) => {
    const g = createGrid();
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (g[r][c] !== -1 && !(r === excludeR && c === excludeC)) {
        g[r][c] = -1;
        placed++;
      }
    }
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (g[r][c] === -1) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && g[nr][nc] === -1) count++;
          }
        }
        g[r][c] = count;
      }
    }
    return g;
  }, []);

  const flood = useCallback((g, rev, r, c) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (rev[r][c]) return;
    rev[r][c] = true;
    if (g[r][c] === 0) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          flood(g, rev, r + dr, c + dc);
    }
  }, []);

  const checkWin = useCallback((rev) => {
    let unrevealed = 0;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (!rev[r][c]) unrevealed++;
    return unrevealed === MINES;
  }, []);

  const handleClick = (r, c) => {
    if (gameOver || won || flagged[r][c] || revealed[r][c]) return;

    let g = grid;
    if (!started) {
      g = placeMines(r, c);
      setGrid(g);
      setStarted(true);
    }

    if (g[r][c] === -1) {
      // Hit mine
      const rev = grid.map((row, ri) => row.map((_, ci) => g[ri][ci] === -1 ? true : revealed[ri][ci]));
      setRevealed(rev);
      setGameOver(true);
      setFace('💀');
      clearInterval(timerRef.current);
      return;
    }

    const rev = revealed.map(row => [...row]);
    flood(g, rev, r, c);
    setRevealed(rev);

    if (checkWin(rev)) {
      setWon(true);
      setFace('😎');
      clearInterval(timerRef.current);
    }
  };

  const handleRightClick = (e, r, c) => {
    e.preventDefault();
    if (gameOver || won || revealed[r][c]) return;
    const f = flagged.map(row => [...row]);
    f[r][c] = !f[r][c];
    setFlagged(f);
  };

  const reset = () => {
    setGrid(createGrid());
    setRevealed(createBoolGrid());
    setFlagged(createBoolGrid());
    setGameOver(false);
    setWon(false);
    setStarted(false);
    setTime(0);
    setFace('🙂');
    clearInterval(timerRef.current);
  };

  const styles = {
    wrapper: {
      padding: '16px',
      fontFamily: "'Space Grotesk', sans-serif",
      background: '#c0c0c0',
      minHeight: '100%',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 8px',
      background: '#bdbdbd',
      border: '2px inset #999',
      marginBottom: '8px',
    },
    counter: {
      fontFamily: "'VT323', monospace",
      fontSize: '28px',
      color: '#ff0000',
      background: '#000',
      padding: '2px 6px',
      minWidth: '50px',
      textAlign: 'center',
      letterSpacing: '2px',
    },
    faceBtn: {
      fontSize: '24px',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px outset #ddd',
      background: '#c0c0c0',
      cursor: 'pointer',
      borderRadius: '0',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${COLS}, 28px)`,
      gridTemplateRows: `repeat(${ROWS}, 28px)`,
      gap: '0',
      border: '3px inset #999',
      width: 'fit-content',
      margin: '0 auto',
    },
    cell: (isRevealed, isMine, value) => ({
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '700',
      cursor: isRevealed ? 'default' : 'pointer',
      border: isRevealed ? '1px solid #999' : '2px outset #eee',
      background: isRevealed
        ? (isMine ? '#ff4444' : '#d0d0d0')
        : '#c0c0c0',
      color: NUMBER_COLORS[value] || '#000',
      userSelect: 'none',
      fontFamily: "'Space Grotesk', sans-serif",
    }),
    status: {
      textAlign: 'center',
      marginTop: '12px',
      fontWeight: '600',
      fontSize: '14px',
      color: won ? '#008000' : '#cc0000',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div style={styles.counter}>{String(mineCount).padStart(3, '0')}</div>
        <button style={styles.faceBtn} onClick={reset}>{face}</button>
        <div style={styles.counter}>{String(Math.min(time, 999)).padStart(3, '0')}</div>
      </div>

      <div style={styles.grid}>
        {grid.map((row, r) =>
          row.map((val, c) => {
            const isRevealed = revealed[r][c];
            const isFlagged = flagged[r][c];
            const isMine = val === -1;

            let content = '';
            if (isFlagged && !isRevealed) content = '🚩';
            else if (isRevealed && isMine) content = '💣';
            else if (isRevealed && val > 0) content = val;

            return (
              <div
                key={`${r}-${c}`}
                style={styles.cell(isRevealed, isMine && isRevealed, val)}
                onClick={() => handleClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
              >
                {content}
              </div>
            );
          })
        )}
      </div>

      {(gameOver || won) && (
        <div style={styles.status}>
          {won ? '🎉 You Win! All mines cleared!' : '💥 Game Over! Click 🙂 to retry.'}
        </div>
      )}
    </div>
  );
};

export default MinesweeperContent;
