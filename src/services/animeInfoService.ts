import moli from "@utils/moli";

// Donghub API Response Structure
interface DonghubApiDetail {
  status: string;
  creator: string;
  source: string;
  data: {
    title: string;
    poster: string;
    rating: string;
    synopsis: string;
    info: {
      status: string;
      network: string;
      studio: string;
      released: string;
      country: string;
      type: string;
      episodes: string;
      fansub: string;
      casts: string;
      released_on: string;
      updated_on: string;
    };
    genres: Array<{
      name: string;
      slug: string;
      url: string;
    }>;
    batch_link: any;
    episodes: Array<{
      episode: string;
      title: string;
      slug: string;
      date: string;
      url: string;
    }>;
    recommendations: Array<{
      title: string;
      slug: string;
      poster: string;
      episode: string;
      type: string;
      status: string;
      sub: string;
      release_time: string | null;
      url: string;
    }>;
  };
}

interface AnimeDetails {
  title: string;
  poster: string;
  score: { value: string; users: string };
  japanese: string;
  synonyms: string;
  english: string;
  status: string;
  type: string;
  source: string;
  duration: string;
  episodes: number | null;
  season: string;
  studios: string;
  producers: string;
  aired: string;
  trailer: string;
  batchList: BatchLinkCard[];
  synopsis: Synopsis;
  genreList: GenreLinkCard[];
  episodeList: EpisodeLinkCard[];
}

export default async function animeInfoService(routeParams: {
  animeId: string;
}) {
  const { animeId } = routeParams;
  
  try {
    const result = await moli<DonghubApiDetail>(`/detail/${animeId}`);
    
    if (!result.ok || !result.data?.data) {
      console.error('[AnimeInfo] Failed to fetch:', animeId);
      return {
        ok: false,
        statusCode: result.statusCode || 500,
        statusMessage: "Failed to fetch anime",
        message: "Anime not found",
        data: {} as AnimeDetails,
        pagination: null
      };
    }
    
    const raw = result.data.data;

    const mappedData: AnimeDetails = {
        title: raw.title || "Unknown Title",
        poster: raw.poster || "/images/placeholder-anime.png",
        score: { 
          value: raw.rating || raw.info?.status || "N/A", 
          users: "" 
        },
        japanese: raw.title || "Unknown",
        synonyms: raw.title || "Unknown",
        english: raw.title || "Unknown",
        status: raw.info?.status || "Unknown",
        type: raw.info?.type || "Unknown",
        source: "Original",
        duration: "Unknown",
        episodes: parseInt(raw.info?.episodes) || null,
        season: raw.info?.released || "Unknown",
        studios: raw.info?.studio || "Unknown",
        producers: raw.info?.network || "Unknown",
        aired: raw.info?.released || "Unknown",
        trailer: "",
        batchList: [],
        synopsis: {
            paragraphs: raw.synopsis ? [raw.synopsis] : ["No synopsis available."],
            connections: []
        },
        genreList: (raw.genres || []).map(g => ({
            title: g.name || "Unknown",
            genreId: g.slug || ""
        })).filter(g => g.genreId),
        episodeList: (raw.episodes || [])
            .filter(e => e && e.slug)
            .map(e => {
                try {
                    // Extract episode number from episode field or title
                    const match = e.episode?.match(/(\d+(\.\d+)?)/);
                    const displayTitle = match ? `Ep ${match[1]}` : (e.episode || "Episode");

                    return {
                        title: displayTitle, 
                        episodeId: e.slug, 
                    };
                } catch (err) {
                    console.error('Error mapping episode:', e, err);
                    return null;
                }
            })
            .filter((e): e is EpisodeLinkCard => e !== null)
            .reverse() // Reverse to show latest first
    };

    console.log(`[AnimeInfo] ${raw.title}: ${mappedData.episodeList.length} episodes`);

    return { 
      ...result, 
      data: mappedData,
      ok: true,
      statusCode: 200
    };
  } catch (error) {
    console.error('[AnimeInfo] Service error:', error);
    return {
      ok: false,
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: `Failed to fetch anime info: ${error}`,
      data: {} as AnimeDetails,
      pagination: null
    };
  }
}
