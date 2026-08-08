import moli from "@utils/moli";
import animeConfig from "@configs/animeConfig";

const config = (animeConfig as any).default || animeConfig;

interface ApiSource {
  name: string;
  apiUrl: string;
  baseUrlPath: string;
  priority: number;
}

// Configuration for multiple API sources
const API_SOURCES: ApiSource[] = [
  {
    name: "sankavollerei",
    apiUrl: "https://www.sankavollerei.com",
    baseUrlPath: "/anime/donghua",
    priority: 1, // Primary
  },
  {
    name: "anichin",
    apiUrl: process.env.ANICHIN_API_URL || "https://anichin-api.railway.app", // Update with your Railway URL
    baseUrlPath: "",
    priority: 2, // Fallback
  },
];

interface HybridResponse<T> {
  statusCode: number;
  statusMessage: string;
  message: string;
  ok: boolean;
  data: T;
  pagination: Pagination | null;
  source?: string; // Which API provided the data
}

/**
 * Fetch from multiple API sources with fallback
 */
export async function hybridFetch<T>(
  pathname: string,
  options: {
    preferredSource?: string;
    retryOnFail?: boolean;
    mergeData?: boolean;
  } = {}
): Promise<HybridResponse<T>> {
  const {
    preferredSource,
    retryOnFail = true,
    mergeData = false,
  } = options;

  // Sort sources by priority (unless preferred source specified)
  let sources = [...API_SOURCES].sort((a, b) => a.priority - b.priority);
  
  if (preferredSource) {
    const preferred = sources.find((s) => s.name === preferredSource);
    if (preferred) {
      sources = [preferred, ...sources.filter((s) => s.name !== preferredSource)];
    }
  }

  const errors: Array<{ source: string; error: any }> = [];
  let allData: any[] = [];

  for (const source of sources) {
    try {
      console.log(`[HybridAPI] Trying ${source.name}...`);
      
      const result = await fetchFromSource<T>(source, pathname);
      
      if (result.ok) {
        console.log(`[HybridAPI] Success from ${source.name}`);
        
        if (mergeData && result.data) {
          allData.push(result.data);
          // Continue to next source to merge
          continue;
        }
        
        return {
          ...result,
          source: source.name,
        };
      }
      
      errors.push({ source: source.name, error: result.message });
      
    } catch (error) {
      console.error(`[HybridAPI] Error from ${source.name}:`, error);
      errors.push({ source: source.name, error: error });
      
      if (!retryOnFail) {
        break;
      }
    }
  }

  // If mergeData enabled and we have data
  if (mergeData && allData.length > 0) {
    return {
      statusCode: 200,
      statusMessage: "OK",
      message: "Success",
      ok: true,
      data: mergeSources(allData) as T,
      pagination: null,
      source: "hybrid-merged",
    };
  }

  // All sources failed
  return {
    statusCode: 500,
    statusMessage: "All API sources failed",
    message: `Failed to fetch from all sources: ${errors.map((e) => e.source).join(", ")}`,
    ok: false,
    data: {} as T,
    pagination: null,
    source: "none",
  };
}

/**
 * Fetch from a specific source
 */
async function fetchFromSource<T>(
  source: ApiSource,
  pathname: string
): Promise<HybridResponse<T>> {
  const fullPath = source.baseUrlPath + pathname;
  const url = new URL(fullPath, source.apiUrl).href;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        statusMessage: response.statusText,
        message: "Fetch error",
        ok: false,
        data: {} as T,
        pagination: null,
      };
    }

    const result = await response.json();

    // Normalize response format based on source
    const normalizedData = normalizeResponse(result, source.name);

    return {
      statusCode: 200,
      statusMessage: "OK",
      message: "Success",
      ok: true,
      data: normalizedData as T,
      pagination: null,
    };
  } catch (error) {
    console.error(`Error fetching from ${source.name}:`, error);
    return {
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to fetch data",
      ok: false,
      data: {} as T,
      pagination: null,
    };
  }
}

/**
 * Normalize response format from different sources
 */
function normalizeResponse(data: any, sourceName: string): any {
  if (sourceName === "anichin") {
    // Anichin API wraps data in "result"
    return data.result || data;
  }
  
  // sankavollerei returns data directly
  return data;
}

/**
 * Merge data from multiple sources
 */
function mergeSources(dataArray: any[]): any {
  if (dataArray.length === 0) return {};
  if (dataArray.length === 1) return dataArray[0];

  // Merge arrays
  if (Array.isArray(dataArray[0])) {
    const merged = new Map();
    
    dataArray.forEach((items) => {
      items.forEach((item: any) => {
        const key = item.slug || item.animeId || item.title;
        if (key && !merged.has(key)) {
          merged.set(key, item);
        }
      });
    });
    
    return Array.from(merged.values());
  }

  // Merge objects
  const merged: any = {};
  
  dataArray.forEach((data) => {
    Object.keys(data).forEach((key) => {
      if (!merged[key]) {
        merged[key] = data[key];
      } else if (Array.isArray(data[key])) {
        // Merge arrays
        const existingMap = new Map(merged[key].map((item: any) => [
          item.slug || item.animeId || item.title,
          item,
        ]));
        
        data[key].forEach((item: any) => {
          const itemKey = item.slug || item.animeId || item.title;
          if (itemKey && !existingMap.has(itemKey)) {
            merged[key].push(item);
          }
        });
      }
    });
  });

  return merged;
}

/**
 * Merge server lists from multiple sources
 */
export function mergeServers(
  servers1: Array<{ name: string; url: string }>,
  servers2: Array<{ name: string; url: string }>
): Array<{ name: string; url: string }> {
  const merged = new Map<string, { name: string; url: string }>();

  [...servers1, ...servers2].forEach((server) => {
    // Use URL as unique key to avoid duplicates
    if (!merged.has(server.url)) {
      merged.set(server.url, server);
    }
  });

  return Array.from(merged.values());
}

export default hybridFetch;
