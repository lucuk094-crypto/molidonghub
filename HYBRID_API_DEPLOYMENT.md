# 🚀 Hybrid API System & Deployment Guide

## ✨ **Fitur Baru: Hybrid API System**

### **Apa yang Ditambahkan:**

✅ **Dual API Sources** - Gabungkan sankavollerei.com + anichin API  
✅ **Server Merging** - Combine streaming servers dari kedua API  
✅ **Automatic Fallback** - Jika satu API down, otomatis pakai yang lain  
✅ **More Servers** - Lebih banyak pilihan server streaming  
✅ **Better Coverage** - Anime/donghua yang lebih lengkap  

---

## 📊 **Bagaimana Cara Kerjanya:**

### **1. Episode Streaming - Hybrid Mode**

```typescript
// Primary: sankavollerei.com
- Fetch episode data
- Get streaming servers (3-5 servers)

// Secondary: anichin API  
- Fetch same episode
- Get additional servers (2-4 servers)

// Merge Results:
- Total servers: 5-9 servers ✅
- Remove duplicates
- Tag servers by source (Primary/Backup/Anichin)
- User can switch between all servers
```

**Contoh Output:**
```
Server List:
1. Server Bawaan (Main) - from sankavollerei
2. Server 1 (Primary) - from sankavollerei
3. Server 2 (Primary) - from sankavollerei
4. StreamSB (Backup) - from anichin
5. Filemoon (Anichin) - from anichin
6. Doodstream (Anichin) - from anichin

Total: 6 servers to choose from! 🎉
```

### **2. Fallback System**

```
User Request Episode
     ↓
Try sankavollerei API
     ↓
  Success? ────YES──→ Get servers
     │                    ↓
     NO              Try anichin API
     ↓                    ↓
Try anichin API       Merge servers
     ↓                    ↓
  Success? ────YES──→ Combine results
     │                    ↓
     NO              Show all servers
     ↓
Show Error Page
```

---

## 🏗️ **Architecture**

### **Files Created:**

```
src/utils/
└── hybridApi.ts              # Hybrid API utility

src/services/
└── hybridEpisodeService.ts   # Enhanced episode service

anichin-api-main/
├── Procfile                  # Railway deployment
├── requirements.txt          # Updated with gunicorn
└── railway.txt               # Railway config
```

### **Files Modified:**

```
src/pages/episode/[episodeId]/index.astro
└── Now uses hybridEpisodeService
```

---

## 🎯 **Deployment Strategy**

### **Rekomendasi Terbaik: Vercel + Railway**

| Component | Platform | Purpose |
|-----------|----------|---------|
| **Main Website** | **Vercel** | Frontend Astro SSR |
| **Anichin API** | **Railway** | Python Flask API (backup servers) |

---

## 📦 **Step 1: Deploy Anichin API ke Railway**

### **Why Railway:**
- ✅ **Free Tier:** 500 hours/month ($5 credit)
- ✅ **Python Support:** Native Python runtime
- ✅ **Auto-Deploy:** GitHub integration
- ✅ **Fast:** Quick deployment
- ✅ **Logs:** Built-in logging
- ✅ **Custom Domain:** Support custom domain

### **Alternative Options:**

| Platform | Free Tier | Python | Pros | Cons |
|----------|-----------|--------|------|------|
| **Railway** ⭐ | 500h/mo | ✅ | Easy, Fast | Limited free tier |
| **Render** | ✅ | ✅ | Good free tier | Slower cold start |
| **Fly.io** | ✅ | ✅ | Good perf | Complex setup |
| **Koyeb** | ✅ | ✅ | Generous free | Less known |

---

### **Deploy Anichin API to Railway:**

#### **Method 1: Via Railway Dashboard (Easiest)**

1. **Push to GitHub:**
```bash
# Create new repo for anichin-api
cd c:\Users\vanx3\Downloads\donghuaweb-main\anichin-api-main

git init
git add .
git commit -m "Initial commit - Anichin API"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/anichin-api.git
git branch -M main
git push -u origin main
```

2. **Deploy to Railway:**
```
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select "anichin-api" repository
6. Railway auto-detects Python ✅
7. Click "Deploy"
8. Wait 2-3 minutes
9. Get your URL: https://your-app.railway.app ✅
```

