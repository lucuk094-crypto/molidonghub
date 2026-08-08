# 🔍 Investigasi Sumber Data Anime & Donghua

## 📡 API Source

### Base Configuration:
```typescript
// src/configs/animeConfig.ts
apiUrl: "https://www.sankavollerei.com"
baseUrlPath: "/anime/donghua"
```

### Full Endpoint:
```
https://www.sankavollerei.com/anime/donghua
```

---

## 📊 Data Endpoints

### 1. **Home Data**
**Endpoint:** `/anime/donghua/home/1`  
**Data:**
- Latest releases
- Completed donghua
- Ongoing series

### 2. **Anime Detail**
**Endpoint:** `/anime/donghua/detail/[slug]`  
**Data:**
- Title, poster, rating
- Synopsis, genres
- Episode list
- Studio, duration, etc.

### 3. **Episode Streaming**
**Endpoint:** `/anime/donghua/episode/[slug]`  
**Data:**
- Streaming URLs
- Multiple servers
- Download links
- Navigation (prev/next)

### 4. **Genre List**
**Endpoint:** `/anime/donghua/genres`  
**Data:**
- All available genres
- Genre names & slugs

### 5. **Genre Content**
**Endpoint:** `/anime/donghua/genres/[genreId]/[page]`  
**Data:**
- Anime by specific genre
- Pagination

### 6. **Search**
**Endpoint:** `/anime/donghua/search/[query]`  
**Data:**
- Search results
- Anime matching query

### 7. **Ongoing/Completed**
**Endpoint:** 
- `/anime/donghua/ongoing/[page]`
- `/anime/donghua/completed/[page]`

### 8. **Schedule**
**Endpoint:** `/anime/donghua/schedule`  
**Data:**
- Release schedule by day
- Upcoming episodes

### 9. **A-Z List**
**Endpoint:** `/anime/donghua/az-list/[letter]/[page]`  
**Data:**
- Anime sorted alphabetically

---

## 🎬 Server Streaming

### Mengapa Ada Multiple Servers?

#### Alasan:
1. **Redundancy** - Backup jika server utama down
2. **Load Balancing** - Distribusi traffic
3. **Geo-location** - Server terdekat user
4. **Quality Options** - Berbagai kualitas video

### Data Structure:
```typescript
{
  streaming: {
    main_url: {
      name: "Server Utama",
      url: "https://..."
    },
    servers: [
      { name: "Server 1", url: "https://..." },
      { name: "Server 2", url: "https://..." },
      { name: "Server 3", url: "https://..." }
    ]
  }
}
```

### Implementasi di Player:
```astro
<!-- src/components/VideoPlayer.astro -->
<select id="servers">
  <option value={defaultUrl}>Server Bawaan</option>
  {servers.map(server => (
    <option value={server.url}>{server.name}</option>
  ))}
</select>
```

### Cara Kerja:
1. User memilih server dari dropdown
2. JavaScript fetch server URL
3. Video player update dengan URL baru
4. Jika gagal, user bisa pilih server lain

---

## 🔄 Data Flow

### 1. Request Flow:
```
User → Astro Page → Service → moli() → API → Response
```

### 2. moli() Utility:
```typescript
// src/utils/moli.ts
export default async function moli<T>(pathname: string) {
  const fullPath = generateUrlPath(baseUrlPath, pathname);
  const url = new URL(fullPath, apiUrl).href;
  
  const response = await fetch(url);
  const result = await response.json();
  
  return {
    statusCode: 200,
    ok: true,
    data: result,
    pagination: null
  };
}
```

### 3. Service Layer:
```typescript
// Example: src/services/animeInfoService.ts
export default async function animeInfoService({ animeId }) {
  const result = await moli(`/detail/${animeId}`);
  
  // Transform API data to our format
  const mappedData = {
    title: result.data.title,
    poster: result.data.poster,
    // ... mapping lainnya
  };
  
  return { ...result, data: mappedData };
}
```

---

## 📝 Data Mapping

### API Response → Our Format

