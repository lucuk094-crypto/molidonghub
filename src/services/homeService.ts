import moli from "@utils/moli";

interface NewApiHome {
  latest_release: any[];
  completed_donghua: any[];
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
  const result = await moli<NewApiHome>("/home/1");
  
  const recentList: animeCard1[] = (result.data.latest_release || [])
    .filter((item) => item && item.slug && item.title && item.poster)
    .map((item) => {
      const eps = (item.current_episode || "??").replace(/Ep\s*/i, "").trim();
      
      return {
        title: item.title,
        poster: item.poster || '/images/placeholder-anime.png',
        episodes: eps, 
        releasedOn: "Baru",
        animeId: item.slug, 
        href: `/episode/${item.slug}`
      };
  });

  const completedList: animeCard1[] = (result.data.completed_donghua || [])
    .filter((item) => item && item.slug && item.title && item.poster)
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
      
      return {
        title: item.title,
        poster: item.poster || '/images/placeholder-anime.png',
        episodes: "END",
        releasedOn: "Tamat",
        batchId: cleanSlug, 
        animeId: cleanSlug,
        href: `/anime/${cleanSlug}`
      };
  });

  const movieList: animeCard3[] = []; 

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

  return { ...result, data: mappedData };
}
