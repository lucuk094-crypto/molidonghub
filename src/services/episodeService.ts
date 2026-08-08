import moli from "@utils/moli";

interface NewApiEpisode {
  result: {
    durasi: string;
    name: string;
    root: string; // anime slug for All Eps button!
    thumbnail: string;
    tanggal_rilis: string;
    status: string;
    studio: string;
    rating: string;
    season: string;
    sinopsis: string;
    genre: string[];
    tipe: string;
    network?: string;
    negara?: string;
    players: { name: string; url: string }[];
    episode: { episode: string; slug: string; name: string; thumbnail: string; date: string }[];
  };
  source: string;
}

export interface animeEpisode {
  title: string;
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
  
  const result = await moli<NewApiEpisode>(`/episode/${episodeId}`);
  
  if (!result.ok || !result.data || !result.data.result) {
    console.error('[EpisodeService] Failed to fetch:', episodeId);
    return {
      ...result,
      data: {} as animeEpisode
    };
  }
  
  const raw = result.data.result;
  
  // Use root field from API as animeId (perfect for All Eps!)
  const animeId = raw.root || episodeId.split('-episode-')[0];
  
  console.log(`[EpisodeService] Episode: ${episodeId}, Anime ID: ${animeId}`);
  console.log(`[EpisodeService] API provides ${(raw.players || []).length} servers`);
  console.log(`[EpisodeService] Episodes list: ${(raw.episode || []).length} episodes`);

  // Map players to server list
  const serverList = (raw.players || []).map(s => ({
      title: s.name,
      serverId: s.url 
  }));

  // Find current episode index for prev/next navigation
  const episodes = raw.episode || [];
  const currentIndex = episodes.findIndex(e => e.slug === episodeId);
  
  const hasPrevEpisode = currentIndex > 0 && currentIndex < episodes.length;
  const hasNextEpisode = currentIndex >= 0 && currentIndex < episodes.length - 1;
  
  const prevEpisode = hasPrevEpisode ? episodes[currentIndex - 1] : null;
  const nextEpisode = hasNextEpisode ? episodes[currentIndex + 1] : null;

  const mappedData: animeEpisode = {
      title: raw.name || `Episode ${episodeId}`,
      animeId: animeId,
      poster: raw.thumbnail || '/images/placeholder-anime.png',
      releasedOn: raw.tanggal_rilis || 'Unknown',
      defaultStreamingUrl: serverList[0]?.serverId || "",
      server: {
          qualities: [
              {
                  title: "Servers",
                  serverList: serverList
              }
          ]
      },
      hasPrevEpisode,
      prevEpisode: prevEpisode ? {
          title: `Ep ${prevEpisode.episode}`,
          episodeId: prevEpisode.slug
      } : null,
      hasNextEpisode,
      nextEpisode: nextEpisode ? {
          title: `Ep ${nextEpisode.episode}`,
          episodeId: nextEpisode.slug
      } : null,
      downloadUrl: { formats: [] }, // Railway API doesn't provide download links in episode endpoint
      synopsis: { paragraphs: [raw.sinopsis] },
      genreList: (raw.genre || []).map(g => ({
          title: g,
          genreId: g.toLowerCase().replace(/\s+/g, '-')
      })),
      recommendedEpisodeList: [],
      movie: { animeList: [] }
  };

  return { ...result, data: mappedData };
}
