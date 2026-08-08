# 🚀 DEPLOYMENT STEP-BY-STEP GUIDE

## ✅ **CHECKLIST PROGRESS**

- [x] Step 1: Git initialized
- [ ] Step 2: Create GitHub account
- [ ] Step 3: Create GitHub repository (Main site)
- [ ] Step 4: Push main site to GitHub
- [ ] Step 5: Create GitHub repository (Anichin API)
- [ ] Step 6: Push Anichin API to GitHub
- [ ] Step 7: Deploy Anichin API to Railway
- [ ] Step 8: Get Railway URL
- [ ] Step 9: Update config with Railway URL
- [ ] Step 10: Deploy main site to Vercel
- [ ] Step 11: Test everything
- [ ] Step 12: Done! 🎉

---

## 📋 **PART 2: Push ke GitHub**

### **Step 2.1: Create GitHub Account** (Skip if sudah punya)

1. Buka: https://github.com/signup
2. Daftar dengan email kamu
3. Verify email
4. Login ke GitHub

---

### **Step 2.2: Create Repository untuk Main Site**

1. **Buka:** https://github.com/new

2. **Fill form:**
   ```
   Repository name: donghuaweb
   Description: Streaming donghua & anime website with hybrid API
   Public ✅ (atau Private)
   ❌ Jangan centang "Add README" (sudah ada)
   ```

3. **Click:** "Create repository"

4. **Salin URL yang muncul:**
   ```
   https://github.com/YOUR_USERNAME/donghuaweb.git
   ```

---

### **Step 2.3: Push Main Site ke GitHub**

Buka **Command Prompt** atau **PowerShell** di folder project, lalu jalankan:

```bash
# Masuk ke folder project
cd C:\Users\vanx3\Downloads\donghuaweb-main

# Add remote (ganti YOUR_USERNAME dengan username GitHub kamu)
git remote add origin https://github.com/YOUR_USERNAME/donghuaweb.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Jika diminta login:**
- Username: (username GitHub kamu)
- Password: (gunakan Personal Access Token, bukan password)

**Cara buat Personal Access Token:**
1. Buka: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Centang: `repo` (full control)
4. Generate token
5. Copy token (simpan, tidak bisa dilihat lagi!)
6. Paste sebagai password saat git push

---

### **Step 2.4: Create Repository untuk Anichin API**

1. **Buka:** https://github.com/new

2. **Fill form:**
   ```
   Repository name: anichin-api
   Description: Python Flask API for scraping anime data
   Public ✅
   ❌ Jangan centang "Add README"
   ```

3. **Click:** "Create repository"

4. **Salin URL:**
   ```
   https://github.com/YOUR_USERNAME/anichin-api.git
   ```

---

### **Step 2.5: Push Anichin API ke GitHub**

Buka **Command Prompt**, lalu jalankan:

```bash
# Masuk ke folder anichin-api
cd C:\Users\vanx3\Downloads\donghuaweb-main\anichin-api-main

# Initialize git
git init

# Configure git
git config user.email "vanxoffice@example.com"
git config user.name "Van-XOffice"

# Add all files
git add .

# Commit
git commit -m "Initial commit: Anichin API for Railway"

# Add remote (ganti YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/anichin-api.git

# Rename branch
git branch -M main

# Push
git push -u origin main
```

✅ **Step 2 Complete!** Kedua repo sudah di GitHub!

---

## 📦 **PART 3: Deploy Anichin API ke Railway**

### **Step 3.1: Sign Up Railway**

1. **Buka:** https://railway.app

2. **Click:** "Login" (kanan atas)

3. **Click:** "Login with GitHub"

4. **Authorize Railway** untuk akses GitHub kamu

5. **Free trial:** $5 credit gratis (500 jam)

---

### **Step 3.2: Create New Project**

1. **Click:** "New Project" (atau "Start a New Project")

2. **Click:** "Deploy from GitHub repo"

3. **Pilih:** Repository "anichin-api"

4. **Railway akan auto-detect:**
   - ✅ Runtime: Python
   - ✅ Build: pip install -r requirements.txt
   - ✅ Start: Dari Procfile

5. **Click:** "Deploy"

6. **Wait:** 2-3 menit (lihat logs di dashboard)

---

### **Step 3.3: Check Deployment**

**Tunggu sampai status:** ✅ **"Success"** atau **"Active"**

**Di logs, kamu akan lihat:**
```
Starting Anichin API server
* Running on http://0.0.0.0:5000
```

---

### **Step 3.4: Get Railway URL**

1. **Di Railway Dashboard**, klik project kamu

2. **Click tab:** "Settings"

3. **Scroll ke:** "Domains"

4. **Click:** "Generate Domain"

5. **Copy URL:** 
   ```
   https://your-app.up.railway.app
   ```
   atau
   ```
   https://anichin-api-production-xxxx.up.railway.app
   ```

6. **Test API:**
   - Buka browser
   - Paste URL + `/genres`
   - Contoh: `https://your-app.up.railway.app/genres`
   - Should show JSON response ✅

