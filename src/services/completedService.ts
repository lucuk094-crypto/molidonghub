import moli from "@utils/moli";

interface NewApiCompleted {
    completed_donghua: any[];
}

interface animes {
  animeList: animeCard2[];
}

export default async function completedService(queryParam: {
  page?: string | number | null;
} = {}) {
  const { page } = queryParam;
  const result = await moli<NewApiCompleted>(`/completed/${page || 1}`);

  const animeList: animeCard2[] = (result.data.completed_donghua || [])
    .filter((item) => {
      // Filter out invalid items
      return item && item.slug && item.title && item.poster;
    })
    .map((item) => {
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
        poster: item.poster || '/images/placeholder-anime.png',
        status: item.status || 'Completed',
        type: item.type || "anime",
        score: "N/A",
        animeId: cleanSlug,
        href: `/anime/${cleanSlug}`,
        genreList: []
      };
    });

  return { ...result, data: { animeList } };
}