# 🪟 Quan's Windows XP Portfolio

A nostalgic yet modern portfolio website built with React and Vite, featuring the iconic Windows XP aesthetic combined with beautiful, aesthetic typography.

![Portfolio Preview](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

### Windows XP Aesthetics

- 🎨 Classic Windows XP blue gradient desktop background
- 🪟 Fully functional draggable windows with authentic window chrome
- 📍 Desktop icons with hover effects
- 🎯 Working taskbar with Start button and system tray
- ⏰ Live clock display
- 🖱️ Interactive Start menu

### Modern Typography

- **Space Grotesk** - Clean, modern headings and UI elements
- **DM Serif Display** - Elegant serif font for titles
- **Inter** - Highly readable body text

### Interactive Features

- ✨ Drag windows around the desktop
- 🔲 Minimize, maximize, and close windows
- 📊 Real-time taskbar management
- 🎯 Window focus management with z-index
- 📱 Responsive design for mobile devices
- ⌨️ Smooth animations and transitions

### Portfolio Sections

- **About Me** - Personal introduction and bio
- **Projects** - Showcase of featured projects with tech stack tags
- **Skills** - Technical skills organized by category
- **Contact** - Contact information and social links

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/hoangmanhquan/quan-prelim-portfolio-page.git
   cd quan-prelim-portfolio-page
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open your browser and navigate to \`http://localhost:5173\`

## 📦 Building for Production

Build the project for production:
\`\`\`bash
npm run build
\`\`\`

Preview the production build:
\`\`\`bash
npm run preview
\`\`\`

## 🌐 Deployment

### Deploy to Vercel

1. Install Vercel CLI: \`npm i -g vercel\`
2. Run: \`vercel\`

### Deploy to Netlify

1. Build the project: \`npm run build\`
2. Drag and drop the \`dist\` folder to [Netlify Drop](https://app.netlify.com/drop)

### Deploy to GitHub Pages

1. Install gh-pages: \`npm install -D gh-pages\`
2. Add to \`package.json\`:
   \`\`\`json
   "homepage": "https://yourusername.github.io/repo-name",
   "scripts": {
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   }
   \`\`\`
3. Run: \`npm run deploy\`

## 🛠️ Tech Stack

- **React 18** - Modern React with Hooks
- **Vite** - Lightning-fast build tool
- **CSS3** - Custom styling with CSS variables
- **Google Fonts** - Space Grotesk, DM Serif Display, Inter

## 📁 Project Structure

\`\`\`
src/
├── components/ # React components
│ ├── Desktop.jsx # Desktop container
│ ├── DesktopIcon.jsx # Desktop icons
│ ├── Window.jsx # Draggable window component
│ ├── Taskbar.jsx # Bottom taskbar
│ └── StartMenu.jsx # Start menu
├── content/ # Window content components
│ ├── AboutContent.jsx
│ ├── ProjectsContent.jsx
│ ├── SkillsContent.jsx
│ └── ContactContent.jsx
├── App.jsx # Main app component
├── App.css # Global styles
└── main.jsx # Entry point
\`\`\`

## 🎨 Customization

### Update Your Information

Edit the content components in \`src/content/\`:

- \`AboutContent.jsx\` - Your bio and introduction
- \`ProjectsContent.jsx\` - Your projects
- \`SkillsContent.jsx\` - Your technical skills
- \`ContactContent.jsx\` - Your contact information

### Change Colors

Modify CSS variables in \`src/App.css\`:
\`\`\`css
:root {
--xp-blue: #0054E3;
--xp-blue-light: #3C8CF7;
--xp-green: #3DBC05;
--xp-orange: #FFA800;
--xp-red: #FF0000;
}
\`\`\`

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the classic Windows XP operating system
- Typography from Google Fonts
- Built with modern web technologies

## 📧 Contact

**Quan** - [GitHub](https://github.com/hoangmanhquan)

Project Link: [https://github.com/hoangmanhquan/quan-prelim-portfolio-page](https://github.com/hoangmanhquan/quan-prelim-portfolio-page)

---

⭐ Star this repo if you found it helpful!
