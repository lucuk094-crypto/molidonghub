import moli from "@utils/moli";

interface NewApiDetail {
  title: string;
  alter_title: string;
  poster: string;
  rating: string;
  studio: string;
  released: string;
  duration: string;
  episodes_count: string;
  season: string;
  type: string;
  status: string;
  genres: { name: string; slug: string; url: string }[];
  synopsis: string;
  episodes_list: { episode: string; slug: string; url: string }[];
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
    const result = await moli<NewApiDetail>(`/detail/${animeId}`);
    
    if (!result.ok || !result.data) {
      console.error('[AnimeInfo] Failed to fetch:', result);
      return result;
    }
    
    const raw = result.data;

    const mappedData: AnimeDetails = {
        title: raw?.title || "Unknown Title",
        poster: raw?.poster || "/images/placeholder-anime.png",
        score: { value: raw?.rating || "N/A", users: "" },
        japanese: raw?.alter_title || raw?.title || "Unknown",
        synonyms: raw?.alter_title || raw?.title || "Unknown",
        english: raw?.title || "Unknown",
        status: raw?.status || "Unknown",
        type: raw?.type || "Unknown",
        source: "Original",
        duration: raw?.duration || "Unknown",
        episodes: parseInt(raw?.episodes_count) || null,
        season: raw?.season || "Unknown",
        studios: raw?.studio || "Unknown",
        producers: "",
        aired: raw?.released || "Unknown",
        trailer: "",
        batchList: [],
        synopsis: {
            paragraphs: raw?.synopsis ? [raw.synopsis] : ["No synopsis available."],
            connections: []
        },
        genreList: (raw?.genres || []).map(g => ({
            title: g?.name || "Unknown",
            genreId: g?.slug || ""
        })).filter(g => g.genreId),
        episodeList: (raw?.episodes_list || [])
            .filter(e => e && e.slug)
            .map(e => {
                try {
                    const match = e.episode?.match(/Episode\s+(\d+(\.\d+)?)/i);
                    
                    let displayTitle = e.episode || "Episode"; 

                    if (match) {
                        displayTitle = `Ep ${match[1]}`;
                    } else if (e.slug) {
                        const slugParts = e.slug.split('-');
                        const numIndex = slugParts.indexOf('episode');
                        if (numIndex !== -1 && slugParts[numIndex + 1] && /^\d+$/.test(slugParts[numIndex + 1])) {
                            displayTitle = `Ep ${slugParts[numIndex + 1]}`;
                        }
                    }

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
            .reverse()
    };

    return { ...result, data: mappedData };
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
