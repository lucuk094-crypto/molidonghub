import moli from "@utils/moli";

interface NewApiGenre {
    data: { name: string; slug: string; url: string }[];
}

interface AllGenres {
  genreList: GenreLinkCard[];
}

// Blacklist - genres that definitely don't have data
const BLOCKED_GENRES = [
  'triopen-studio', 'studio', 'production', 'company',
  'network', 'tv', 'channel', 'media', 'entertainment',
  'original', 'adaptation', 'collab', 'collaboration',
  // Add more as you find them
];

// Whitelist - confirmed working genres
const ALLOWED_GENRES = [
  // Common genres
  'action', 'adventure', 'comedy', 'drama', 'fantasy', 'romance',
  'school', 'supernatural', 'martial-arts', 'historical', 'mystery',
  'sci-fi', 'slice-of-life', 'thriller', 'horror', 'sports',
  
  // Donghua-specific
  'xianxia', 'xuanhuan', 'wuxia', 'cultivation', 'reincarnation',
  'isekai', 'magic', 'demons', 'gods', 'system', 'overpowered',
  
  // Years
  '2020', '2021', '2022', '2023', '2024', '2025', '2026',
];

export default async function genreService() {
  const result = await moli<NewApiGenre>("/genres");

  const genreList: GenreLinkCard[] = (result.data.data || [])
    .filter((item) => {
      // Basic validation
      if (!item.name || !item.slug || item.slug.trim().length === 0) {
        return false;
      }
      
      // Remove error indicators
      const nameLower = item.name.toLowerCase();
      const slugLower = item.slug.toLowerCase().trim();
      
      if (nameLower.includes('error') || 
          nameLower.includes('not found') ||
          nameLower.includes('undefined') ||
          nameLower.includes('null')) {
        return false;
      }
      
      // Check blacklist first (priority)
      const isBlocked = BLOCKED_GENRES.some(blocked => 
        slugLower.includes(blocked.toLowerCase()) ||
        nameLower.includes(blocked.toLowerCase())
      );
      
      if (isBlocked) {
        console.log(`[Genre Filter] BLOCKED: "${item.name}" (${item.slug})`);
        return false;
      }
      
      // Check whitelist
      const isAllowed = ALLOWED_GENRES.some(allowed => {
        const allowedLower = allowed.toLowerCase();
        return slugLower === allowedLower || 
               slugLower.includes(allowedLower) || 
               allowedLower.includes(slugLower);
      });
      
      // Allow year patterns (2020-2026)
      const isYear = /^(202[0-6])$/i.test(slugLower) || /^\d{4}$/.test(item.name);
      
      // Allow season-year patterns
      const isSeason = /^(spring|summer|fall|winter)[-\s]?(202[0-6])?$/i.test(slugLower) ||
                      /^(spring|summer|fall|winter)[-\s]?\d{4}$/i.test(item.name);
      
      // Only include if whitelisted OR is a year/season
      if (!isAllowed && !isYear && !isSeason) {
        console.log(`[Genre Filter] Not whitelisted: "${item.name}" (${item.slug})`);
        return false;
      }
      
      return true;
    })
    .map((item) => ({
      title: item.name.trim(),
      genreId: item.slug.trim()
    }));

  console.log(`[Genre Service] ✅ Loaded ${genreList.length} valid genres`);
  
  return { ...result, data: { genreList } };
}
