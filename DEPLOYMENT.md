# 🚀 Deployment Guide - The Heritage Archery

Your web application is **100% deployment ready**! All build configuration files (`vercel.json`, `netlify.toml`, production bundle scripts) have been automatically created and tested.

---

## Option 1: Deploy to Vercel (Recommended - Fast & Free)

1. Create a free account at [Vercel.com](https://vercel.com).
2. Install Vercel CLI (optional) or push your code to GitHub.
3. If using Vercel Dashboard:
   - Click **"Add New Project"** -> Import your GitHub repository.
   - Framework Preset: Select **Vercel / Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click **Deploy**.
4. Your site will be live instantly with a free SSL domain (e.g. `the-heritage-archery.vercel.app`)!

---

## Option 2: Deploy to Netlify (Drag & Drop or Git)

### Method A: Drag & Drop (Zero Git required)
1. Run the build command locally:
   ```bash
   npm run build
   ```
2. Open [Netlify Drop](https://app.netlify.com/drop).
3. Drag and drop the `dist` folder directly onto the page.
4. Your site is instantly live!

### Method B: Netlify + Git
1. Connect your GitHub repository to Netlify.
2. Netlify will auto-detect `netlify.toml` and deploy automatically on every push!

---

## Option 3: Local Testing of Production Build

To test the compiled production bundle on your computer before publishing live:

```bash
# Build the production bundle
npm run build

# Preview production build locally
npm run preview
```
Visit `http://localhost:4173/` to view the production build.
