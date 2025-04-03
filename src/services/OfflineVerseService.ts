
import BibleVerseService from './BibleVerseService';

interface VerseResult {
  text: string;
  reference: string;
  categories?: string[];
  category?: string;
}

class OfflineVerseService {
  private static CACHE_KEY = 'offline_verses_cache';
  private static CACHE_TIMESTAMP_KEY = 'offline_verses_timestamp';
  private static CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  
  static async cacheVerses(count: number = 100): Promise<boolean> {
    try {
      // Get all verses from main service
      const allVerses = await BibleVerseService.getAllVerses();
      
      if (!allVerses || allVerses.length === 0) {
        return false;
      }
      
      // Limit to the specified count
      const versesToCache = allVerses.slice(0, count);
      
      // Store in localStorage
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(versesToCache));
      localStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
      
      console.log(`Cached ${versesToCache.length} verses for offline use`);
      return true;
    } catch (error) {
      console.error('Error caching verses for offline use:', error);
      return false;
    }
  }
  
  static async getOfflineVerse(reference?: string): Promise<VerseResult | null> {
    try {
      const cachedVerses = this.getCachedVerses();
      
      if (!cachedVerses || cachedVerses.length === 0) {
        return null;
      }
      
      if (reference) {
        // Try to find the specific verse
        const searchRef = reference.trim().toLowerCase();
        
        const matchingVerse = cachedVerses.find(verse => 
          verse.reference.toLowerCase() === searchRef ||
          verse.reference.toLowerCase().includes(searchRef)
        );
        
        if (matchingVerse) {
          return matchingVerse;
        }
      }
      
      // If no specific verse found or no reference provided, return a random verse
      const randomIndex = Math.floor(Math.random() * cachedVerses.length);
      return cachedVerses[randomIndex];
    } catch (error) {
      console.error('Error retrieving offline verse:', error);
      return null;
    }
  }
  
  static getCachedVerses(): VerseResult[] {
    try {
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      
      if (!cachedData) {
        return [];
      }
      
      return JSON.parse(cachedData);
    } catch (error) {
      console.error('Error parsing cached verses:', error);
      return [];
    }
  }
  
  static isOfflineModeAvailable(): boolean {
    const cachedVerses = this.getCachedVerses();
    return cachedVerses.length > 0;
  }
  
  static isCacheValid(): boolean {
    const timestamp = localStorage.getItem(this.CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;
    
    const cacheTime = parseInt(timestamp);
    const currentTime = Date.now();
    
    return (currentTime - cacheTime) < this.CACHE_DURATION;
  }
  
  static clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(this.CACHE_TIMESTAMP_KEY);
  }
  
  static async searchOfflineVerses(query: string): Promise<VerseResult[]> {
    if (!query || query.trim().length < 2) return [];
    
    try {
      const cachedVerses = this.getCachedVerses();
      const searchTerm = query.trim().toLowerCase();
      
      return cachedVerses.filter(verse => 
        verse.reference.toLowerCase().includes(searchTerm) ||
        verse.text.toLowerCase().includes(searchTerm) ||
        (verse.categories && verse.categories.some(cat => 
          cat.toLowerCase().includes(searchTerm)
        ))
      );
    } catch (error) {
      console.error('Error searching offline verses:', error);
      return [];
    }
  }
}

export default OfflineVerseService;
