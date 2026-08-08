import moli from "@utils/moli";

interface NewApiEpisode {
  episode: string;
  streaming: {
    main_url: { name: string; url: string };
    servers: { name: string; url: string }[];
  };
  download_url: any;
  donghua_details: {
    title: string;
    slug: string;
    poster: string;
    released: string;
  };
  navigation: {
      previous_episode?: { slug: string; episode: string };
      next_episode?: { slug: string; episode: string };
  };
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
  
  // Extract anime ID from episode ID as fallback
  const extractAnimeId = (epId: string): string => {
    // Remove "-episode-123" or "-123" suffix
    const parts = epId.split('-episode-');
    if (parts.length > 1) {
      return parts[0];
    }
    // Fallback: remove last dash and number
    const match = epId.match(/^(.+?)-\d+$/);
    return match ? match[1] : epId;
  };
  
  const result = await moli<NewApiEpisode>(`/episode/${episodeId}`);
  
  if (!result.ok || !result.data) {
    console.error('[EpisodeService] Failed to fetch:', episodeId);
    return result;
  }
  
  const raw = result.data;
  const details = raw.donghua_details || {};
  
  // Use API slug if available, otherwise extract from episodeId
  const animeId = details.slug || extractAnimeId(episodeId);
  
  console.log(`[EpisodeService] Episode: ${episodeId}, Anime ID: ${animeId}`);

  const serverList = (raw.streaming?.servers || []).map(s => ({
      title: s.name,
      serverId: s.url 
  }));

  if (raw.streaming?.main_url) {
      serverList.unshift({
          title: raw.streaming.main_url.name,
          serverId: raw.streaming.main_url.url
      });
  }

  const formats: Format[] = [];
  if (raw.download_url) {
      for (const [key, val] of Object.entries(raw.download_url)) {
            const title = key.replace('download_url_', '');
            const urls = [];
            if (typeof val === 'object' && val !== null) {
                 for (const [host, link] of Object.entries(val)) {
                     urls.push({ title: host, url: link as string });
                 }
            }
            formats.push({
                title: title,
                qualities: [{ title: title, urls: urls }]
            });
      }
  }

  const mappedData: animeEpisode = {
      title: raw.episode || `Episode ${episodeId}`,
      animeId: animeId,
      poster: details.poster || '/images/placeholder-anime.png',
      releasedOn: details.released || 'Unknown',
      defaultStreamingUrl: raw.streaming?.main_url?.url || "",
      server: {
          qualities: [
              {
                  title: "Servers",
                  serverList: serverList
              }
          ]
      },
      hasPrevEpisode: !!raw.navigation?.previous_episode,
      prevEpisode: raw.navigation?.previous_episode ? {
          title: raw.navigation.previous_episode.episode,
          episodeId: raw.navigation.previous_episode.slug
      } : null,
      hasNextEpisode: !!raw.navigation?.next_episode,
      nextEpisode: raw.navigation?.next_episode ? {
          title: raw.navigation.next_episode.episode,
          episodeId: raw.navigation.next_episode.slug
      } : null,
      downloadUrl: { formats },
      synopsis: { paragraphs: [] },
      genreList: [],
      recommendedEpisodeList: [],
      movie: { animeList: [] }
  };

  return { ...result, data: mappedData };
}
