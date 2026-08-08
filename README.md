# 🎬 MoliDongHub - Streaming Donghua & Anime

Website streaming dan download donghua/anime gratis dengan desain modern minimalist ala Vercel.

![MoliDongHub](public/images/molidonghub.jpg)

## ✨ Features

### 🎯 Core Features
- ✅ **Streaming Multi-Server** - 3-5 server backup untuk setiap episode
- ✅ **Download Links** - Multiple hosts (GDrive, MEGA, MediaFire)
- ✅ **Search & Filter** - Cari berdasarkan judul, genre, A-Z
- ✅ **Ongoing & Completed** - Track status anime
- ✅ **Batch Download** - Download full season sekaligus
- ✅ **Jadwal Rilis** - Lihat jadwal episode per hari
- ✅ **Episode Terbaru** - Selalu update dengan episode terbaru

### 💎 Advanced Features  
- ✅ **Bookmark System** - Simpan anime favorit (localStorage)
- ✅ **Watch History** - Auto-track episode yang ditonton
- ✅ **Progress Tracker** - Simpan progress menonton per episode
- ✅ **Recommendations** - Anime serupa berdasarkan genre
- ✅ **Dark/Light Mode** - Switch tema dengan smooth transition
- ✅ **Responsive Design** - Perfect di mobile, tablet, desktop
- ✅ **PWA Ready** - Bisa dijadikan mobile app

### 🎨 UI/UX
- Modern minimalist design inspired by Vercel
- Smooth animations (200-300ms duration)
- Glass morphism effects
- Natural grayscale color palette
- Custom scrollbar
- Fallback images untuk poster error
- Loading states & error handling

## 🚀 Tech Stack

- **Framework:** [Astro](https://astro.build/) 4.x (SSR mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + Custom CSS
- **Deployment:** [Vercel](https://vercel.com/)
- **API Source:** sankavollerei.com
- **Language:** TypeScript
- **Storage:** LocalStorage untuk bookmark & history

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/donghuaweb.git
cd donghuaweb

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:4321
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build            # Production build

# Preview
npm run preview          # Preview production build
```

### Project Structure

```
donghuaweb/
├── public/
│   ├── images/          # Static images
│   └── favicon.png
├── src/
│   ├── components/      # Astro components
│   ├── configs/         # Configuration
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route pages
│   ├── services/        # API services
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── astro.config.mjs     # Astro configuration
├── vercel.json          # Vercel deployment config
└── package.json
```

## 🎨 Customization

### Change Site Name & Branding

Edit `src/configs/animeConfig.ts`:

```typescript
const animeConfig = {
  molidonghub: {
    siteName: "YourSiteName",
    description: "Your description",
    logo: "/images/your-logo.png",
  },
};
```

## 📱 Features Guide

### Bookmark System
- Click bookmark button on anime detail page
- View all bookmarks at `/bookmarks`
- Data stored in localStorage

### Watch History
- Automatically saves when user watches episode
- Tracks playback progress
- View history at `/history`

### Multi-Server Player
- 3-5 backup servers per episode
- Switch server via dropdown
- Auto-fallback if server down

### Download Links
- Multiple quality: 360p-1080p
- Multiple hosts per quality
- Direct download links

## 🚀 Deployment to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "Add New Project"
- Import your GitHub repo
- Click "Deploy"

3. **Done!**
Your site is live!

**Full guide:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🐛 Troubleshooting

### Build Errors
```bash
rm -rf node_modules package-lock.json dist .astro
npm install
npm run build
```

### Images Not Loading
All images have fallback to `/images/placeholder-anime.png`

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 👤 Developer

**Van-XOffice**

- 💰 Donate: [saweria.co/vanxstore](https://saweria.co/vanxstore)
- 💬 WhatsApp: [Channel](https://whatsapp.com/channel/0029Vb7PIC9KQuJRWvETIR2y)

## 📝 Changelog

### v2.0.0 (Latest)
- ✨ Added bookmark system
- ✨ Added watch history tracker
- ✨ Added recommendations
- ✨ Added schedule page
- ✨ Added disclaimers page
- 🎨 Complete Vercel-style redesign
- 🐛 Fixed genre filtering
- 🐛 Fixed broken images
- 🔧 Vercel deployment ready

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub!

---

**Ready to stream? 🎬**
