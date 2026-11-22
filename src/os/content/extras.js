/*
 * Fun desktop extras. Edit freely. Image paths are relative to /public.
 *
 * GAMES: the botched "favourite games" icons in the bottom-right of the QuanOS desktop.
 * GALLERY: just drop images in public/photos (or anywhere in /public) and add a line here.
 */

export const FAKE_GAMES = {
  craftmine: {
    name: 'CraftMine',
    exe: 'CraftMine.exe',
    lines: ['Generating world… 0%', '…still 0%.', 'Please punch a tree to continue.'],
    button: 'Punch tree',
  },
  teamfight: {
    name: 'Teamfight Strategies',
    exe: 'TeamfightStrategies.exe',
    lines: ['Finding match…', 'Your little legend is lost in the carousel.', 'Estimated wait: one more game.'],
    button: 'One more game',
  },
  uppertale: {
    name: 'UpperTale',
    exe: 'UpperTale.exe',
    lines: ['* The heart is upside down.', '* Somehow, that feels right.', '* You are filled with mild confusion.'],
    button: '* SPARE',
  },
  seleste: {
    name: 'Seleste',
    exe: 'Seleste.exe',
    lines: ['Climbing the mountain…', 'Strawberries collected: 0', 'Deaths: yes.'],
    button: 'Dash',
  },
};

export const GALLERY = [
  { src: 'photos/quan-with-cat.jpg', title: 'Me + cat', desc: 'Exhibit A: why the password is what it is.' },
  { src: 'photos/photo3.jpg', title: 'Blep', desc: 'Peak cat behaviour.' },
  { src: 'photos/photo1.jpg', title: 'Nap time', desc: 'Professional napper on the job.' },
  { src: 'photos/photo5.jpg', title: 'Window watch', desc: 'Guarding the house from birds since forever.' },
  { src: 'photos/photo4.jpg', title: 'Rage', desc: 'Me when the build fails at 2am.' },
  { src: 'photos/photo7.jpg', title: 'Snack bowl', desc: 'Small cat, big appetite.' },
  { src: 'photos/photo8.jpg', title: 'Well actually', desc: 'Code review energy.' },
  { src: 'photos/photo9.jpg', title: 'Consequences', desc: 'Pushing to main on a Friday.' },
  { src: 'photos/photo6.jpg', title: 'Void', desc: 'A black cat, staring into your soul.' },
];