3. **Configure:**
```
- Set environment variables (if needed):
  USER_AGENT: Mozilla/5.0 ...
  
- Domain ready to use!
```

#### **Method 2: Via Railway CLI**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd anichin-api-main
railway init

# Link to new project
railway link

# Deploy
railway up

# Get URL
railway domain
```

---

## 📦 **Step 2: Deploy Main Website ke Vercel**

### **Why Vercel for Main Site:**
- ✅ **Best for Astro:** Official Astro support
- ✅ **Global CDN:** Fast worldwide
- ✅ **Auto HTTPS:** Automatic SSL
- ✅ **Zero Config:** Just push and deploy
- ✅ **Free Tier:** Unlimited projects
- ✅ **Edge Functions:** Fast serverless
- ✅ **Analytics:** Built-in analytics

### **Alternative Options:**

| Platform | Pros | Cons | Best For |
|----------|------|------|----------|
| **Vercel** ⭐⭐⭐ | Perfect for Astro | None | Production (Recommended) |
| **Netlify** ⭐⭐ | Good Astro support | Slower than Vercel | Alternative |
| **Cloudflare Pages** ⭐⭐ | Fast, generous | Complex setup | Advanced users |
| **Railway** ⭐ | All-in-one | Not optimized for static | Simple projects |

---

### **Deploy to Vercel:**

1. **Update Config with Railway URL:**
```typescript
// src/utils/hybridApi.ts
const API_SOURCES: ApiSource[] = [
  {
    name: "sankavollerei",
    apiUrl: "https://www.sankavollerei.com",
    baseUrlPath: "/anime/donghua",
    priority: 1,
  },
  {
    name: "anichin",
    apiUrl: "https://YOUR-APP.railway.app", // ⬅️ UPDATE THIS
    baseUrlPath: "",
    priority: 2,
  },
];
```

2. **Push to GitHub:**
```bash
cd c:\Users\vanx3\Downloads\donghuaweb-main

git add .
git commit -m "Add hybrid API system"
git push
```

3. **Deploy to Vercel:**
```
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Import "donghuaweb" repository
5. Framework: Astro (auto-detected) ✅
6. Click "Deploy"
7. Wait 2-3 minutes
8. Done! ✅

Your site: https://your-project.vercel.app
```

---

## ⚙️ **Configuration**

### **Enable/Disable Hybrid Mode:**

```typescript
// src/pages/episode/[episodeId]/index.astro

// Enable hybrid (merge servers from both APIs)
const USE_HYBRID = true; // ✅ Recommended

// Disable hybrid (use sankavollerei only)
const USE_HYBRID = false; // ⚠️ Fewer servers
```

### **API Priority:**

```typescript
// src/utils/hybridApi.ts

const API_SOURCES = [
  {
    name: "sankavollerei",
    priority: 1, // Try first
  },
  {
    name: "anichin",
    priority: 2, // Try second (fallback)
  },
];
```

---

## 📊 **Benefits of Hybrid System**

### **Before (Single API):**
```
Episode Page:
- 3-5 servers available
- If API down → No servers
- Limited coverage
- Single point of failure
```

### **After (Hybrid API):**
```
Episode Page:
- 5-9 servers available ✅
- If API down → Fallback works ✅
- Better coverage ✅
- Automatic redundancy ✅
- More anime/donghua available ✅
```

---

## 💰 **Cost Analysis**

### **Free Tier Hosting:**

| Component | Platform | Monthly Cost | Notes |
|-----------|----------|--------------|-------|
| **Main Website** | Vercel | **$0** | 100GB bandwidth |
| **Anichin API** | Railway | **$0** | 500 hours free ($5 credit) |
| **Total** | | **$0/month** ✅ | Perfect for starting! |

### **Paid Options (If Needed):**

| Platform | Paid Plan | When to Upgrade |
|----------|-----------|-----------------|
| **Vercel** | $20/mo | >100GB bandwidth/month |
| **Railway** | $5/mo | >500 hours/month |
| **Total** | $25/mo | High traffic (10k+ users/mo) |

---

## 🧪 **Testing Guide**

### **After Deployment:**

1. **Test Primary API (sankavollerei):**
```
1. Open any episode
2. Should load with 3-5 servers
3. All servers should work
```

2. **Test Hybrid System:**
```
1. Check browser console
2. Look for: "[HybridEpisode] Merged X total servers"
3. Should see 5-9 servers
4. Test switching between servers
```

3. **Test Fallback:**
```
1. If sankavollerei slow/down
2. Should still get servers from anichin
3. No error page shown
```

---

## 🔍 **Monitoring**

### **Railway (Anichin API):**
```
Dashboard → Your Project → Logs

