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
  const result = await moli<NewApiOngoing>(`/ongoing/${page || 1}`);

  const animeList: animeCard2[] = (result.data.ongoing_donghua || [])
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
      // But keep if it's part of anime title (like "86-eighty-six")
      cleanSlug = cleanSlug.replace(/-episode-\d+$/i, '');
      
      return {
        title: item.title || 'Unknown',
        poster: item.poster || '/images/placeholder-anime.png',
        status: item.status || 'Ongoing',
        type: "anime",
        score: "N/A",
        animeId: cleanSlug,
        href: `/anime/${cleanSlug}`,
        genreList: []
      };
    });

  return { ...result, data: { animeList } };
}