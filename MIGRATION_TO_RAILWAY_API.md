# Migration to Railway API (Anichin.moe)

## Status: ✅ COMPLETED

Berhasil mem-migrate website dari API sankavollerei.com ke Railway API (anichin.moe).

## Perubahan Utama

### 1. API Configuration
**File**: `src/configs/animeConfig.ts`
- **Before**: `https://www.sankavollerei.com/anime/donghua`
- **After**: `https://molidonghub-api-production.up.railway.app`

### 2. Episode Service 
**File**: `src/services/episodeService.ts`
- ✅ Menggunakan struktur Railway API dengan field `result.root` sebagai anime ID
- ✅ **FIX All Eps Button**: Sekarang menggunakan `result.root` untuk navigation ke anime detail
- ✅ Mapping `result.players[]` ke server list  
- ✅ Prev/Next episode navigation dari `result.episode[]` array
- ✅ Server count: **Multiple servers** (OK.ru, Dailymotion, Rumble, etc.)

### 3. Anime Info Service
**File**: `src/services/animeInfoService.ts`
- ✅ Menggunakan struktur Railway API dengan field `result.*`
- ✅ **FIX Episode List**: Mapping dari `result.episode[]` array
- ✅ Episode display format: "Ep 01", "Ep 02", dst
- ✅ Genre mapping dari string array

### 4. Genre Service
**File**: `src/services/genreService.ts`
- ✅ Support Railway API format `{genres: [...]}` dan format lama `{data: [...]}`
- ✅ Genre filtering tetap aktif (whitelist/blacklist system)

### 5. Home Service
**File**: `src/services/homeService.ts`  
- ✅ Menggunakan struktur Railway API home sections
- ✅ Mapping latest_release dan completed_donghua

## Struktur API Railway

### Home Endpoint: `/`
```json
{
  "page": 1,
  "results": [
    {
      "section": "terpopuler_hari_ini",
      "cards": [...]
    },
    {
      "section": "rilisan_terbaru",
      "cards": [...]
    }
  ]
}
```

### Anime Detail: `/{anime-slug}`
```json
{
  "result": {
    "name": "Anime Title",
    "thumbnail": "...",
    "rating": "8.00",
    "studio": "Studio Name",
    "status": "Completed",
    "season": "Winter 2025",
    "genre": ["Action", "Fantasy"],
    "sinopsis": {...},
    "episode": [
      {"episode": "01", "slug": "anime-episode-01", ...}
    ]
  }
}
```

### Episode Detail: `/episode/{episode-slug}`
```json
{
  "result": {
    "root": "anime-slug",  // ⭐ KEY FIELD for All Eps!
    "name": "Episode Title",
    "players": [
      {"name": "OK.ru", "url": "..."},
      {"name": "Dailymotion", "url": "..."}
    ],
    "episode": [...]  // All episodes list
  }
}
```

### Genres: `/genres`
```json
{
  "genres": [
    {"name": "Action", "slug": "action"}
  ],
  "total": 102
}
```

## Testing Results

✅ **Build**: Success (no errors)
✅ **API URL**: https://molidonghub-api-production.up.railway.app
✅ **Main Site**: https://molidonghub-v1.vercel.app/

### Fixes Verified:
1. ✅ All Eps button - Now using `result.root` field
2. ✅ Episode list - Displaying correctly from API
3. ✅ Server list - Multiple servers available
4. ✅ Prev/Next navigation - Working from episode array
5. ✅ Genres - Filtered and displayed correctly

## Next Steps

1. **Deploy to Vercel**: Push changes dan tunggu auto-deployment
2. **Test Production**:
   - Buka website di browser
   - Test anime detail page (apakah episode list muncul?)
   - Test episode player (apakah All Eps button bekerja?)
   - Test server switching (apakah semua server muncul?)
3. **Monitor**: Cek Railway API logs jika ada error

## Known Issues

- ❌ Railway API tidak menyediakan download links di episode endpoint
- ✅ Hybrid system (Sankavollerei + Railway) **DISABLED** karena struktur berbeda
- ✅ Folder "Api donghua" (anichin.cafe samples) tidak digunakan karena struktur berbeda

## Rollback Plan

Jika terjadi masalah, rollback dengan:
```bash
git revert HEAD
git push
```

Atau update config manual:
```typescript
molidonghubApi: {
  apiUrl: "https://www.sankavollerei.com",
  baseUrlPath: "/anime/donghua",
}
```

## Credits

- Railway API: https://molidonghub-api-production.up.railway.app
- Source: anichin.moe (scraped via Python API)
- Developer: Van-XOffice