Look for:
✅ "Starting Anichin API server"
✅ "GET /episode/..." 200 OK
❌ Any 500 errors → Check logs
```

### **Vercel (Main Site):**
```
Dashboard → Your Project → Functions

Look for:
✅ Function executions
✅ Response times < 3s
❌ Errors → Check function logs
```

---

## 🚨 **Troubleshooting**

### **Issue: Anichin API Not Responding**

**Solution:**
```typescript
// Disable hybrid temporarily
const USE_HYBRID = false;

// Or increase timeout
const anichinResult = await hybridFetch(
  `/episode/${episodeId}`,
  { preferredSource: "anichin", retryOnFail: false }
);
```

### **Issue: Too Many Servers (Duplicate)**

**Solution:**
Already handled! Merge function removes duplicates by URL.

### **Issue: Railway Free Tier Exceeded**

**Options:**
1. Upgrade to Railway Pro ($5/mo)
2. Switch to Render free tier
3. Disable anichin API temporarily (use sankavollerei only)

---

## 📈 **Performance**

### **Expected Response Times:**

| Scenario | Time | Notes |
|----------|------|-------|
| **Sankavollerei only** | 1-3s | Fast |
| **Hybrid (both APIs)** | 2-4s | Slightly slower but more servers |
| **Anichin fallback** | 3-5s | When primary fails |

---

## ✅ **Deployment Checklist**

### **Anichin API (Railway):**
- [ ] Push code to GitHub
- [ ] Create Railway project
- [ ] Deploy from GitHub
- [ ] Get Railway URL
- [ ] Test `/genres` endpoint
- [ ] Test `/episode/...` endpoint

### **Main Website (Vercel):**
- [ ] Update Railway URL in `hybridApi.ts`
- [ ] Set `USE_HYBRID = true`
- [ ] Push to GitHub
- [ ] Create Vercel project
- [ ] Deploy from GitHub
- [ ] Test episode pages
- [ ] Verify server count (5-9 servers)
- [ ] Test server switching

---

## 🎉 **Final Result**

### **What You Get:**

✅ **Main Website on Vercel:**
- Fast global CDN
- Auto HTTPS
- Zero downtime
- Automatic deployments

✅ **Backup API on Railway:**
- Additional anime/donghua sources
- More streaming servers (2-4 extra)
- Fallback if primary API down
- Independent scaling

✅ **Hybrid System:**
- Best of both APIs
- 5-9 servers per episode
- Automatic redundancy
- Better user experience

---

## 🎯 **Recommendations**

### **For Small Traffic (<1000 users/day):**
```
✅ Vercel Free + Railway Free
Cost: $0/month
Perfect for: Testing, personal use, small communities
```

### **For Medium Traffic (1000-10000 users/day):**
```
✅ Vercel Free + Railway Pro
Cost: $5/month
Perfect for: Growing sites, medium communities
```

### **For High Traffic (>10000 users/day):**
```
✅ Vercel Pro + Railway Pro
Cost: $25/month
Perfect for: Popular sites, large communities
```

---

## 🚀 **Quick Start Commands**

### **Deploy Everything:**

```bash
# 1. Deploy Anichin API
cd anichin-api-main
git init
git add .
git commit -m "Deploy to Railway"
# Push to GitHub, then deploy on Railway dashboard

# 2. Update config
# Edit src/utils/hybridApi.ts with Railway URL

# 3. Deploy main site
cd ..
git add .
git commit -m "Add hybrid API system"
git push
# Import to Vercel

# Done! 🎉
```

---

## 📞 **Support**

- **WhatsApp:** https://whatsapp.com/channel/0029Vb7PIC9KQuJRWvETIR2y
- **Developer:** Van-XOffice
- **Donate:** https://saweria.co/vanxstore

---

**Ready to deploy with hybrid system! More servers, better coverage, automatic fallback! 🚀**
