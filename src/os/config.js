// Everything on the QuanOS desktop that's likely to change lives here.

export const PASSWORD = 'ilovecats';   // compared case/space-insensitively

export const LINKS = {
  github: 'https://github.com/hmyam6090-lab',
  linkedin: 'https://www.linkedin.com/in/quan-hoang-251160383/',
  itchio: 'https://hmyam6090-lab.itch.io/',
};

export const RESUME = {
  file: 'images/Quan_Hoang_Resume.pdf',
  downloadName: 'Quan_Hoang_Resume.pdf',
};

export const LOGIN_PHOTO = 'photos/quan-with-cat.jpg';
export const PREVIEW_PHOTO = { file: 'photos/photo3.jpg', name: 'photo3.jpg' };

// Desktop icons: two columns on the left (ref 3). `open` = window id or link.
export const DESKTOP_ICONS = [
  { id: 'games', label: 'My Games', icon: 'folder', open: 'folder:games', col: 0, row: 0 },
  { id: 'projects', label: 'My Projects', icon: 'folder', open: 'folder:projects', col: 0, row: 1 },
  { id: 'research', label: 'My Research', icon: 'folder', open: 'folder:research', col: 0, row: 2 },
  { id: 'contact', label: 'Contact Me', icon: 'folder', open: 'folder:contact', col: 0, row: 3 },
  { id: 'resume', label: 'Resume.pdf', icon: 'pdf', open: 'resume', col: 1, row: 0 },
  { id: 'github', label: 'GitHub', icon: 'github', link: LINKS.github, col: 1, row: 1 },
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin', link: LINKS.linkedin, col: 1, row: 2 },
  { id: 'itchio', label: 'Itch.io', icon: 'itchio', link: LINKS.itchio, col: 1, row: 3 },
  // bottom-right corner (corner: 'br' → col/row count from the right/bottom edges)
  { id: 'gallery', label: 'Gallery', icon: 'gallery', open: 'gallery', corner: 'br', col: 0, row: 0 },
  { id: 'uppertale', label: 'UpperTale', icon: 'uppertale', open: 'game:uppertale', corner: 'br', col: 0, row: 1 },
  { id: 'craftmine', label: 'CraftMine', icon: 'craftmine', open: 'game:craftmine', corner: 'br', col: 1, row: 0 },
  { id: 'teamfight', label: 'Teamfight Str…', icon: 'teamfight', open: 'game:teamfight', corner: 'br', col: 1, row: 1 },
  { id: 'seleste', label: 'Seleste', icon: 'seleste', open: 'game:seleste', corner: 'br', col: 2, row: 0 },
];

export const FOLDERS = {
  games: { title: 'My Games' },
  projects: { title: 'My Projects' },
  research: { title: 'My Research' },
  contact: { title: 'Contact Me' },
};
