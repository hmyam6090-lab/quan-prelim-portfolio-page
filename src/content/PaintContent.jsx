import { useState, useRef, useEffect, useCallback } from 'react';

const COLORS = ['#000000', '#FF0000', '#FF8800', '#FFDD00', '#00CC44', '#0088FF', '#8800FF', '#FF44AA', '#FFFFFF'];
const BRUSH_SIZES = [2, 5, 10, 18, 30];

const PaintContent = () => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('brush'); // 'brush' | 'eraser' | 'fill'
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef(null);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const drawLine = (from, to) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const handleMouseDown = (e) => {
    if (tool === 'fill') {
      floodFill(e);
      return;
    }
    setIsDrawing(true);
    const pos = getPos(e);
    lastPos.current = pos;
    // Draw dot at start
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    if (lastPos.current) {
      drawLine(lastPos.current, pos);
    }
    lastPos.current = pos;
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const floodFill = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    const x = Math.floor(pos.x);
    const y = Math.floor(pos.y);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const targetIdx = (y * canvas.width + x) * 4;
    const targetR = data[targetIdx];
    const targetG = data[targetIdx + 1];
    const targetB = data[targetIdx + 2];

    // Parse fill color
    const fillHex = color;
    const fillR = parseInt(fillHex.slice(1, 3), 16);
    const fillG = parseInt(fillHex.slice(3, 5), 16);
    const fillB = parseInt(fillHex.slice(5, 7), 16);

    if (targetR === fillR && targetG === fillG && targetB === fillB) return;

    const stack = [[x, y]];
    const visited = new Set();

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      if (cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height) continue;
      const key = `${cx},${cy}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const idx = (cy * canvas.width + cx) * 4;
      if (Math.abs(data[idx] - targetR) > 10 ||
          Math.abs(data[idx + 1] - targetG) > 10 ||
          Math.abs(data[idx + 2] - targetB) > 10) continue;

      data[idx] = fillR;
      data[idx + 1] = fillG;
      data[idx + 2] = fillB;
      data[idx + 3] = 255;

      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const clearCanvas = () => {
    initCanvas();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'my-painting.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const styles = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: "'Space Grotesk', sans-serif",
      background: '#e8e8e8',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      background: '#f0f0f0',
      borderBottom: '1px solid #ccc',
      flexWrap: 'wrap',
    },
    toolSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '0 8px',
      borderRight: '1px solid #ddd',
    },
    toolBtn: (active) => ({
      padding: '6px 10px',
      background: active ? '#4A90D9' : '#fff',
      color: active ? '#fff' : '#333',
      border: '1px solid #bbb',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: active ? '600' : '400',
      fontFamily: "'Space Grotesk', sans-serif",
      transition: 'all 0.15s',
    }),
    colorSwatch: (c, active) => ({
      width: '22px',
      height: '22px',
      background: c,
      border: active ? '2px solid #4A90D9' : '1px solid #999',
      borderRadius: '3px',
      cursor: 'pointer',
      boxShadow: active ? '0 0 0 2px rgba(74,144,217,0.3)' : 'none',
      transition: 'all 0.15s',
    }),
    sizeBtn: (s, active) => ({
      width: '28px',
      height: '28px',
      background: active ? '#eef4ff' : '#fff',
      border: active ? '2px solid #4A90D9' : '1px solid #bbb',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    sizeDot: (s) => ({
      width: `${Math.min(s, 18)}px`,
      height: `${Math.min(s, 18)}px`,
      background: '#333',
      borderRadius: '50%',
    }),
    canvasArea: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      overflow: 'hidden',
      background: '#ccc',
    },
    canvas: {
      background: '#fff',
      cursor: tool === 'fill' ? 'crosshair' : 'crosshair',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      maxWidth: '100%',
      maxHeight: '100%',
    },
    actionBtn: {
      padding: '6px 12px',
      background: '#fff',
      border: '1px solid #bbb',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px',
      fontFamily: "'Space Grotesk', sans-serif",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.toolbar}>
        {/* Tools */}
        <div style={styles.toolSection}>
          <button style={styles.toolBtn(tool === 'brush')} onClick={() => setTool('brush')}>
            ✏️ Brush
          </button>
          <button style={styles.toolBtn(tool === 'eraser')} onClick={() => setTool('eraser')}>
            🧹 Eraser
          </button>
          <button style={styles.toolBtn(tool === 'fill')} onClick={() => setTool('fill')}>
            🪣 Fill
          </button>
        </div>

        {/* Colors */}
        <div style={styles.toolSection}>
          {COLORS.map(c => (
            <div
              key={c}
              style={styles.colorSwatch(c, color === c)}
              onClick={() => { setColor(c); setTool('brush'); }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => { setColor(e.target.value); setTool('brush'); }}
            style={{ width: '22px', height: '22px', border: 'none', padding: 0, cursor: 'pointer' }}
          />
        </div>

        {/* Brush sizes */}
        <div style={styles.toolSection}>
          {BRUSH_SIZES.map(s => (
            <div
              key={s}
              style={styles.sizeBtn(s, brushSize === s)}
              onClick={() => setBrushSize(s)}
            >
              <div style={styles.sizeDot(s)} />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button style={styles.actionBtn} onClick={clearCanvas}>🗑 Clear</button>
          <button style={styles.actionBtn} onClick={downloadCanvas}>💾 Save</button>
        </div>
      </div>

      <div style={styles.canvasArea}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          style={styles.canvas}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  );
};

export default PaintContent;
