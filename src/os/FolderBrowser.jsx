import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { playSound } from '../game/sound';
import { FOLDERS_CONTENT } from './content/portfolio';
import { ICONS } from './icons';

const BASE = import.meta.env.BASE_URL;
const VISIBLE_TABS = 3;      // tabs visible at once in the locked scroller
const LOAD_MS = 260;         // quick "loading" between tabs

/** Media shown on top of the detail pane. Never autoplays; sound is on by default. */
function Media({ media, title }) {
  if (!media) return null;
  if (media.type === 'youtube') {
    return (
      <div className="fd-media">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${media.id}?rel=0&modestbranding=1`}
          title={`${title} video`}
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }
  if (media.type === 'video') {
    return (
      <div className="fd-media">
        {/* "#t=0.5" makes the browser show a real frame as the thumbnail when there's no poster */}
        <video
          src={`${BASE}${media.src}${media.poster ? '' : '#t=0.5'}`}
          poster={media.poster ? BASE + media.poster : undefined}
          controls
          preload="metadata"
          playsInline
        />
      </div>
    );
  }
  return (
    <div className="fd-media">
      <img src={BASE + media.src} alt={`${title} screenshot`} draggable={false} />
    </div>
  );
}

function Detail({ item }) {
  const d = item.details || {};
  const isYear = item.type === 'year';
  return (
    <article className="fd">
      <Media media={d.media} title={item.title} />
      <header className="fd-head">
        <h2>{d.heading || item.title}</h2>
        {!isYear && <div className="fd-sub">{item.role}{item.year ? ` · ${item.year}` : ''}</div>}
      </header>
      {d.links?.length > 0 && (
        <div className="fd-links">
          {d.links.map((l) => (
            <a key={l.url} className="os-btn primary" href={l.url} target="_blank" rel="noopener noreferrer"
              onClick={() => playSound('click')}>
              {l.label} ↗
            </a>
          ))}
        </div>
      )}
      {d.tags?.length > 0 && <div className="fd-tags">{d.tags.map((t) => <span key={t}>{t}</span>)}</div>}
      {(d.body || []).map((p, i) => <p key={i} className="fd-p">{p}</p>)}
      {d.myRole && (
        <>
          <h3>My role</h3>
          <p className="fd-p">{d.myRole}</p>
        </>
      )}
      {d.highlights?.length > 0 && (
        <>
          <h3>Highlights</h3>
          <ul className="fd-list">{d.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        </>
      )}
    </article>
  );
}

/** Full-screen folder: locked tab scroller (left) + scrollable detail pane (right). Ref 15. */
export default function FolderBrowser({ folderId, onBack }) {
  const data = FOLDERS_CONTENT[folderId];
  const items = data.items;
  const [sel, setSel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [listH, setListH] = useState(600);
  const root = useRef(null);
  const list = useRef(null);
  const detail = useRef(null);
  const lastWheel = useRef(0);

  useEffect(() => { root.current?.focus({ preventScroll: true }); }, []);
  useLayoutEffect(() => { if (list.current) setListH(list.current.offsetHeight); }, []);

  const select = useCallback((n) => {
    const next = Math.max(0, Math.min(items.length - 1, n));
    setSel((cur) => {
      if (next === cur) return cur;
      playSound('hover');
      setLoading(true);
      return next;
    });
  }, [items.length]);

  useEffect(() => {
    if (!loading) return undefined;
    const t = setTimeout(() => setLoading(false), LOAD_MS);
    if (detail.current) detail.current.scrollTop = 0;
    return () => clearTimeout(t);
  }, [loading, sel]);

  const onWheel = (e) => {
    const now = performance.now();
    if (now - lastWheel.current < 260 || Math.abs(e.deltaY) < 4) return;
    lastWheel.current = now;
    select(sel + (e.deltaY > 0 ? 1 : -1));
  };
  const onKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); select(sel + 1); }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); select(sel - 1); }
    if (e.key === 'Escape') { e.stopPropagation(); onBack(); }
  };

  const slot = listH / VISIBLE_TABS;
  const offset = listH / 2 - slot / 2 - sel * slot;
  const current = items[sel];
  const pos = String(sel + 1).padStart(2, '0');
  const total = String(items.length).padStart(2, '0');

  return (
    <div className="fb" ref={root} tabIndex={0} onKeyDown={onKey}>
      <div className="fb-nav">
        <button className="fb-back" onClick={() => { playSound('click'); onBack(); }}>
          <span aria-hidden>◀</span> Back to Desktop
        </button>
        <span className="fb-addr">{data.path}{current && current.type !== 'year' ? current.title.replace(/[^\w]+/g, '_') : ''}</span>
        <span className="fb-count">{items.length ? `${pos} / ${total}` : '00 / 00'}</span>
      </div>

      <div className="fb-body">
        <div className="fb-list" ref={list} onWheel={onWheel}>
          {items.length === 0 ? (
            <div className="fb-empty">
              <img src={ICONS.folder} alt="" />
              <p>This folder is still being organised.</p>
              <p className="dim">Check back soon!</p>
            </div>
          ) : (
            <div className="fb-track" style={{ transform: `translateY(${offset}px)` }}>
              {items.map((it, i) => (
                <button
                  key={it.id}
                  className={`fb-tab ${it.type === 'year' ? 'year' : ''} ${i === sel ? 'on' : ''}`}
                  style={{ height: slot - 14 }}
                  onClick={() => select(i)}
                  tabIndex={-1}
                >
                  {it.type === 'year' ? (
                    <>
                      <span className="fb-year">{it.title}</span>
                      <span className="fb-tagline">{it.tagline}</span>
                    </>
                  ) : (
                    <>
                      <img className="fb-thumb" src={BASE + it.thumb} alt="" draggable={false} />
                      <span className="fb-text">
                        <span className="fb-title">{it.title}</span>
                        <span className="fb-role">{it.role}</span>
                        <span className="fb-desc">{it.desc}</span>
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
          {items.length > 1 && (
            <div className="fb-arrows">
              <button onClick={() => select(sel - 1)} disabled={sel === 0} aria-label="Previous">▲</button>
              <button onClick={() => select(sel + 1)} disabled={sel === items.length - 1} aria-label="Next">▼</button>
            </div>
          )}
        </div>

        <div className="fb-detail" ref={detail}>
          {!current ? (
            <div className="fb-empty"><p className="dim">Nothing to show yet.</p></div>
          ) : loading ? (
            <div className="fb-loading">
              <span>LOADING {current.title.toUpperCase()}</span>
              <div className="fb-loadbar"><div style={{ animationDuration: `${LOAD_MS}ms` }} /></div>
            </div>
          ) : (
            <Detail key={current.id} item={current} />
          )}
        </div>
      </div>
    </div>
  );
}
