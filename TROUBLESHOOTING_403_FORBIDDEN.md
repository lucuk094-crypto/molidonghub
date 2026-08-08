# Troubleshooting: 403 Forbidden Video Player

## ❌ Masalah

Video player menampilkan error:
```
403 Forbidden
Link ini hanya dapat diputar dari halaman anichin.moe
```

## 🔍 Root Cause

Railway API (anichin.moe) mengembalikan video URLs yang memiliki **referer protection**. Server anichin.moe mengecek HTTP Referer header dan hanya mengizinkan request dari domain anichin.moe.

## ✅ Solusi yang Diterapkan

### 1. **Update Referer Policy di Layout**
**File**: `src/layouts/Layout.astro`

```html
<!-- BEFORE -->
<meta name="referrer" content="no-referrer" />

<!-- AFTER -->
<meta name="referrer" content="origin" />
```

**Explanation**: 
- `no-referrer` = Browser tidak mengirim referer header sama sekali
- `origin` = Browser mengirim origin (domain) saja sebagai referer
- Ini memungkinkan video embed tetap bekerja

### 2. **Add Referrerpolicy to Iframe**
**File**: `src/components/VideoPlayer.astro`

```html
<iframe
  src={anime.defaultStreamingUrl}
  allowfullscreen
  referrerpolicy="origin"
  class="w-full h-full"
/>
```

**Explanation**: Explicit referrerpolicy pada iframe untuk memastikan referer dikirim

### 3. **Fix Ongoing/Completed Services**
Railway API tidak punya endpoint `/ongoing/` dan `/completed/` yang dedicated. Harus menggunakan `/anime` endpoint dengan parameter.

**Files**: 
- `src/services/ongoingService.ts`
- `src/services/completedService.ts`

```typescript
// Use /anime endpoint with status parameter
const result = await moli<any>(`/anime?status=ongoing&page=${page || 1}`);
const result = await moli<any>(`/anime?status=completed&page=${page || 1}`);
```

## 📊 Alternative Solutions (If Above Doesn't Work)

### Option A: Use Proxy
Create a proxy endpoint di Vercel untuk bypass referer check:

```typescript
// api/proxy.ts
export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const videoUrl = url.searchParams.get('url');
  
  const response = await fetch(videoUrl, {
    headers: {
      'Referer': 'https://anichin.moe/',
      'User-Agent': 'Mozilla/5.0...'
    }
  });
  
  return new Response(response.body, {
    headers: {
      'Content-Type': response.headers.get('Content-Type')
    }
  });
}
```

Then use: `/api/proxy?url=${encodedVideoUrl}`

### Option B: Server-Side Video Extraction
Jika Railway API return encrypted/protected URLs, extract real video URL di server-side.

### Option C: Direct Video URL
Jika mungkin, gunakan endpoint yang return direct video URL (mp4, m3u8) instead of embed URLs.

## 🧪 Testing

### Test Referer Policy:
```bash
# Test with curl
curl -H "Referer: https://molidonghub-v1.vercel.app/" \
     "https://anichin.moe/stream/..."
```

### Check in Browser:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Play video
4. Check iframe request headers
5. Verify "Referer" header is sent

### Expected Headers:
```
Referer: https://molidonghub-v1.vercel.app/episode/...
Origin: https://molidonghub-v1.vercel.app
```

## 🎯 Post-Fix Checklist

- [ ] Homepage loading (home, ongoing, completed sections)
- [ ] Ongoing page shows anime list
- [ ] Completed page shows anime list  
- [ ] Anime detail page shows episodes
- [ ] Episode player page loads
- [ ] **Video player shows content** (not 403 error!)
- [ ] Server switching works
- [ ] All Eps button redirects correctly

## 🐛 If Still Not Working

### Scenario 1: 403 masih muncul
**Cause**: Referer policy belum apply atau server masih reject
**Solution**: 
- Clear browser cache
- Test in incognito mode
- Check if Railway API changed their protection

### Scenario 2: Ongoing/Completed kosong
**Cause**: Railway API response format berbeda
**Solution**:
```bash
# Test Railway API endpoint
curl "https://molidonghub-api-production.up.railway.app/anime?status=ongoing"
curl "https://molidonghub-api-production.up.railway.app/anime?status=completed"

# Check response structure dan adjust service mapping
```

### Scenario 3: Video tidak play setelah referer fix
**Cause**: Video URL invalid atau expired
**Solution**:
- Check Railway API response
- Verify players array has valid URLs
- Test URL directly di browser

## 📝 Notes

1. **Referer Protection** adalah security measure umum untuk prevent hotlinking
2. **Railway API** kemungkinan scrape dari anichin.moe, jadi URLnya punya referer check
3. **Alternative**: Bisa consider scrape sendiri atau gunakan API lain yang lebih permissive

## 🔄 Rollback

Jika perlu rollback referer changes:

```html
<!-- Revert to no-referrer -->
<meta name="referrer" content="no-referrer" />
```

Dan gunakan proxy solution instead.

---

## ✨ Current Status

- ✅ Referer policy updated to "origin"
- ✅ Referrerpolicy added to iframe
- ✅ Ongoing/Completed services fixed
- ⏳ Waiting for Vercel deployment
- ⏳ Need user testing confirmation

**Next**: User harus test apakah video sekarang bisa play atau masih 403.
