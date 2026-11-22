const COLS = ['#ffd21f', '#ff9a1f', '#5fd23a', '#3ac85a', null, '#ff3b3b', '#ff5fa8', '#5fd23a', '#3aa8ff', '#5a7cff'];

/** Small rainbow "QuanHoang Portfolio" wordmark used in QuanOS chrome. */
export function Logo({ className = '' }) {
  return (
    <span className={`qh-logo ${className}`} aria-label="Quan Hoang Portfolio">
      <span className="qh-word">
        {'Quan Hoang'.split('').map((ch, i) => (
          ch === ' ' ? <span key={i} className="qh-gap" /> : <span key={i} style={{ color: COLS[i] }}>{ch}</span>
        ))}
      </span>
      <span className="qh-sub">Portfolio</span>
    </span>
  );
}
