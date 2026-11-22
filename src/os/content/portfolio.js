/*
 * Folder content for QuanOS. Edit freely. Paths are relative to /public.
 *
 * Folder = { title, path, items[] }. Items are shown top-to-bottom as tabs (3 visible).
 *
 * Two kinds of tab:
 *   Year / time marker:  { type: 'year', id, title: '2026', tagline, details }
 *   Project:             { id, title, role, desc (ONE short line), thumb, year?, details }
 *
 * details (right half, scrollable):
 *   { heading?, media?, body: [paragraphs], myRole?, highlights?: [], tags?: [], links?: [{ label, url }] }
 * media (shown on top, never autoplays, sound on):
 *   { type: 'youtube', id: 'VIDEO_ID' }
 *   { type: 'video', src: 'videos/x.mp4', poster?: 'images/x.png' }
 *   { type: 'image', src: 'images/x.png' }   (also for GIFs)
 */

const GAMES = [
  {
    type: 'year',
    id: 'y2026',
    title: '2026',
    tagline: 'Four games, three jams, one big team production',
    details: {
      heading: 'My 2026 in game development',
      media: { type: 'video', src: 'videos/game_demo.mp4' },
      body: [
        '2026 was my busiest year of making games so far. I shipped a climate puzzle game for IndieCade’s Climate Jam (now part of the Climate Solutions Anthology Bundle on Steam), led the gameplay code for a narrative deduction game that placed 75th of ~450 entries at Summer Comfy Jam, and won a 48-hour hackathon with a mirror-world platformer.',
        'Alongside the jams, I was the lead gameplay programmer on Fluidity, a 13-week team production that we playtested with elementary school students.',
      ],
      tags: ['Unity', 'Godot', 'C#', 'GDScript', 'Game jams', 'Team lead'],
    },
  },
  {
    id: 'fluidity',
    title: 'Fluidity',
    role: 'Lead Gameplay Programmer',
    desc: 'Softbody platformer: be solid, liquid or gas.',
    thumb: 'images/fluidity1.png',
    year: 2026,
    details: {
      media: { type: 'youtube', id: 'vgPaHUHjU-Q' },
      body: [
        'A physics-forward educational platformer where players switch between water states — solid, liquid and gas — to solve level puzzles, making science concepts playful while keeping controls readable for younger players.',
      ],
      myRole: 'I led gameplay programming and technical direction: the player-state architecture, puzzle systems, and the team workflow for turning paper designs into shippable mechanics across a 13-week production.',
      highlights: [
        'Solid/liquid/gas state switching with puzzle-aware transition rules',
        'Player controller, progression logic and mechanic onboarding',
        'Weekly Agile/Scrum task scoping and tracking',
        'Iterated on pacing from elementary school playtests',
      ],
      tags: ['Godot 2D', 'GDScript', 'Physics'],
      links: [{ label: 'Project page', url: 'https://fluidity-website.vercel.app/' }],
    },
  },
  {
    id: 'fantasyworld',
    title: 'Fantasy World',
    role: 'Lead Programmer',
    desc: 'Climate click-puzzler for IndieCade Climate Jam.',
    thumb: 'images/it-takes-times-1.png',
    year: 2026,
    details: {
      media: { type: 'youtube', id: '_3gCvnpxCnM' },
      body: [
        'A charming click-based puzzle game inspired by the classic GROW series by On (EYEZMAZE): plant a seed, nurture the world, and discover the perfect order of actions to make everything grow.',
        'Underneath its cute presentation it explores the idea of “Plant a Seed” — how small actions grow into something much bigger — touching on sustainable environments, pollution and how parts of an ecosystem depend on one another.',
      ],
      myRole: 'I led programming across a 5-person Agile team, implementing core gameplay systems including UI, puzzle mechanics, save/load and game management in C#/Unity over 4 sprints.',
      highlights: [
        'Built custom tooling for asset integration and imports',
        'Reduced asset import time by 35% and build size by 50%',
        'Shipped in IndieCade’s Climate Solutions Anthology Bundle on Steam',
      ],
      tags: ['Unity', 'C#', 'Puzzle', 'Climate'],
      links: [{ label: 'Play on itch.io', url: 'https://gaodiaojiaomi-m.itch.io/fantasy-world' }],
    },
  },
  {
    id: 'trustme',
    title: 'Trust Me, I Was There!',
    role: 'Lead Gameplay Programmer & Producer',
    desc: 'Narrative deduction game, 75th of ~450 jam entries.',
    thumb: 'images/tmiwt1.png',
    year: 2026,
    details: {
      media: { type: 'youtube', id: 'SXn_OBy1RS4' },
      body: [
        'A narrative deduction game where you are the editor of a summer camp newspaper. NPCs submit conflicting witness reports, photographs and physical evidence; you cross-reference everything to reconstruct the most plausible version of events before publishing the next day’s paper.',
        'Built for Summer Comfy Jam 2026 — ranked 75th out of approximately 450 submissions.',
      ],
      myRole: 'I designed and implemented the core deduction systems and the player interaction loop, and led a team of 3 (artist, designer, programmer).',
      highlights: [
        'Evidence system for testimonies, photographs and physical objects',
        'Interactive evidence board with draggable cards and support/conflict links',
        'Scoring that measures consistency with the true event, not right/wrong',
        'Day progression from investigation to publication',
      ],
      tags: ['Unity', 'C#', 'Narrative systems'],
      links: [{ label: 'Play on itch.io', url: 'https://hmyam6090-lab.itch.io/trust-me-i-was-there' }],
    },
  },
  {
    id: 'houseofillusions',
    title: 'House of Illusions',
    role: 'Gameplay Programmer',
    desc: 'Hackathon winner: swap real/mirror worlds mid-jump.',
    thumb: 'images/house1.png',
    year: 2026,
    details: {
      media: { type: 'youtube', id: '0NA3VAn1G3o' },
      body: [
        'A fast-paced puzzle platformer built around switching between a Real World and a Mirror World with different traversal rules. Progress depends on precise mid-air transitions and timing under pressure.',
        'Built in 48 hours — and it won the hackathon.',
      ],
      myRole: 'I implemented the dual-world gameplay loop and made the swap mechanic responsive enough for speed-platforming, and helped tune level beats for readability within the jam scope.',
      highlights: [
        'Real/mirror world switching tied to movement physics',
        'Checkpoint + restart flow built for rapid retries',
        'Polished jam build delivered in 48 hours',
      ],
      tags: ['Godot 2D', 'GDScript', 'Game jam'],
      links: [{ label: 'itch.io', url: 'https://hmyam6090-lab.itch.io/' }],
    },
  },
  {
    type: 'year',
    id: 'y2025',
    title: '2025',
    tagline: 'Side projects and prototypes',
    details: {
      heading: 'My 2025 in game development',
      media: { type: 'image', src: 'images/gameplay_bytediep.gif' },
      body: [
        'Side projects where I dug into systems: a class-based arcade shooter in LÖVE2D and a chaotic co-op cooking prototype in Godot 3D.',
      ],
      tags: ['LÖVE2D', 'Lua', 'Godot 3D'],
    },
  },
  {
    id: 'bytediep',
    title: 'BYTEDIEP',
    role: 'Gameplay Programmer',
    desc: 'BYTEPATH remix with diep.io-style classes.',
    thumb: 'images/gameover_bytediep.png',
    year: 2025,
    details: {
      media: { type: 'image', src: 'images/gameplay_bytediep.gif' },
      body: [
        'A class-based arcade shooter inspired by BYTEPATH and diep.io, focused on highly replayable runs and player-driven build theorycrafting through differentiated ship archetypes.',
      ],
      myRole: 'I am designing and implementing the combat sandbox: class progression, stat interactions and run-to-run variety that rewards experimentation over a single optimal build.',
      highlights: [
        'Modular ship class progression and branching playstyles',
        'Data-driven class and stat tables',
        'New classes can be added without touching core combat',
      ],
      tags: ['LÖVE2D', 'Lua', 'Arcade'],
      links: [{ label: 'GitHub repo', url: 'https://github.com/hmyam6090-lab/BYTEDIEP---BYTEPATH-VARIATION' }],
    },
  },
  {
    id: 'beyondcooked',
    title: 'Beyond Cooked',
    role: 'Gameplay Programmer',
    desc: 'Chaotic co-op cooking across hostile dimensions.',
    thumb: 'images/beyond-cooked-1.png',
    year: 2025,
    details: {
      media: { type: 'image', src: 'images/beyond-cooked-2.png' },
      body: [
        'A chaotic co-op cooking game set across dangerous dimensions. Teams gather ingredients in hostile environments and return to the kitchen to complete randomized orders under pressure.',
      ],
      myRole: 'I built the gameplay loop from ingredient retrieval to recipe completion, with emphasis on cooperative chaos and readable hand-offs between players.',
      highlights: [
        'Recipe and order-flow systems for dynamic pacing',
        'Pickup/use interactions for ingredients and kitchen tools',
        'Event-driven interaction architecture for appliances',
      ],
      tags: ['Godot 3D', 'GDScript', 'Co-op'],
      links: [{ label: 'GitHub repo', url: 'https://github.com/hmyam6090-lab/Beyond-Cooked' }],
    },
  },
];

