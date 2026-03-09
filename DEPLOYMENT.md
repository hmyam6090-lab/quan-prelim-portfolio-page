# 🌐 Deployment Guide

This guide will help you deploy your Windows XP Portfolio to various platforms.

## Quick Deploy Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy your Vite + React application.

**Method 1: Using Vercel CLI**

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

**Method 2: GitHub Integration**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will auto-detect Vite and deploy

Your site will be live at: `https://your-project.vercel.app`

---

### Option 2: Netlify

**Method 1: Netlify Drop (Fastest)**

```bash
# Build your project
npm run build

# Go to https://app.netlify.com/drop
# Drag and drop the 'dist' folder
```

**Method 2: Netlify CLI**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# For production
netlify deploy --prod
```

**Method 3: GitHub Integration**

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`

---

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add these scripts to package.json
{
  "homepage": "https://yourusername.github.io/quan-prelim-portfolio-page",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}

# Deploy
npm run deploy
```

Also update `vite.config.js`:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/quan-prelim-portfolio-page/", // Your repo name
});
```

---

### Option 4: Cloudflare Pages

1. Push your code to GitHub
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
3. Navigate to "Workers & Pages" → "Create application"
4. Select "Pages" → "Connect to Git"
5. Select your repository
6. Configure build:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: leave blank

---

### Option 5: Firebase Hosting

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Initialize Firebase in your project
firebase init hosting

# Select these options:
# - Public directory: dist
# - Configure as single-page app: Yes
# - Set up automatic builds with GitHub: Optional

# Build your project
npm run build

# Deploy
firebase deploy
```

---

## Environment Variables

If you need environment variables:

**Vite uses `VITE_` prefix:**

```bash
# .env
VITE_API_KEY=your_api_key
VITE_API_URL=https://api.example.com
```

**Access in code:**

```javascript
const apiKey = import.meta.env.VITE_API_KEY;
```

**For each platform:**

- **Vercel**: Add in Project Settings → Environment Variables
- **Netlify**: Add in Site Settings → Environment Variables
- **GitHub Pages**: Store in GitHub Secrets (if using Actions)

---

## Custom Domain

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS or use Netlify DNS

---

## Build Optimization

Before deploying, optimize your build:

```bash
# Analyze bundle size
npm run build

# The dist folder should be around 200-500KB
```

**Optimization tips:**

- Use dynamic imports for large components
- Optimize images (use WebP format)
- Enable compression on your hosting platform
- Use CDN for static assets

---

## Continuous Deployment

**With Vercel/Netlify + GitHub:**

- Every push to `main` branch auto-deploys
- Pull request previews are generated automatically
- Rollback to previous deployments anytime

---

## Troubleshooting

**404 errors on page refresh:**

- Make sure your hosting has proper redirects configured
- `vercel.json` and `netlify.toml` are already configured in this project

**Build fails:**

- Check Node.js version (use v16+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

**Slow build times:**

- Use `npm ci` instead of `npm install` in CI/CD
- Enable caching in your deployment platform

---

## Performance After Deployment

Check your site's performance:

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

Target scores:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

---

## Cost

All recommended platforms have generous free tiers:

- **Vercel**: Free for personal projects
- **Netlify**: Free tier includes 100GB bandwidth/month
- **GitHub Pages**: Free for public repos
- **Cloudflare Pages**: Unlimited bandwidth on free tier

---

Happy deploying! 🚀
