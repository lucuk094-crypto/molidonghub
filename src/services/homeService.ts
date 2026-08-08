import moli from "@utils/moli";

interface NewApiHome {
  page: number;
  results: Array<{
    section: string;
    cards: Array<{
      eps: number | null;
      headline: string;
      slug: string;
      status: string;
      thumbnail: string;
      title: string;
      type: string;
    }>;
  }>;
  source: string;
  total: number;
}

interface Home {
  recent: {
    href?: string;
    samehadakuUrl?: string;
    animeList: animeCard1[];
  };
  batch: {
    href?: string;
    samehadakuUrl?: string;
    batchList: animeCard1[];
  };
  movie: {
    href?: string;
    samehadakuUrl?: string;
    animeList: animeCard3[];
  };
}

export default async function homeService() {
  const result = await moli<NewApiHome>("/");
  
  if (!result.ok || !result.data || !result.data.results) {
    console.error('[HomeService] Failed to fetch home data');
    return {
      ...result,
      data: {
        recent: { animeList: [] },
        batch: { batchList: [] },
        movie: { animeList: [] }
      }
    };
  }

  // Find sections from Railway API
  const popularSection = result.data.results.find(s => s.section === "terpopuler_hari_ini");
  const latestSection = result.data.results.find(s => s.section === "rilisan_terbaru");
  const movieSection = result.data.results.find(s => s.section === "movie");

  // Map latest releases (rilisan_terbaru)
  const recentList: animeCard1[] = (latestSection?.cards || [])
    .filter((item) => item && item.slug && item.title && item.thumbnail)
    .map((item) => {
      // Extract episode number from status "Ep 123Sub"
      const epsMatch = item.status.match(/Ep\s*(\d+)/i);
      const eps = epsMatch ? epsMatch[1] : "??";
      
      return {
        title: item.title,
        poster: item.thumbnail || '/images/placeholder-anime.png',
        episodes: eps, 
        releasedOn: "Baru",
        animeId: item.slug, 
        href: `/episode/${item.slug}`
      };
  });

  // Map popular as completed/batch
  const completedList: animeCard1[] = (popularSection?.cards || [])
    .filter((item) => item && item.slug && item.title && item.thumbnail)
    .map((item) => {
      // Extract clean slug - remove episode suffix if exists
      let cleanSlug = item.slug;
      
      // If slug contains "episode", extract anime slug
      if (cleanSlug && cleanSlug.includes('-episode-')) {
        const parts = cleanSlug.split('-episode-');
        cleanSlug = parts[0];
      }
      
      // Remove any trailing episode numbers
      cleanSlug = cleanSlug.replace(/-episode-\d+$/i, '');
      
      // Check if completed
      const isCompleted = item.status.toLowerCase().includes('end') || 
                         item.status.toLowerCase().includes('tamat');
      
      return {
        title: item.title,
        poster: item.thumbnail || '/images/placeholder-anime.png',
        episodes: isCompleted ? "END" : (item.eps?.toString() || "??"),
        releasedOn: isCompleted ? "Tamat" : "Ongoing",
        batchId: cleanSlug, 
        animeId: cleanSlug,
        href: `/anime/${cleanSlug}`
      };
  });

  // Map movies
  const movieList: animeCard3[] = (movieSection?.cards || [])
    .filter((item) => item && item.slug && item.title && item.thumbnail)
    .map((item) => ({
      title: item.title,
      poster: item.thumbnail || '/images/placeholder-anime.png',
      animeId: item.slug,
      href: `/episode/${item.slug}`
    }));

  const mappedData: Home = {
      recent: {
          animeList: recentList
      },
      batch: {
          batchList: completedList
      },
      movie: {
          animeList: movieList
      }
  };

  console.log(`[HomeService] Recent: ${recentList.length}, Completed: ${completedList.length}, Movies: ${movieList.length}`);

  return { ...result, data: mappedData };
}
