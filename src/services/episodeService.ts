import moli from "@utils/moli";

// Donghub API Episode Response
interface DonghubApiEpisode {
  status: string;
  creator: string;
  source: string;
  data: {
    title: string;
    release_date: string;
    navigation: {
      prev_slug: string | null;
      next_slug: string | null;
      all_slug: string | null; // ⭐ This is the anime ID!
    };
    streams: Array<{
      server: string;
      url: string;
    }>;
    downloads: any[];
    anime_info: {
      title: string;
      slug: string | null;
      thumbnail: string;
      rating: string;
      rating_percentage: string;
      status: string;
      network: string;
      studio: string;
      released: string;
      country: string;
      type: string;
      episodes: string;
      fansub: string;
      genres: Array<{
        name: string;
        url: string;
      }>;
      synopsis: string;
    };
    related_episodes: any[];
    recommended_series: any[];
  };
}

export interface animeEpisode {
  title: string;
  animeTitle: string;
  animeId: string;
  poster: string;
  releasedOn: string;
  defaultStreamingUrl: string;
  server: { qualities: Quality[] };
  hasPrevEpisode: boolean;
  prevEpisode: NavEpisodeLinkCard | null;
  hasNextEpisode: boolean;
  nextEpisode: NavEpisodeLinkCard | null;
  downloadUrl: { formats: Format[] };
  synopsis: Synopsis;
  genreList: GenreLinkCard[];
  recommendedEpisodeList: animeCard5[];
  movie: {
    href?: string;
    samehadakuUrl?: string;
    animeList: animeCard3[];
  };
}

export default async function episodeService(routeParams: {
  episodeId: string;
}) {
  const { episodeId } = routeParams;
  
  // Fallback: Extract anime ID from episode ID
  const extractAnimeId = (epId: string): string => {
    const parts = epId.split('-episode-');
    if (parts.length > 1) {
      return parts[0];
    }
    const match = epId.match(/^(.+?)-\d+$/);
    return match ? match[1] : epId;
  };
  
  try {
    const result = await moli<DonghubApiEpisode>(`/episode/${episodeId}`);
    
    if (!result.ok || !result.data?.data) {
      console.error('[EpisodeService] Failed to fetch:', episodeId);
      return {
        ok: false,
        statusCode: result.statusCode || 500,
        message: "Episode not found",
        data: {} as animeEpisode,
        pagination: null
      };
    }
    
    const raw = result.data.data;
    
    // Use navigation.all_slug first, fallback to extraction
    const animeId = raw.navigation?.all_slug || extractAnimeId(episodeId);
    
    console.log(`[EpisodeService] Episode: ${episodeId}`);
    console.log(`[EpisodeService] Anime ID: ${animeId}`);
    console.log(`[EpisodeService] Streams: ${raw.streams?.length || 0}`);

    // Map servers from streams array
    const serverList = (raw.streams || []).map((s, index) => ({
        title: s.server || `Server ${index + 1}`,
        serverId: s.url 
    }));

    // Map download links
    const formats: Format[] = [];
    if (raw.downloads && Array.isArray(raw.downloads)) {
        raw.downloads.forEach((download: any) => {
            if (download && typeof download === 'object') {
                formats.push({
                    title: download.quality || "Download",
                    qualities: [{
                        title: download.quality || "Default",
                        urls: [{
                            title: download.provider || "Direct",
                            url: download.url || ""
                        }]
                    }]
                });
            }
        });
    }

    const mappedData: animeEpisode = {
        title: raw.title || `Episode ${episodeId}`,
        animeTitle: raw.anime_info?.title || 'Unknown Anime',
        animeId: animeId,
        poster: raw.anime_info?.thumbnail || '/images/placeholder-anime.png',
        releasedOn: raw.release_date || 'Unknown',
        defaultStreamingUrl: serverList[0]?.serverId || "",
        server: {
            qualities: [
                {
                    title: "Servers",
                    serverList: serverList
                }
            ]
        },
        hasPrevEpisode: !!raw.navigation?.prev_slug,
        prevEpisode: raw.navigation?.prev_slug ? {
            title: "Previous Episode",
            episodeId: raw.navigation.prev_slug
        } : null,
        hasNextEpisode: !!raw.navigation?.next_slug,
        nextEpisode: raw.navigation?.next_slug ? {
            title: "Next Episode",
            episodeId: raw.navigation.next_slug
        } : null,
        downloadUrl: { formats },
        synopsis: { 
            paragraphs: raw.anime_info?.synopsis ? [raw.anime_info.synopsis] : []
        },
        genreList: (raw.anime_info?.genres || []).map(g => ({
            title: g.name,
            genreId: g.name.toLowerCase().replace(/\s+/g, '-')
        })),
        recommendedEpisodeList: [],
        movie: { animeList: [] }
    };

    return { 
      ...result, 
      data: mappedData,
      ok: true,
      statusCode: 200
    };
  } catch (error) {
    console.error('[EpisodeService] Error:', error);
    
    // Fallback for extraction
    const animeId = extractAnimeId(episodeId);
    
    return {
      ok: false,
      statusCode: 500,
      message: `Failed to fetch episode: ${error}`,
      data: {
        title: `Episode ${episodeId}`,
        animeTitle: 'Unknown',
        animeId: animeId,
        poster: '/images/placeholder-anime.png',
        releasedOn: 'Unknown',
        defaultStreamingUrl: "",
        server: { qualities: [] },
        hasPrevEpisode: false,
        prevEpisode: null,
        hasNextEpisode: false,
        nextEpisode: null,
        downloadUrl: { formats: [] },
        synopsis: { paragraphs: [] },
        genreList: [],
        recommendedEpisodeList: [],
        movie: { animeList: [] }
      } as animeEpisode,
      pagination: null
    };
  }
}
