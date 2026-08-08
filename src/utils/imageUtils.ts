/**
 * Get a valid image URL with fallback
 * @param url - Original image URL
 * @param fallback - Fallback image path
 * @returns Valid image URL or fallback
 */
export function getValidImageUrl(url: string | undefined | null, fallback: string = '/images/logo.png'): string {
  if (!url || url.trim() === '' || url === 'undefined' || url === 'null') {
    return fallback;
  }
  
  // Check if URL is valid
  try {
    // If it's a relative path, return as is
    if (url.startsWith('/')) {
      return url;
    }
    
    // If it's a full URL, validate it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      new URL(url); // This will throw if invalid
      return url;
    }
    
    // If it's neither, return fallback
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Validate if an image URL is likely to be valid
 */
export function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url || url.trim() === '' || url === 'undefined' || url === 'null') {
    return false;
  }
  
  // Check common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasImageExtension = imageExtensions.some(ext => url.toLowerCase().includes(ext));
  
  // If URL starts with http/https, it should be fine
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true;
  }
  
  // If it's a relative path with image extension
  if (url.startsWith('/') && hasImageExtension) {
    return true;
  }
  
  return false;
}
