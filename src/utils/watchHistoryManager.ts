// Watch History Manager - Client-side only (localStorage)
export interface WatchHistoryItem {
  episodeId: string;
  animeId: string;
  animeTitle: string;
  poster: string;
  episodeTitle: string;
  watchedAt: number;
  progress?: number; // percentage 0-100
}

export class WatchHistoryManager {
  private static STORAGE_KEY = 'molidonghub_watch_history';
  private static MAX_ITEMS = 50;

  static getAll(): WatchHistoryItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static add(item: Omit<WatchHistoryItem, 'watchedAt'>): void {
    if (typeof window === 'undefined') return;
    
    let history = this.getAll();
    
    // Remove if already exists
    history = history.filter(h => h.episodeId !== item.episodeId);
    
    // Add to beginning
    history.unshift({
      ...item,
      watchedAt: Date.now()
    });
    
    // Keep only MAX_ITEMS
    if (history.length > this.MAX_ITEMS) {
      history = history.slice(0, this.MAX_ITEMS);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    this.dispatchUpdate();
  }

  static remove(episodeId: string): void {
    if (typeof window === 'undefined') return;
    
    const history = this.getAll().filter(h => h.episodeId !== episodeId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    this.dispatchUpdate();
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.STORAGE_KEY);
    this.dispatchUpdate();
  }

  static getByAnime(animeId: string): WatchHistoryItem[] {
    return this.getAll().filter(h => h.animeId === animeId);
  }

  static updateProgress(episodeId: string, progress: number): void {
    if (typeof window === 'undefined') return;
    
    const history = this.getAll();
    const item = history.find(h => h.episodeId === episodeId);
    
    if (item) {
      item.progress = Math.min(100, Math.max(0, progress));
      item.watchedAt = Date.now();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
      this.dispatchUpdate();
    }
  }

  private static dispatchUpdate(): void {
    if (typeof window === 'undefined') return;
    
    window.dispatchEvent(new CustomEvent('watchHistoryUpdated'));
  }
}