#### Before (API):
```json
{
  "title": "Demon Slayer",
  "alter_title": "Kimetsu no Yaiba",
  "poster": "https://...",
  "episodes_list": [
    {
      "episode": "Episode 1",
      "slug": "demon-slayer-episode-1"
    }
  ]
}
```

#### After (Mapped):
```typescript
{
  title: "Demon Slayer",
  japanese: "Kimetsu no Yaiba",
  poster: "https://...",
  episodeList: [
    {
      title: "Ep 1",
      episodeId: "demon-slayer-episode-1"
    }
  ]
}
```

---

## 🔐 API Characteristics

### Response Format:
```json
{
  "status": "success",
  "data": { ... },
  "message": "OK"
}
```

### Error Handling:
```typescript
if (!response.ok) {
  return {
    statusCode: response.status,
    statusMessage: response.statusText,
    ok: false,
    data: {} as T
  };
}
```

### Caching:
- ❌ No built-in caching
- ✅ Astro SSR caches at page level
- ⚡ Dapat ditambahkan Redis/memory cache

---

## 🎯 Download Links

### Data Structure:
```typescript
{
  download_url: {
    download_url_360p: {
      "GDrive": "https://...",
      "MEGA": "https://...",
      "MediaFire": "https://..."
    },
    download_url_480p: { ... },
    download_url_720p: { ... },
    download_url_1080p: { ... }
  }
}
```

### Mapped Format:
```typescript
{
  downloadUrl: {
    formats: [
      {
        title: "360p",
        qualities: [{
          title: "360p",
          urls: [
            { title: "GDrive", url: "https://..." },
            { title: "MEGA", url: "https://..." }
          ]
        }]
      }
    ]
  }
}
```

---

## 🚀 Performance Optimization

### Current:
- Direct API calls on each page load
- No caching layer
- SSR renders on demand

### Recommendations:
```typescript
// Add caching layer
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export default async function moli<T>(pathname: string) {
  const cacheKey = pathname;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const result = await fetchData(pathname);
  cache.set(cacheKey, result);
  
  return result;
}
```

---

## 🔍 API Limitations

### Known Issues:
1. ⚠️ Some genres return empty data
2. ⚠️ Studio names mixed with genre list
3. ⚠️ Inconsistent response formats
4. ⚠️ No pagination metadata sometimes

### Solutions Applied:
```typescript
// Genre filtering
const BLOCKED_GENRES = [
  'triopen-studio',
  'yhkt-entertainment',
  // ... studio names
];

// Whitelist valid genres
const ALLOWED_GENRES = [
  'action', 'comedy', 'drama',
  // ... actual genres
];
```

---

## 📊 Data Statistics

### From API:
- **Total Genres:** ~200+ (including invalid)
- **Valid Genres:** ~98 (after filtering)
- **Servers per Episode:** 3-5 average
- **Download Hosts:** 3-4 average

---

## 🎬 Video Streaming

### Embed Types:
1. **Direct MP4** - Video HTML5
2. **Iframe Embed** - External player
3. **HLS Stream** - Adaptive bitrate

### Player Logic:
```javascript
if (url.endsWith('.mp4')) {
  // Use HTML5 video tag
  return <video src={url} controls />;
} else {
  // Use iframe embed
  return <iframe src={url} allowfullscreen />;
}
```

---

## 🔒 Security Considerations

### CORS:
- API allows cross-origin requests
- No authentication required
- Public API

### Content Protection:
- URLs may expire
- Server rotation untuk anti-leech
- Multiple hosts untuk availability

---

## 📝 Summary

### Data Source:
✅ **API:** `sankavollerei.com`  
✅ **Type:** REST API  
✅ **Format:** JSON  
✅ **Auth:** None (Public)

### Features:
✅ Anime/Donghua library
✅ Multiple streaming servers
✅ Download links (multiple hosts)
✅ Search & filter
✅ Schedule & recommendations

### Quality:
⚠️ Mixed data (studios in genres)
⚠️ Some empty responses
⚠️ No official documentation
✅ Generally stable
✅ Good coverage

---

**🔍 Investigated by:** Kiro AI Assistant  
**Status:** Complete & Documented
