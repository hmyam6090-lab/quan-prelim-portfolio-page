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
 *   { heading?, media?, body: [paragraph | { image, caption? }], myRole?, highlights?: [], tags?: [], links?: [{ label, url }] }
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
        'Alongside the jams, I led programming on Fluidity, which won 1st place at the IDEA350 Game Jam and which we released at MacDonough Primary School to teach 100+ children about the water cycle.',
      ],
      tags: ['Unity', 'Godot', 'C#', 'GDScript', 'Game jams', 'Team lead'],
    },
  },
  {
    id: 'fluidity',
    title: 'Fluidity',
    role: 'Lead Gameplay Programmer',
    desc: '1st place, IDEA350 Game Jam: be solid, liquid or gas.',
    thumb: 'images/games/fluidity-poster.webp',
    year: 2026,
    details: {
      media: { type: 'youtube', id: 'vgPaHUHjU-Q' },
      body: [
        'A 2D educational platformer about the water cycle: players switch between water’s states — solid, liquid and gas — to solve puzzle levels, making science playful while keeping controls readable for younger players. It took 1st place at the IDEA350 Game Jam.',
        { image: 'images/games/fluidity-team.jpg', caption: 'The Fluidity team with our level art.' },
        'We released Fluidity at a carnival at MacDonough Primary School, where we used the game to teach the children about the water cycle — 100+ students played through it.',
        { image: 'images/games/fluidity-kids.jpg', caption: 'MacDonough students learning the water cycle with Fluidity.' },
      ],
      myRole: 'I led programming on a 5-person Agile team: the player-state architecture, puzzle systems, and internal Godot tooling for asset integration and gameplay tuning, so our designers and artists could iterate in-engine.',
      highlights: [
        'Solid/liquid/gas state switching with puzzle-aware transition rules',
        'Internal Godot tools for asset integration and gameplay tuning',
        'Player controller, progression logic and mechanic onboarding',
        'Weekly Agile/Scrum task scoping and tracking',
      ],
      tags: ['Godot 2D', 'GDScript', 'Quark Physics', 'Education'],
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

const RESEARCH = [
  {
    type: 'year',
    id: 'r2026',
    title: '2026',
    tagline: 'Animal tracking and soft robotics',
    details: {
      heading: 'My 2026 in research',
      body: [
        'This year I worked in two labs. At the McKenzie-Smith Lab I build tooling that turns terabytes of multi-animal video into reliable tracks, which became ModularNAPS.',
        'In Prof. Sonia Roberts’ Soft Robotics Lab I help with the firmware and robot-control side of a capacitive sensing sleeve.',
      ],
      tags: ['Python', 'Computer vision', 'HPC', 'C++', 'Arduino', 'ROS 2'],
    },
  },
  {
    id: 'modularnaps',
    title: 'ModularNAPS',
    role: 'Research Assistant · McKenzie-Smith Lab',
    desc: 'Keeping every animal’s track on the same animal.',
    thumb: 'images/research/modularnaps.jpg',
    year: 2026,
    details: {
      media: { type: 'video', src: 'videos/research/modularnaps.mp4' },
      body: [
        'ModularNAPS is a set of command-line tools for multi-animal SLEAP tracking data, built in Prof. McKenzie-Smith’s lab. Its main job is making sure each track follows the same animal for the whole video: it corrects SLEAP’s identity swaps using idtrackerai, then checks the result independently by looking at how each animal walks.',
        'It also ships simple tools for plotting paths and speeds, plus a documented tutorial on a two-bee example, how-to guides, a full command reference and a Python API.',
      ],
      myRole: 'I spearheaded the Python data pipeline (ffmpeg, NumPy, scikit-learn) that automates fruit fly species identification and interaction detection across terabytes of tracking and imaging data, and run the processing workflows on Wesleyan’s High-Performance Computing Cluster (HPCC).',
      highlights: [
        'Cut pipeline runtime by 78%',
        'Improved classification accuracy by 15% by integrating idtrackerai with a novel locomotion-based tracking method',
        'mod-naps-correct: rebuilds a SLEAP file so each track is one idtrackerai identity',
        'mod-naps-locomotion: checks every close encounter for identity swaps using how each animal walks',
        'mod-naps-interactions / -visualize / -velocity: interaction frames, path plots and speed plots',
      ],
      tags: ['Python', 'SLEAP', 'idtrackerai', 'NumPy', 'scikit-learn', 'ffmpeg', 'HPC'],
    },
  },
  {
    id: 'sensingsleeve',
    title: 'Capacitive Sensing Sleeve',
    role: 'Research Assistant · Soft Robotics Lab',
    desc: 'Textile capacitive sensors for a robot sleeve.',
    thumb: 'images/research/sleeve-swatch.png',
    year: 2026,
    details: {
      media: { type: 'image', src: 'images/research/sleeve-swatch.png' },
      body: [
        'Under Prof. Sonia Roberts, I work on the lab’s capacitive sensing sleeve project: textile swatches act as sensing electrodes, read by FDC1004 capacitance-to-digital boards and fed to an Arduino Mega through I²C multiplexers.',
        { image: 'images/research/fdc1004-board.webp', caption: 'One of the FDC1004 sensor boards.' },
        { image: 'images/research/sleeve-wiring.webp', caption: 'Wiring: Arduino Mega → PCA9548A I²C multiplexers → FDC1004 boards → textile electrode.' },
      ],
      myRole: 'I helped develop the C++ firmware for the Arduino Mega 2560 that talks to the FDC1004 capacitive sensors through I²C multiplexers, and helped build the Python workflows for sensor communication and xArm6 robot-arm control with ROS 2 and RViz2.',
      highlights: [
        'Helped write C++ firmware for FDC1004 sensors behind I²C multiplexers',
        'Python sensor-communication pipeline',
        'xArm6 control integrated with ROS 2 and visualised in RViz2',
      ],
      tags: ['C++', 'Arduino Mega 2560', 'I²C', 'FDC1004', 'Python', 'ROS 2', 'RViz2', 'xArm6'],
    },
  },
];

const PROJECTS = [
  {
    type: 'year',
    id: 'p2026',
    title: '2026',
    tagline: 'Teaching game development',
    details: {
      heading: 'My 2026 in projects & teaching',
      body: [
        'This year I started teaching game development: as a student leader running a student forum on video game design and development, and as a TA for IDEA350: Video Game Development.',
      ],
      tags: ['Teaching', 'Game dev', 'Unity', 'Godot'],
    },
  },
  {
    id: 'idea350ta',
    title: 'IDEA350: Video Game Development',
    role: 'Teaching Assistant',
    desc: 'TA for Prof. Christopher Weaver’s game dev course.',
    thumb: 'images/projects/idea350-ta-booth.jpg',
    year: 2026,
    details: {
      media: { type: 'image', src: 'images/projects/idea350-ta-booth.jpg' },
      body: [
        'Since May 2026 I have been a teaching assistant for IDEA350: Video Game Development, a 300-level course taught by Professor Christopher Weaver — founder of Bethesda Softworks, Distinguished Professor of Computer Science and Computational Media at Wesleyan University, and Director of the Smithsonian Videogame Pioneers Initiative.',
      ],
      myRole: 'I help teach the course and mentor students in game programming and development workflows across Unity, Godot, C# and GDScript.',
      tags: ['Teaching', 'Unity', 'Godot', 'C#', 'GDScript'],
    },
  },
  {
    id: 'gamedevforum',
    title: 'Intro to Video Game Design & Development',
    role: 'Student Forum Leader',
    desc: 'Taught a student forum that ended in a game jam.',
    thumb: 'images/projects/idea419-showreel.jpg',
    year: 2026,
    details: {
      media: { type: 'video', src: 'videos/projects/idea419-gamejam-showreel.mp4' },
      body: [
        'As a student leader, I taught a student forum on Introduction to Video Game Design and Development, taking classmates from their first game concepts to finished games.',
        'The forum wrapped up with a game jam — the showreel above shows what the students built.',
      ],
      tags: ['Teaching', 'Game design', 'Game jam'],
    },
  },
  {
    id: 'typerexe',
    title: 'TYPER.EXE',
    role: 'Developer',
    desc: 'Roguelite typing game made in L5 for a jam.',
    thumb: 'images/projects/typerexe.jpg',
    year: 2026,
    details: {
      media: { type: 'video', src: 'videos/projects/typerexe.mp4' },
      body: ['A roguelite typing game built for a game jam in L5, the Lua take on Processing-style creative coding.'],
      tags: ['L5', 'Lua', 'Game jam', 'Roguelite'],
      links: [{ label: 'GitHub repo', url: 'https://github.com/hmyam6090-lab/L5-Typing-Rougelite' }],
    },
  },
  {
    type: 'year',
    id: 'p2025',
    title: '2025',
    tagline: 'Robots and creative coding',
    details: {
      heading: 'My 2025 in projects',
      body: [
        'A year of building things: an eldritch walking robot and a pulley rig in IDEA170: Introduction to Mechanical Engineering & Design, and a pile of creative coding sketches in Processing.',
      ],
      tags: ['Mechanical design', 'Arduino', 'Processing'],
    },
  },
  {
    id: 'idea170',
    title: 'The Eldritch Walker',
    role: 'IDEA170 · Intro to Mechanical Eng. & Design',
    desc: 'A weird, eldritch-horror walking robot.',
    thumb: 'images/projects/idea170-walker.webp',
    year: 2025,
    details: {
      media: { type: 'video', src: 'videos/projects/idea170-walker.mp4' },
      body: [
        'For IDEA170: Introduction to Mechanical Engineering & Design, my team built a walking robot that came out… slightly eldritch. Two geared DC motors in 3D-printed mounts, driven by an Arduino with a motor shield, crank wooden linkage legs into an unsettling shuffle.',
        { image: 'images/projects/idea170-walker.webp', caption: 'The walker’s guts: Arduino + motor shield, geared motors, 3D-printed mounts.' },
        'We also designed and built a pulley rig in the same class.',
        { image: 'images/projects/idea170-pulley-team.webp', caption: 'The team with our pulley.' },
      ],
      tags: ['Arduino', 'Motor shield', '3D printing', 'Mechanisms', 'Teamwork'],
    },
  },
  {
    id: 'flappyvolume',
    title: 'Flappy Bird As A Volume Control',
    role: 'Creative coding',
    desc: 'The worst possible volume slider, on purpose.',
    thumb: 'images/projects/flappybird.png',
    year: 2025,
    details: {
      media: { type: 'video', src: 'videos/projects/flappybird.mp4', poster: 'images/projects/flappybird.png' },
      body: ['A bad-UI experiment: a Flappy Bird game that doubles as a volume control, built with the Fisica 2D physics engine and Processing Sound.'],
      tags: ['Processing', 'Fisica', 'Processing Sound'],
      links: [{ label: 'Play on itch.io', url: 'https://hmyam6090-lab.itch.io/flappy-bird-as-a-volume-control' }],
    },
  },
  {
    id: 'sequencer',
    title: 'Physics-Based Sequencer',
    role: 'Creative coding',
    desc: 'Music made by things bumping into things.',
    thumb: 'images/projects/sequencer.jpg',
    year: 2025,
    details: {
      media: { type: 'video', src: 'videos/projects/sequencer.mp4' },
      body: ['A music sequencer driven by physics: collisions in a Fisica 2D simulation trigger sounds through Processing Sound.'],
      tags: ['Processing', 'Fisica', 'Processing Sound'],
      links: [{ label: 'GitHub', url: 'https://github.com/hmyam6090-lab' }],
    },
  },
  {
    id: 'pvz',
    title: 'Plants vs. Zombies Level Remake?',
    role: 'Creative coding',
    desc: 'A PvZ level rebuilt with a custom collision engine.',
    thumb: 'images/projects/pvz.jpg',
    year: 2025,
    details: {
      media: { type: 'video', src: 'videos/projects/pvz.mp4' },
      body: ['A small Plants vs. Zombies level remake in Java Processing, with my own collision engine and Processing Sound.'],
      tags: ['Processing', 'Java', 'Custom collision engine'],
      links: [{ label: 'GitHub repo', url: 'https://github.com/hmyam6090-lab/Small-PvZ-Remake-In-Java-Processing' }],
    },
  },
  {
    id: 'voxel',
    title: '3D Voxel Drawing App',
    role: 'Creative coding',
    desc: 'A 3D sandbox for drawing with voxels.',
    thumb: 'images/projects/voxel.png',
    year: 2025,
    details: {
      media: { type: 'video', src: 'videos/projects/voxel.mp4', poster: 'images/projects/voxel.png' },
      body: ['A 3D sandbox drawing app in Java Processing: build scenes voxel by voxel.'],
      tags: ['Processing', 'Java', '3D'],
      links: [{ label: 'GitHub repo', url: 'https://github.com/hmyam6090-lab/3D-Sandbox-Drawing-App-Java-Processing' }],
    },
  },
  {
    id: 'snowball',
    title: 'Untitled Snowball Game',
    role: 'Creative coding',
    desc: 'A snowy little jam game in Processing.',
    thumb: 'images/projects/snowball.jpg',
    year: 2025,
    details: {
      media: { type: 'video', src: 'videos/projects/snowball.mp4' },
      body: ['A small game-jam game made in Processing.'],
      tags: ['Processing', 'Game jam'],
      links: [{ label: 'Play on itch.io', url: 'https://hmyam6090-lab.itch.io/untitled-snow-ball-game' }],
    },
  },
];

export const FOLDERS_CONTENT = {
  games: { title: 'My Games', path: 'C:\\Quan\\My_Games\\', items: GAMES },
  projects: { title: 'My Projects', path: 'C:\\Quan\\My_Projects\\', items: PROJECTS },
  research: { title: 'My Research', path: 'C:\\Quan\\My_Research\\', items: RESEARCH },
};

export const CONTACTS = {
  blurb: "I'm always open to new projects, creative ideas, or a chance to be part of your vision. Say hi!",
  items: [
    { id: 'email', label: 'Email', value: 'hmyam6090@gmail.com', href: 'mailto:hmyam6090@gmail.com', icon: 'mail', copy: true },
    { id: 'uni', label: 'University email', value: 'qhoang@wesleyan.edu', href: 'mailto:qhoang@wesleyan.edu', icon: 'mail', copy: true },
    { id: 'github', label: 'GitHub', value: 'github.com/hmyam6090-lab', href: 'https://github.com/hmyam6090-lab', icon: 'github' },
    { id: 'linkedin', label: 'LinkedIn', value: 'Quân M. Hoàng', href: 'https://www.linkedin.com/in/quan-hoang-251160383/', icon: 'linkedin' },
    { id: 'itchio', label: 'Itch.io', value: 'hmyam6090-lab.itch.io', href: 'https://hmyam6090-lab.itch.io/', icon: 'itchio' },
  ],
};
