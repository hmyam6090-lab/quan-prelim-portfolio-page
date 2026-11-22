// Desktop icons (SVG data URIs). Folder/pdf/brand marks adapted from the old XP site.
const svg = (s) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">${s}</svg>`)}`;

export const ICONS = {
  folder: svg(`
    <path d="M4 14V10h20l5 5h31v4H4z" fill="#2f86c8"/>
    <path d="M4 16h56v38H4z" fill="#4fa6e0"/>
    <path d="M4 16h56v4H4z" fill="#8fd0ff"/>
    <path d="M4 50h56v4H4z" fill="#2f86c8"/>`),
  pdf: svg(`
    <path d="M12 4h28l12 12v44H12z" fill="#fff"/>
    <path d="M40 4v12h12" fill="#d8d8d8"/>
    <path d="M12 4h28v2H12zM12 58h40v2H12zM10 4h2v56h-2zM52 16h2v44h-2z" fill="#9a9a9a"/>
    <rect x="16" y="28" width="30" height="3" fill="#cfcfcf"/>
    <rect x="16" y="35" width="24" height="3" fill="#cfcfcf"/>
    <rect x="16" y="42" width="28" height="3" fill="#cfcfcf"/>
    <rect x="14" y="13" width="22" height="10" fill="#e53935"/>
    <text x="16.5" y="21.5" font-size="8" font-family="monospace" font-weight="bold" fill="#fff">PDF</text>`),
  github: svg(`
    <circle cx="32" cy="32" r="28" fill="#1b1f24" shape-rendering="auto"/>
    <path shape-rendering="auto" d="M32 12C21 12 12 21 12 32c0 8.8 5.7 16.3 13.6 19 1 .2 1.4-.4 1.4-1v-3.5c-5.5 1.2-6.7-2.7-6.7-2.7-.9-2.3-2.2-2.9-2.2-2.9-1.8-1.2.1-1.2.1-1.2 2 .1 3 2 3 2 1.8 3 4.6 2.1 5.7 1.6.2-1.3.7-2.1 1.3-2.6-4.4-.5-9-2.2-9-9.8 0-2.2.8-3.9 2-5.3-.2-.5-.9-2.5.2-5.2 0 0 1.6-.5 5.4 2a18.7 18.7 0 0110 0c3.7-2.5 5.3-2 5.3-2 1.1 2.7.4 4.7.2 5.2 1.3 1.4 2 3.1 2 5.3 0 7.6-4.6 9.3-9 9.8.7.6 1.3 1.8 1.3 3.7v5.5c0 .6.3 1.2 1.4 1C46.3 48.3 52 40.8 52 32c0-11-9-20-20-20z" fill="#fff"/>`),
  linkedin: svg(`
    <rect x="4" y="4" width="56" height="56" rx="6" fill="#0a66c2"/>
    <path d="M17 27h7v19h-7zM20.5 15a4 4 0 110 8 4 4 0 010-8zM29 27h6.5v2.8c1-1.8 3.2-3.3 6.6-3.3 6.8 0 8 4.4 8 10.2V46h-7v-8.6c0-2.4-.6-4.4-3.3-4.4-2.8 0-3.8 2-3.8 4.5V46H29z" fill="#fff" shape-rendering="auto"/>`),
  itchio: svg(`
    <rect x="4" y="6" width="56" height="52" rx="6" fill="#fa5c5c"/>
    <path d="M10 14h44l4 8H6z" fill="#fff"/>
    <path d="M6 22h52v6H6z" fill="#ffd2d2"/>
    <rect x="12" y="32" width="40" height="20" fill="#fff"/>
    <rect x="20" y="36" width="10" height="10" fill="#fa5c5c"/>
    <rect x="34" y="36" width="12" height="6" fill="#ffb3b3"/>`),
  notepad: svg(`
    <rect x="12" y="8" width="40" height="50" fill="#fffdf5"/>
    <rect x="12" y="8" width="40" height="8" fill="#4fa6e0"/>
    <rect x="18" y="24" width="28" height="3" fill="#8a8a8a"/>
    <rect x="18" y="32" width="22" height="3" fill="#8a8a8a"/>
    <rect x="18" y="40" width="26" height="3" fill="#8a8a8a"/>`),
  image: svg(`
    <rect x="6" y="10" width="52" height="44" fill="#fff"/>
    <rect x="10" y="14" width="44" height="32" fill="#bfe3ff"/>
    <path d="M10 46l12-14 10 10 8-8 14 12z" fill="#5fb35a"/>
    <rect x="40" y="18" width="8" height="8" fill="#ffd21f"/>`),
  logo: svg(`
    <rect x="8" y="8" width="22" height="22" fill="#ff3b3b"/>
    <rect x="34" y="8" width="22" height="22" fill="#5fd23a"/>
    <rect x="8" y="34" width="22" height="22" fill="#3aa8ff"/>
    <rect x="34" y="34" width="22" height="22" fill="#ffd21f"/>`),
};