✅ **Step 3 Complete!** Anichin API live di Railway!

---

## 🔧 **PART 4: Update Config dengan Railway URL**

### **Step 4.1: Update hybridApi.ts**

1. **Buka file:** `src/utils/hybridApi.ts`

2. **Find line ~18-22:**
   ```typescript
   {
     name: "anichin",
     apiUrl: process.env.ANICHIN_API_URL || "https://anichin-api.railway.app",
     baseUrlPath: "",
     priority: 2,
   }
   ```

3. **Replace dengan Railway URL kamu:**
   ```typescript
   {
     name: "anichin",
     apiUrl: "https://YOUR-APP.up.railway.app", // ⬅️ PASTE URL RAILWAY
     baseUrlPath: "",
     priority: 2,
   }
   ```

4. **Save file**

---

### **Step 4.2: Commit Changes**

```bash
# Masuk ke folder main
cd C:\Users\vanx3\Downloads\donghuaweb-main

# Add changes
git add .

# Commit
git commit -m "Update Railway URL for hybrid API"

# Push
git push
```

✅ **Step 4 Complete!** Config updated!

---

## 🌐 **PART 5: Deploy Main Site ke Vercel**

### **Step 5.1: Sign Up Vercel**

1. **Buka:** https://vercel.com/signup

2. **Click:** "Continue with GitHub"

3. **Authorize Vercel** untuk akses GitHub

4. **Free plan** ✅ (Unlimited projects)

---

### **Step 5.2: Import Project**

1. **Di Vercel Dashboard**, click: "Add New..." → "Project"

2. **Find repository:** "donghuaweb"

3. **Click:** "Import"

---

### **Step 5.3: Configure Project**

**Vercel akan auto-detect Astro! ✅**

```
Framework Preset: Astro ✅ (auto-detected)
Build Command: npm run build ✅
Output Directory: dist ✅
Install Command: npm install ✅
```

**Environment Variables:** (Opsional, bisa skip)
- Tidak perlu di-set, Railway URL sudah hardcoded

**Click:** "Deploy"

---

### **Step 5.4: Wait for Deployment**

1. **Progress bar:** Build → Deploy → Ready

2. **Logs akan show:**
   ```
   Installing dependencies...
   Building...
   ✓ Completed in 45s
   Deploying...
   ✓ Ready!
   ```

3. **Duration:** 2-4 menit

---

### **Step 5.5: Get Your URL**

**Setelah deploy success:**

1. **Vercel akan show:**
   ```
   🎉 Your project is live!
   https://donghuaweb.vercel.app
   ```

2. **Copy URL ini!**

3. **Click URL** untuk open website

✅ **Step 5 Complete!** Website live di Vercel!

---

## 🧪 **PART 6: Testing**

### **Step 6.1: Test Homepage**

1. Buka: `https://your-project.vercel.app`
2. Should load ✅
3. See anime list ✅
4. No errors ✅

---

### **Step 6.2: Test Episode Page (Most Important!)**

1. **Click any anime** dari homepage

2. **Click any episode**

3. **Open browser console:**
   - Press `F12`
   - Go to "Console" tab

4. **Look for:**
   ```
   [HybridEpisode] Fetching episode: ...
   [HybridEpisode] Trying anichin API for additional servers...
   [HybridEpisode] Merged X total servers
   ```

