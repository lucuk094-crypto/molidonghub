// Bookmark Manager - Client-side only (localStorage)
export interface BookmarkItem {
  animeId: string;
  title: string;
  poster: string;
  addedAt: number;
}

export class BookmarkManager {
  private static STORAGE_KEY = 'molidonghub_bookmarks';

  static getAll(): BookmarkItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static add(item: Omit<BookmarkItem, 'addedAt'>): void {
    if (typeof window === 'undefined') return;
    
    const bookmarks = this.getAll();
    const exists = bookmarks.find(b => b.animeId === item.animeId);
    
    if (!exists) {
      bookmarks.unshift({
        ...item,
        addedAt: Date.now()
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
      this.dispatchUpdate();
    }
  }

  static remove(animeId: string): void {
    if (typeof window === 'undefined') return;
    
    const bookmarks = this.getAll().filter(b => b.animeId !== animeId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
    this.dispatchUpdate();
  }

  static isBookmarked(animeId: string): boolean {
    if (typeof window === 'undefined') return false;
    
    return this.getAll().some(b => b.animeId === animeId);
  }

  static toggle(item: Omit<BookmarkItem, 'addedAt'>): boolean {
    const isBookmarked = this.isBookmarked(item.animeId);
    
    if (isBookmarked) {
      this.remove(item.animeId);
      return false;
    } else {
      this.add(item);
      return true;
    }
  }

  private static dispatchUpdate(): void {
    if (typeof window === 'undefined') return;
    
    window.dispatchEvent(new CustomEvent('bookmarksUpdated'));
  }
}
