// Global Type Definitions

// Link Card Types
declare global {
  interface animeLinkCard {
    title: string;
    animeId: string;
    poster?: string;
    status?: string;
    rating?: string;
    type?: string;
  }

  interface GenreLinkCard {
    title: string;
    genreId: string;
  }

  interface EpisodeLinkCard {
    title: string;
    episodeId: string;
  }

  interface NavEpisodeLinkCard {
    title: string;
    episodeId: string;
  }

  interface BatchLinkCard {
    title: string;
    batchId: string;
    postedBy?: string;
    releasedOn?: string;
  }

  // Synopsis Types
  interface Synopsis {
    paragraphs: string[];
    connections?: Array<{
      title: string;
      animeId: string;
      type?: string;
    }>;
  }

  // Pagination Type
  interface Pagination {
    currentPage: number;
    hasPrevPage: boolean;
    prevPage: number | null;
    hasNextPage: boolean;
    nextPage: number | null;
    totalPages: number;
  }

  // Server and Quality Types
  interface Quality {
    title: string;
    serverList?: Array<{
      title: string;
      serverId: string;
    }>;
    urls?: Array<{
      title: string;
      url: string;
    }>;
  }

  interface Format {
    title: string;
    qualities: Array<{
      title: string;
      urls: Array<{
        title: string;
        url: string;
      }>;
    }>;
  }

  // Anime Card Types
  interface animeCard1 {
    title: string;
    animeId: string;
    poster: string;
    episodes?: string;
    releasedOn?: string;
    batchId?: string;
    href?: string;
  }

  interface animeCard2 {
    title: string;
    animeId: string;
    poster: string;
    status?: string;
    type?: string;
    score?: string;
    href?: string;
    batchId?: string;
    genreList?: GenreLinkCard[];
  }

  interface animeCard3 {
    title: string;
    animeId: string;
    poster: string;
    status?: string;
  }

  interface animeCard4 {
    title: string;
    animeId: string;
    poster: string;
    type?: string;
    score?: string;
    estimation?: string;
    genres?: string;
  }

  interface animeCard5 {
    title: string;
    animeId: string;
    poster: string;
    episodeId?: string;
    releasedOn?: string;
  }

  interface animeCard6 {
    title: string;
    animeId: string;
    poster: string;
    rating?: string;
  }
}

export {};
