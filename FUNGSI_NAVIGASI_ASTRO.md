# 🚀 Fungsi Navigasi Astro

## ❓ Apa itu Navigasi Astro?

**Navigasi Astro** mengacu pada sistem routing dan navigasi built-in di Astro Framework.

---

## 📁 File-Based Routing

### Cara Kerja:
Astro menggunakan **file-based routing** - struktur folder di `src/pages/` otomatis menjadi route URL.

### Contoh:
```
src/pages/
├── index.astro          → /
├── about.astro          → /about
├── anime/
│   ├── index.astro      → /anime
│   └── [animeId]/
│       └── index.astro  → /anime/:animeId (dynamic)
├── episode/
│   └── [episodeId]/
│       └── index.astro  → /episode/:episodeId
└── genres/
    ├── index.astro      → /genres
    └── [genreId]/
        └── index.astro  → /genres/:genreId
```

---

## 🔀 Dynamic Routes

### Bracket Notation `[param]`:
File dengan nama dalam `[brackets]` adalah dynamic route.

### Contoh di Projek Ini:
```astro
// src/pages/anime/[animeId]/index.astro
const { animeId } = Astro.params;  // Ambil parameter dari URL
```

**URL:** `/anime/demon-slayer`  
**animeId:** `"demon-slayer"`

---

## 🧭 Astro.url

### Properties:
```typescript
Astro.url.pathname  // Current path: "/anime/123"
Astro.url.origin    // Origin: "http://localhost:4321"
Astro.url.href      // Full URL
Astro.url.searchParams  // Query parameters
```

### Penggunaan di Navbar:
```astro
{navLinks.map((link) => {
  if (link.href === Astro.url.pathname) {
    // Link aktif - tambah class "active"
    return <a class="navbar-link-item active">{link.title}</a>
  }
  return <a class="navbar-link-item">{link.title}</a>
})}
```

---

## 🔗 Link Navigation

### Tag `<a>`:
Astro menggunakan standard HTML `<a>` tags untuk navigasi.

### Client-Side Navigation:
Astro secara otomatis menggunakan **View Transitions** untuk smooth navigation (jika enabled).

### Contoh:
```astro
<a href="/anime">Anime List</a>  // Server navigation
<a href={`/anime/${animeId}`}>Detail</a>  // Dynamic link
```

---

## 🎯 Active Link Detection

### Manual Check:
```astro
const isActive = Astro.url.pathname === link.href;
```

### Conditional Class:
```astro
<a 
  href={link.href}
  class={isActive ? "navbar-link-item active" : "navbar-link-item"}
>
  {link.title}
</a>
```

---

## 📡 API Routes

### Endpoint Files:
File `.ts` di `src/pages/api/` menjadi API endpoints.

### Contoh di Projek:
```typescript
// src/pages/api/server/[serverId]/index.ts
export const POST: APIRoute = async ({ params }) => {
  const { serverId } = params;
  // Handle request
  return new Response(JSON.stringify(data));
};
```

**URL:** `POST /api/server/123`

---

## 🔄 Redirect

### Server-Side Redirect:
```astro
---
if (!user) {
  return Astro.redirect("/login");
}
---
```

### Client-Side Redirect:
```javascript
location.href = `/search?q=${query}`;
```

---

## 🌐 Query Parameters

### Reading Params:
```astro
---
const q = Astro.url.searchParams.get("q");
const page = Astro.url.searchParams.get("page");
---
```

**URL:** `/search?q=naruto&page=2`  
**q:** `"naruto"`  
**page:** `"2"`

---

## 🎨 Navigasi di Projek Ini

### 1. **Main Navigation (Navbar)**
```astro
navLinks = [
  { title: "Home", href: "/" },
  { title: "Ongoing", href: "/ongoing" },
  { title: "Completed", href: "/completed" },
  { title: "History", href: "/history" },
]
```

### 2. **Dynamic Anime Routes**
- `/anime/[animeId]` - Detail anime
- `/episode/[episodeId]` - Streaming page
- `/batch/[batchId]` - Batch download
- `/genres/[genreId]` - Anime by genre

### 3. **Search Navigation**
```javascript
// Di form search
location.href = `/search?q=${inputValue}`;
```

### 4. **Pagination**
```astro
<a href={`?page=${nextPage}`}>Next</a>
```

---

## ⚡ Performance

### Pre-rendering (SSG):
Astro pre-renders static pages at build time.

### Server-Side Rendering (SSR):
Dynamic pages rendered on-demand (configured in `astro.config.mjs`).

### Projek Config:
```javascript
// astro.config.mjs
export default defineConfig({
  output: "server",  // SSR mode
  adapter: node(),
});
```

---

## 🛠️ Utility Functions

### generateUrlPath:
```typescript
// src/utils/generateUrlPath.ts
export default function generateUrlPath(...paths: string[]): string {
  const joinedPath = path.join(...paths);
  return joinedPath.replace(/\\/g, "/");
}
```

**Usage:**
```astro
<a href={generateUrlPath("/anime", animeId)}>
  {anime.title}
</a>
```

---

## 📝 Summary

### Navigasi Astro = Kombinasi:
1. **File-based routing** → Auto route generation
2. **Dynamic parameters** → `[param]` syntax
3. **Astro.url** → Access URL info
4. **Standard `<a>` tags** → HTML navigation
5. **API routes** → Backend endpoints
6. **Query params** → Search & filtering

### Keuntungan:
✅ Simple & intuitive
✅ Type-safe with TypeScript
✅ Automatic code splitting
✅ Fast page transitions
✅ SEO friendly

---

**📚 Dokumentasi:** https://docs.astro.build/en/core-concepts/routing/