export const FOLDERS_CONTENT = {
  games: { title: 'My Games', path: 'C:\\Quan\\My_Games\\', items: GAMES },
  projects: { title: 'My Projects', path: 'C:\\Quan\\My_Projects\\', items: [] },   // TODO(Quan)
  research: { title: 'My Research', path: 'C:\\Quan\\My_Research\\', items: [] },   // TODO(Quan)
};

export const CONTACTS = {
  blurb: "I'm always open to new projects, creative ideas, or a chance to be part of your vision. Say hi!",
  items: [
    { id: 'email', label: 'Email', value: 'hmyam6090@gmail.com', href: 'mailto:hmyam6090@gmail.com', icon: 'mail', copy: true },
    { id: 'uni', label: 'University email', value: 'qhoang@wesleyan.edu', href: 'mailto:qhoang@wesleyan.edu', icon: 'mail', copy: true },
    { id: 'github', label: 'GitHub', value: 'github.com/hmyam6090-lab', href: 'https://github.com/hmyam6090-lab', icon: 'github' },
    { id: 'linkedin', label: 'LinkedIn', value: 'Quân M. Hoàng', href: 'https://www.linkedin.com/in/qu%C3%A2n-m-ho%C3%A0ng-251160383/', icon: 'linkedin' },
    { id: 'itchio', label: 'Itch.io', value: 'hmyam6090-lab.itch.io', href: 'https://hmyam6090-lab.itch.io/', icon: 'itchio' },
  ],
};
