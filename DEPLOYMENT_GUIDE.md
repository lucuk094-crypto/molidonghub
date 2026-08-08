# 🚀 Panduan Deployment ke Vercel

## 📋 Prasyarat

- Account Vercel (gratis di [vercel.com](https://vercel.com))
- Repository GitHub (push project ini ke GitHub)
- Node.js 18+ installed

---

## 🔧 Persiapan Deployment

### 1. Push ke GitHub

```bash
# Initialize git (jika belum)
git init

# Add files
git add .

# Commit
git commit -m "Ready for deployment"

# Add remote (ganti dengan repo kamu)
git remote add origin https://github.com/username/donghuaweb.git

# Push
git push -u origin main
```

### 2. Install Vercel CLI (Opsional)

```bash
npm install -g vercel
```

---

## 🌐 Deploy ke Vercel

### Method 1: Via Vercel Dashboard (Rekomendasi)

1. **Login ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan GitHub account

2. **Import Project**
   - Klik "Add New..." → "Project"
   - Pilih repository GitHub kamu
   - Klik "Import"

3. **Configure Project**
   ```
   Framework Preset: Astro
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables** (Opsional)
   - Tidak ada yang perlu diset untuk project ini
   - Semua config ada di `animeConfig.ts`

5. **Deploy**
   - Klik "Deploy"
   - Tunggu 2-3 menit
   - ✅ Done! Website live di `https://your-project.vercel.app`

### Method 2: Via Vercel CLI

```bash
# Login
vercel login

# Deploy
vercel

# Follow the prompts:
# ? Set up and deploy "~/donghuaweb"? [Y/n] Y
# ? Which scope do you want to deploy to? [Your Username]
# ? Link to existing project? [y/N] N
# ? What's your project's name? donghuaweb
# ? In which directory is your code located? ./

# Deploy to production
vercel --prod
```

---

## 🔄 Auto Deployment

Setelah setup awal, setiap push ke GitHub akan otomatis deploy:

```bash
git add .
git commit -m "Update feature"
git push
```

Vercel akan otomatis:
1. Detect changes
2. Build project
3. Deploy to production
4. Update URL yang sama

---

## ⚙️ Konfigurasi Vercel

File `vercel.json` sudah included dengan settings:

```json
{
  "buildCommand": "npm run build",
  "framework": "astro",
  "outputDirectory": "dist",
  "regions": ["sin1"],  // Singapore region untuk performa terbaik
  "headers": [
    // Security headers
    // Cache headers untuk images
  ]
}
```

---

## 🎯 Custom Domain (Opsional)

### 1. Beli Domain
- Namecheap, GoDaddy, Niagahoster, dll.

### 2. Add Domain di Vercel
1. Project Settings → Domains
2. Add domain kamu (contoh: `donghuaweb.com`)
3. Vercel akan berikan DNS records

### 3. Update DNS di Registrar
Add records yang diberikan Vercel:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### 4. Tunggu Propagasi
- DNS propagation: 5 menit - 48 jam
- SSL certificate: Otomatis dari Vercel

---

## 📱 Convert ke Mobile App

### Method 1: PWA (Progressive Web App)

Project ini sudah support PWA basics. Untuk full PWA:

1. **Add Web Manifest**
```json
// public/manifest.json
{
  "name": "MoliDongHub",
  "short_name": "MoliDong",
  "description": "Nonton Donghua Gratis",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#fbbf24",
  "icons": [
    {
      "src": "/images/logo.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

2. **Add Manifest Link**
```html
<!-- src/layouts/Layout.astro -->
<link rel="manifest" href="/manifest.json" />
```

3. Users bisa "Add to Home Screen" di mobile browser

### Method 2: Capacitor (Native App)

Convert to native iOS/Android app:

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Initialize
npx cap init

# Build web assets
npm run build

# Add platforms
npx cap add android
npx cap add ios

# Open in native IDE
npx cap open android  # Android Studio
npx cap open ios      # Xcode
```

### Method 3: PWABuilder

1. Deploy ke Vercel dulu
2. Buka [pwabuilder.com](https://www.pwabuilder.com/)
3. Masukkan URL website kamu
4. Generate Android/iOS app packages
5. Upload ke Google Play / App Store

---

## 🐛 Troubleshooting

### Build Error: Module not found

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables

Project ini tidak butuh env variables. Semua config di:
```
src/configs/animeConfig.ts
```

### API Timeout

Jika API `sankavollerei.com` slow:
- Vercel functions timeout: 10 detik (gratis)
- Upgrade ke Pro: 60 detik

### 404 on Routes

Pastikan `astro.config.mjs` menggunakan:
```js
output: "server"
adapter: vercel()
```

---

## 📊 Analytics (Opsional)

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```astro
---
// src/layouts/Layout.astro
import { Analytics } from '@vercel/analytics/react';
---

<Analytics />
```

---

## 💰 Pricing

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domain
- ✅ 6,000 build minutes/month

### Vercel Pro ($20/month)
- Everything in Free
- 1TB bandwidth
- 60s function timeout
- Priority support

**Untuk project ini, Free tier sudah cukup!**

---

## ✅ Checklist Pre-Deployment

- [x] All features working locally
- [x] No TypeScript errors
- [x] All images have fallback
- [x] Valid genres filtered
- [x] Bookmark system working
- [x] Watch history working
- [x] Schedule page created
- [x] Disclaimers page created
- [x] vercel.json configured
- [x] astro.config.mjs ready
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Test production build
- [ ] Add custom domain (optional)

---

## 🎉 Post-Deployment

### Share Your Site
```
Production: https://your-project.vercel.app
Custom Domain: https://donghuaweb.com
```

### Monitor Performance
- Vercel Dashboard → Analytics
- Check load times
- Monitor API errors

### Update Content
Just push to GitHub:
```bash
git add .
git commit -m "Add new feature"
git push
```

Vercel auto-deploys in 2-3 minutes!

---

## 📞 Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Astro Docs: [docs.astro.build](https://docs.astro.build)
- WhatsApp: https://whatsapp.com/channel/0029Vb7PIC9KQuJRWvETIR2y

---

**Ready to deploy? Let's go! 🚀**
