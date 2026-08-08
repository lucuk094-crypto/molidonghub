import moli from "@utils/moli";
import { hybridFetch, mergeServers } from "@utils/hybridApi";

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

// Anichin API response format
interface AnichinEpisode {
  episode: string;
  video_sources?: Array<{
    name: string;
    url: string;
    quality?: string;
  }>;
  streaming_urls?: {
    default?: string;
    servers?: Array<{ name: string; url: string }>;
  };
  download?: any;
  anime_info?: {
    title: string;
    slug: string;
    poster?: string;
  };
  navigation?: {
    prev?: { slug: string; title: string };
    next?: { slug: string; title: string };
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
  sources?: string[]; // Track which APIs provided data
}

/**
 * Enhanced episode service with hybrid API support
 * Merges data from multiple sources for better coverage and backup servers
 */
export default async function hybridEpisodeService(routeParams: {
  episodeId: string;
}) {
  const { episodeId } = routeParams;
  
  console.log(`[HybridEpisode] Fetching episode: ${episodeId}`);
  
  // Try primary API first (sankavollerei)
  const primaryResult = await moli<NewApiEpisode>(`/episode/${episodeId}`);
  
  let allServers: Array<{ title: string; serverId: string }> = [];
  let allDownloadFormats: Format[] = [];
  let episodeData: animeEpisode;
  const sources: string[] = [];

  // Process primary source (sankavollerei)
  if (primaryResult.ok && primaryResult.data) {
    sources.push("sankavollerei");
    const raw = primaryResult.data;
    const details = raw.donghua_details || {};

    // Collect servers from primary source
    const primaryServers = (raw.streaming?.servers || []).map(s => ({
        title: `${s.name} (Primary)`,
        serverId: s.url 
    }));

    if (raw.streaming?.main_url) {
        primaryServers.unshift({
            title: `${raw.streaming.main_url.name} (Main)`,
            serverId: raw.streaming.main_url.url
        });
    }

    allServers = [...primaryServers];

    // Collect download links from primary
    if (raw.download_url) {
        for (const [key, val] of Object.entries(raw.download_url)) {
              const title = key.replace('download_url_', '');
              const urls = [];
              if (typeof val === 'object' && val !== null) {
                   for (const [host, link] of Object.entries(val)) {
                       urls.push({ title: host, url: link as string });
                   }
              }
              allDownloadFormats.push({
                  title: title,
                  qualities: [{ title: title, urls: urls }]
              });
        }
    }

    // Build base episode data
    episodeData = {
        title: raw.episode || `Episode ${episodeId}`,
        animeTitle: details.title || 'Unknown Anime',
        animeId: details.slug || episodeId.split('-episode-')[0],
        poster: details.poster || '/images/placeholder-anime.png',
        releasedOn: details.released || 'Unknown',
        defaultStreamingUrl: raw.streaming?.main_url?.url || "",
        server: {
            qualities: [
                {
                    title: "Servers",
                    serverList: allServers
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
        downloadUrl: { formats: allDownloadFormats },
        synopsis: { paragraphs: [] },
        genreList: [],
        recommendedEpisodeList: [],
        movie: { animeList: [] },
        sources: sources
    };
  } else {
    // Primary failed, create empty structure
    episodeData = {
        title: `Episode ${episodeId}`,
        animeTitle: 'Unknown',
        animeId: episodeId.split('-episode-')[0],
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
        movie: { animeList: [] },
        sources: sources
    };
  }

  // Try to get additional servers from Anichin API (fallback/merge)
  try {
    console.log(`[HybridEpisode] Trying anichin API for additional servers...`);
    
    const anichinResult = await hybridFetch<AnichinEpisode>(
      `/episode/${episodeId}`,
      { preferredSource: "anichin", retryOnFail: false }
    );

    if (anichinResult.ok && anichinResult.data) {
      sources.push("anichin");
      const anichinData = anichinResult.data;
      
      // Merge servers from anichin
      const anichinServers: Array<{ title: string; serverId: string }> = [];
      
      if (anichinData.streaming_urls?.servers) {
        anichinData.streaming_urls.servers.forEach(s => {
          anichinServers.push({
            title: `${s.name} (Backup)`,
            serverId: s.url
          });
        });
      }

      if (anichinData.video_sources) {
        anichinData.video_sources.forEach(source => {
          anichinServers.push({
            title: `${source.name}${source.quality ? ' - ' + source.quality : ''} (Anichin)`,
            serverId: source.url
          });
        });
      }

      // Add backup default if primary failed
      if (!episodeData.defaultStreamingUrl && anichinData.streaming_urls?.default) {
        episodeData.defaultStreamingUrl = anichinData.streaming_urls.default;
      }

      // Merge all servers (remove duplicates by URL)
      const serverMap = new Map<string, { title: string; serverId: string }>();
      
      [...allServers, ...anichinServers].forEach(server => {
        if (!serverMap.has(server.serverId)) {
          serverMap.set(server.serverId, server);
        }
      });

      allServers = Array.from(serverMap.values());
      
      console.log(`[HybridEpisode] Merged ${allServers.length} total servers`);
    }
  } catch (error) {
    console.warn(`[HybridEpisode] Anichin API failed, using primary only:`, error);
  }

  // Update episode data with all merged servers
  episodeData.server = {
    qualities: [
      {
        title: "All Servers",
        serverList: allServers
      }
    ]
  };
  
  episodeData.sources = sources;

  return {
    ...primaryResult,
    data: episodeData,
    ok: allServers.length > 0, // Success if we have at least one server
    message: sources.length > 0 
      ? `Data from: ${sources.join(', ')}` 
      : "No data available"
  };
}