5. **Check server dropdown:**
   - Should have **5-9 servers** (not just 3-5)
   - Servers tagged with: (Main), (Primary), (Backup), (Anichin)

6. **Test switching servers:**
   - Click different server dari dropdown
   - Video should reload
   - Should play ✅

---

### **Step 6.3: Test Other Pages**

```
✅ /ongoing - List ongoing anime
✅ /completed - List completed anime
✅ /schedule - Release schedule
✅ /genres - Genre list
✅ /bookmarks - Bookmark page (empty first time)
✅ /disclaimers - Legal info
```

---

## 🎉 **Step 6 Complete! Everything Working!**

---

## 📊 **DEPLOYMENT SUMMARY**

### **What You Deployed:**

```
✅ Anichin API
   Platform: Railway
   URL: https://your-app.up.railway.app
   Cost: $0/month (free tier)
   Purpose: Backup servers, additional anime

✅ Main Website
   Platform: Vercel
   URL: https://your-project.vercel.app
   Cost: $0/month (free tier)
   Purpose: Frontend, streaming site
```

---

### **How Hybrid System Works:**

```
User clicks episode
      ↓
1. Fetch from sankavollerei.com (Primary)
   → Get 3-5 servers
      ↓
2. Fetch from Railway/Anichin API (Backup)
   → Get 2-4 additional servers
      ↓
3. Merge all servers (remove duplicates)
   → Total: 5-9 servers
      ↓
4. Show all in dropdown
   → User can switch between all servers
```

---

### **Benefits:**

```
✅ More servers (5-9 vs 3-5)
✅ Better reliability (fallback)
✅ More anime coverage
✅ Zero downtime
✅ Professional setup
✅ Free hosting
```

---

## 🔧 **Optional: Custom Domain**

### **Add Custom Domain to Vercel:**

1. **Buy domain** (Namecheap, GoDaddy, etc.)

2. **In Vercel Dashboard:**
   - Go to project
   - Click "Settings" → "Domains"
   - Add your domain
   - Follow DNS instructions

3. **Update DNS at registrar:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Wait 5-60 minutes** for propagation

5. **Done!** Your site at: `https://yourdomain.com`

---

## 🎯 **Troubleshooting**

### **Issue: Railway deployment failed**

**Solution:**
1. Check Railway logs
2. Look for Python errors
3. Make sure `requirements.txt` has all dependencies
4. Try redeploy

---

### **Issue: Vercel build failed**

**Solution:**
1. Check Vercel build logs
2. Look for npm errors
3. Make sure `package.json` is correct
4. Try redeploy

---

### **Issue: Episode shows only 3 servers (hybrid not working)**

**Solution:**
1. Check Railway URL is correct in `hybridApi.ts`
2. Test Railway API: `https://your-app.up.railway.app/genres`
3. Check browser console for errors
4. Make sure `USE_HYBRID = true` in episode page

---

## 📞 **Need Help?**

- **WhatsApp:** https://whatsapp.com/channel/0029Vb7PIC9KQuJRWvETIR2y
- **Docs:** Read `HYBRID_API_DEPLOYMENT.md`

---

## ✅ **FINAL CHECKLIST**

- [ ] GitHub account created
- [ ] Main repo pushed to GitHub
- [ ] Anichin API repo pushed to GitHub
- [ ] Railway account created
- [ ] Anichin API deployed to Railway
- [ ] Railway URL obtained
- [ ] Config updated with Railway URL
- [ ] Changes pushed to GitHub
- [ ] Vercel account created
- [ ] Main site deployed to Vercel
- [ ] Homepage tested ✅
- [ ] Episode page tested (5-9 servers) ✅
- [ ] Server switching tested ✅
- [ ] All pages working ✅

---

## 🎉 **CONGRATULATIONS!**

**Your streaming site is LIVE with hybrid API system!**

```
✅ Main Site: https://your-project.vercel.app
✅ API Backup: https://your-app.up.railway.app
✅ Total Servers: 5-9 per episode
✅ Hosting Cost: $0/month
✅ Professional Setup: Complete
```

**Share your site and enjoy! 🚀**

---

**Made with ❤️ by Van-XOffice**
