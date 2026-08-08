# ⚡ Quick Start Guide

Get your MoliDongHub up and running in 5 minutes!

---

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open browser
http://localhost:4321
```

**That's it!** No env variables, no complex setup.

---

## 🌐 Deploy to Vercel (Fastest)

### Option 1: Via Dashboard (No CLI)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/donghuaweb.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repo
   - Click "Deploy"

3. **Done!** ✅
   - Your site: `https://your-project.vercel.app`
   - Auto-deploys on every push

### Option 2: Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 📂 Project Structure

```
donghuaweb/
├── src/
│   ├── pages/          # Routes (auto-generated)
│   ├── components/     # Reusable components
│   ├── layouts/        # Page layouts
│   ├── services/       # API calls
│   ├── utils/          # Helper functions
│   └── styles/         # Global CSS
├── public/             # Static assets
├── astro.config.mjs    # Astro config
└── vercel.json         # Vercel config
```

---

## 🎯 Key Files

### Configuration
- `src/configs/animeConfig.ts` - Site name, logo, API URL
- `astro.config.mjs` - Framework settings
- `vercel.json` - Deployment settings

### Core Features
- `src/utils/bookmarkManager.ts` - Bookmark system
- `src/utils/watchHistoryManager.ts` - Watch history
- `src/services/*.ts` - API integrations

### New Pages
- `src/pages/bookmarks/` - Bookmark list
- `src/pages/schedule/` - Release schedule
- `src/pages/disclaimers/` - Legal info

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Deployment
vercel                   # Deploy to preview
vercel --prod            # Deploy to production

# Git
git status               # Check changes
git add .                # Stage all
git commit -m "message"  # Commit
git push                 # Push to GitHub
```

---

## ⚙️ Customization

### Change Site Name
Edit `src/configs/animeConfig.ts`:
```typescript
siteName: "YourSiteName"
```

### Change Logo
Replace `public/images/logo.png` with your logo

### Change Colors
Edit `src/styles/global.css`:
```css
/* Change accent color */
.bg-amber-600 { background: #your-color; }
```

---

## 🎨 Features Included

✅ Multi-server video player  
✅ Download links (multiple hosts)  
✅ Bookmark system  
✅ Watch history tracker  
✅ Dark/Light mode  
✅ Search & filters  
✅ Recommendations  
✅ Schedule page  
✅ Responsive design  

---

## 📱 Access Features

### Bookmark Anime
1. Go to anime detail page
2. Click "Bookmark" button
3. View all at `/bookmarks`

### View Schedule
- Go to `/schedule`
- See daily release schedule

### Switch Theme
- Click sun/moon icon in navbar
- Auto-saves preference

---

## 🐛 Troubleshooting

### Build Error
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### Module Not Found
```bash
npm install
```

---

## 📚 Full Documentation

- **Complete Guide:** `README.md`
- **All Features:** `FEATURES.md`
- **Deployment:** `DEPLOYMENT_GUIDE.md`
- **Ready Status:** `READY_TO_DEPLOY.md`

---

## 🆘 Need Help?

- **WhatsApp:** https://whatsapp.com/channel/0029Vb7PIC9KQuJRWvETIR2y
- **Donate:** https://saweria.co/vanxstore

---

## ✅ Quick Checklist

- [ ] npm install
- [ ] npm run dev (test locally)
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Test production site
- [ ] Share with users! 🎉

---

**Total setup time: ~5 minutes**

**That's it! You're ready to stream! 🎬**
