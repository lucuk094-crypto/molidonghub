import moli from "@utils/moli";

interface NewApiDetail {
  result: {
    name: string;
    thumbnail: string;
    rating: string;
    studio: string;
    network?: string;
    tanggal_rilis: string;
    durasi: string;
    tipe: string;
    negara?: string;
    diposting_oleh?: string;
    ditambahkan?: string;
    diperbarui_pada?: string;
    status: string;
    season: string;
    genre: string[];
    sinopsis: { paragraphs: string[]; title: string };
    episode: { episode: string; slug: string; subtitle: string; thumbnail: string; date: string }[];
  };
  source: string;
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
    const result = await moli<NewApiDetail>(`/${animeId}`);
    
    if (!result.ok || !result.data || !result.data.result) {
      console.error('[AnimeInfo] Failed to fetch:', result);
      return {
        ...result,
        data: {} as AnimeDetails
      };
    }
    
    const raw = result.data.result;

    console.log(`[AnimeInfo] Title: ${raw?.name}`);
    console.log(`[AnimeInfo] Episodes: ${(raw?.episode || []).length}`);
    console.log(`[AnimeInfo] Status: ${raw?.status}`);

    // Extract episode count from episodes array
    const episodesCount = (raw?.episode || []).length;

    const mappedData: AnimeDetails = {
        title: raw?.name || "Unknown Title",
        poster: raw?.thumbnail || "/images/placeholder-anime.png",
        score: { value: raw?.rating || "N/A", users: "" },
        japanese: raw?.name || "Unknown",
        synonyms: raw?.name || "Unknown",
        english: raw?.name || "Unknown",
        status: raw?.status || "Unknown",
        type: raw?.tipe || "Unknown",
        source: "Original",
        duration: raw?.durasi || "Unknown",
        episodes: episodesCount || null,
        season: raw?.season || "Unknown",
        studios: raw?.studio || "Unknown",
        producers: raw?.network || "",
        aired: raw?.tanggal_rilis || raw?.ditambahkan || "Unknown",
        trailer: "",
        batchList: [],
        synopsis: {
            paragraphs: raw?.sinopsis?.paragraphs || ["No synopsis available."],
            connections: []
        },
        genreList: (raw?.genre || []).map(g => ({
            title: g,
            genreId: g.toLowerCase().replace(/\s+/g, '-')
        })),
        episodeList: (raw?.episode || [])
            .filter(e => e && e.slug)
            .map(e => {
                try {
                    const epNum = e.episode.trim();
                    const displayTitle = `Ep ${epNum}`;

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

    console.log(`[AnimeInfo] Mapped ${mappedData.episodeList.length} episodes`);

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
