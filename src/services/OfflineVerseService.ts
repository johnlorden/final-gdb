
import BibleVerseService from './BibleVerseService';
import { VerseResult } from './types/BibleVerseTypes';

class OfflineVerseService {
  private static CACHE_KEY = 'offline_verses_cache';
  private static CACHE_TIMESTAMP_KEY = 'offline_verses_timestamp';
  private static CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  private static DEFAULT_VERSE_COUNT = 500; // Increased from 100
  private static SEARCH_INDEX_KEY = 'offline_search_index';
  private static USER_PREFERENCES_KEY = 'offline_user_preferences';
  
  static async cacheVerses(count: number = this.DEFAULT_VERSE_COUNT): Promise<boolean> {
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
      
      // Build search index for better offline search
      this.buildSearchIndex(versesToCache);
      
      console.log(`Cached ${versesToCache.length} verses for offline use`);
      return true;
    } catch (error) {
      console.error('Error caching verses for offline use:', error);
      return false;
    }
  }
  
  private static buildSearchIndex(verses: VerseResult[]): void {
    // Create a simple search index that maps words to verse references
    const searchIndex: Record<string, string[]> = {};
    
    verses.forEach(verse => {
      // Extract words from the verse text and reference
      const words = [...verse.text.toLowerCase().split(/\W+/), 
                     ...verse.reference.toLowerCase().split(/\W+/)];
      
      // Add categories if available
      if (verse.categories) {
        words.push(...verse.categories.map(cat => cat.toLowerCase()));
      }
      
      // Remove empty strings and duplicates
      const uniqueWords = [...new Set(words.filter(word => word.length > 1))];
      
      // Add each word to the index
      uniqueWords.forEach(word => {
        if (!searchIndex[word]) {
          searchIndex[word] = [];
        }
        if (!searchIndex[word].includes(verse.reference)) {
          searchIndex[word].push(verse.reference);
        }
      });
    });
    
    localStorage.setItem(this.SEARCH_INDEX_KEY, JSON.stringify(searchIndex));
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
    localStorage.removeItem(this.SEARCH_INDEX_KEY);
  }
  
  static async searchOfflineVerses(query: string): Promise<VerseResult[]> {
    if (!query || query.trim().length < 2) return [];
    
    try {
      const cachedVerses = this.getCachedVerses();
      const searchTerm = query.trim().toLowerCase();
      
      // Try to use search index if available
      const searchIndex = this.getSearchIndex();
      
      if (searchIndex) {
        // Find potential matches using the search index
        const words = searchTerm.split(/\W+/).filter(word => word.length > 1);
        const matchingRefs = new Set<string>();
        
        words.forEach(word => {
          // Look for exact matches or words that start with the search term
          Object.keys(searchIndex).forEach(indexWord => {
            if (indexWord === word || indexWord.startsWith(word)) {
              searchIndex[indexWord].forEach(ref => matchingRefs.add(ref));
            }
          });
        });
        
        if (matchingRefs.size > 0) {
          // Return verses that match the references from the search index
          return cachedVerses.filter(verse => 
            matchingRefs.has(verse.reference)
          );
        }
      }
      
      // Fallback to full text search if index search returns no results
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
  
  private static getSearchIndex(): Record<string, string[]> | null {
    try {
      const indexData = localStorage.getItem(this.SEARCH_INDEX_KEY);
      if (!indexData) return null;
      
      return JSON.parse(indexData);
    } catch (error) {
      console.error('Error parsing search index:', error);
      return null;
    }
  }
  
  static getCacheSize(): number {
    const verses = this.getCachedVerses();
    return verses.length;
  }
  
  // User preferences for background images and other settings
  static saveUserPreferences(preferences: Record<string, any>): void {
    try {
      const currentPrefs = this.getUserPreferences() || {};
      const updatedPrefs = { ...currentPrefs, ...preferences };
      localStorage.setItem(this.USER_PREFERENCES_KEY, JSON.stringify(updatedPrefs));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }
  
  static getUserPreferences(): Record<string, any> | null {
    try {
      const prefsData = localStorage.getItem(this.USER_PREFERENCES_KEY);
      if (!prefsData) return null;
      
      return JSON.parse(prefsData);
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }
}

export default OfflineVerseService;
