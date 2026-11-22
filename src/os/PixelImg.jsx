import { useEffect, useState } from 'react';

/** Image rendered through a tiny canvas and scaled back up with hard pixels,
 *  so photos match the picoCAD look. `pixels` = width of the downsampled image. */
export default function PixelImg({ src, alt, pixels = 72, className = '', ...rest }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.onload = () => {
      if (!alive) return;
      const h = Math.max(1, Math.round((pixels * img.naturalHeight) / img.naturalWidth));
      const c = document.createElement('canvas');
      c.width = pixels; c.height = h;
      const g = c.getContext('2d');
      g.imageSmoothingQuality = 'high';
      g.drawImage(img, 0, 0, pixels, h);
      setUrl(c.toDataURL());
    };
    img.src = src;
    return () => { alive = false; };
  }, [src, pixels]);

  return (
    <img
      src={url || src}
      alt={alt}
      className={`pixel-img ${className}`}
      style={{ imageRendering: 'pixelated' }}
      draggable={false}
      {...rest}
    />
  );
}
