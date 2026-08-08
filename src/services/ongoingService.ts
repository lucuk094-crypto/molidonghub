import moli from "@utils/moli";

interface NewApiOngoing {
    ongoing_donghua: any[];
}

interface animes {
  animeList: animeCard2[];
}

export default async function ongoingService(queryParam: {
  page?: string | number | null;
} = {}) {
  const { page } = queryParam;
  
  // Railway API uses /anime endpoint with status parameter
  const result = await moli<any>(`/anime?status=ongoing&page=${page || 1}`);

  // Handle both old and new API formats
  const items = result.data.ongoing_donghua || result.data.result || result.data.data || [];

  const animeList: animeCard2[] = items
    .filter((item: any) => {
      // Filter out invalid items
      return item && item.slug && item.title && (item.poster || item.thumbnail);
    })
    .map((item: any) => {
      // Extract clean slug - remove episode suffix if exists
      let cleanSlug = item.slug;
      
      // If slug contains "episode", extract anime slug
      // Example: "anime-title-episode-1" -> "anime-title"
      if (cleanSlug && cleanSlug.includes('-episode-')) {
        const parts = cleanSlug.split('-episode-');
        cleanSlug = parts[0];
      }
      
      // Remove any trailing numbers that might be episode numbers
      cleanSlug = cleanSlug.replace(/-episode-\d+$/i, '');
      
      return {
        title: item.title || 'Unknown',
        poster: item.poster || item.thumbnail || '/images/placeholder-anime.png',
        status: item.status || 'Ongoing',
        type: "anime",
        score: item.rating || "N/A",
        animeId: cleanSlug,
        href: `/anime/${cleanSlug}`,
        genreList: []
      };
    });

  console.log(`[OngoingService] Loaded ${animeList.length} ongoing anime`);

  return { ...result, data: { animeList } };
}