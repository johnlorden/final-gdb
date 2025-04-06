
import BibleVerseService from './BibleVerseService';
import { VerseResult } from './types/BibleVerseTypes';
import LanguageService from './LanguageService';

class OfflineVerseService {
  private static CACHE_KEY_PREFIX = 'offline_verses_cache';
  private static CACHE_TIMESTAMP_PREFIX = 'offline_verses_timestamp';
  private static CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  private static DEFAULT_VERSE_COUNT = 500; // Increased from 100
  private static SEARCH_INDEX_PREFIX = 'offline_search_index';
  private static USER_PREFERENCES_KEY = 'offline_user_preferences';
  private static DOWNLOADED_LANGUAGES_KEY = 'offline_downloaded_languages';
  
  static async cacheVerses(count: number = this.DEFAULT_VERSE_COUNT, language: string = 'en'): Promise<boolean> {
    try {
      // Get all verses from main service for the specified language
      const allVerses = await BibleVerseService.getAllVerses(language);
      
      if (!allVerses || allVerses.length === 0) {
        return false;
      }
      
      // Limit to the specified count
      const versesToCache = allVerses.slice(0, count);
      
      // Store in localStorage
      const cacheKey = `${this.CACHE_KEY_PREFIX}_${language}`;
      const timestampKey = `${this.CACHE_TIMESTAMP_PREFIX}_${language}`;
      
      localStorage.setItem(cacheKey, JSON.stringify(versesToCache));
      localStorage.setItem(timestampKey, Date.now().toString());
      
      // Build search index for better offline search
      this.buildSearchIndex(versesToCache, language);
      
      // Store the language in the downloaded languages list
      this.addToDownloadedLanguages(language, count);
      
      console.log(`Cached ${versesToCache.length} verses for offline use in ${language}`);
      return true;
    } catch (error) {
      console.error(`Error caching verses for offline use in ${language}:`, error);
      return false;
    }
  }
  
  private static buildSearchIndex(verses: VerseResult[], language: string): void {
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
    
    const indexKey = `${this.SEARCH_INDEX_PREFIX}_${language}`;
    localStorage.setItem(indexKey, JSON.stringify(searchIndex));
  }
  
  static async getOfflineVerse(reference?: string, language: string = 'en'): Promise<VerseResult | null> {
    try {
      const cachedVerses = this.getCachedVerses(language);
      
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
      console.error(`Error retrieving offline verse for ${language}:`, error);
      return null;
    }
  }
  
  static getCachedVerses(language: string = 'en'): VerseResult[] {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}_${language}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (!cachedData) {
        return [];
      }
      
      return JSON.parse(cachedData);
    } catch (error) {
      console.error(`Error parsing cached verses for ${language}:`, error);
      return [];
    }
  }
  
  static isOfflineModeAvailable(): boolean {
    const downloadedLanguages = this.getDownloadedLanguages();
    return downloadedLanguages.length > 0;
  }
  
  static isLanguageDownloaded(language: string): boolean {
    const downloadedLanguages = this.getDownloadedLanguages();
    return downloadedLanguages.some(l => l.code === language);
  }
  
  static isCacheValid(language: string = 'en'): boolean {
    const timestampKey = `${this.CACHE_TIMESTAMP_PREFIX}_${language}`;
    const timestamp = localStorage.getItem(timestampKey);
    if (!timestamp) return false;
    
    const cacheTime = parseInt(timestamp);
    const currentTime = Date.now();
    
    return (currentTime - cacheTime) < this.CACHE_DURATION;
  }
  
  static clearCache(language?: string): void {
    if (language) {
      // Clear specific language cache
      const cacheKey = `${this.CACHE_KEY_PREFIX}_${language}`;
      const timestampKey = `${this.CACHE_TIMESTAMP_PREFIX}_${language}`;
      const indexKey = `${this.SEARCH_INDEX_PREFIX}_${language}`;
      
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(timestampKey);
      localStorage.removeItem(indexKey);
      
      // Update downloaded languages list
      this.removeFromDownloadedLanguages(language);
    } else {
      // Clear all language caches
      const downloadedLanguages = this.getDownloadedLanguages();
      
      downloadedLanguages.forEach(lang => {
        const cacheKey = `${this.CACHE_KEY_PREFIX}_${lang.code}`;
        const timestampKey = `${this.CACHE_TIMESTAMP_PREFIX}_${lang.code}`;
        const indexKey = `${this.SEARCH_INDEX_PREFIX}_${lang.code}`;
        
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(timestampKey);
        localStorage.removeItem(indexKey);
      });
      
      // Clear downloaded languages list
      localStorage.removeItem(this.DOWNLOADED_LANGUAGES_KEY);
    }
  }
  
  static async searchOfflineVerses(query: string, language: string = 'en'): Promise<VerseResult[]> {
    if (!query || query.trim().length < 2) return [];
    
    try {
      const cachedVerses = this.getCachedVerses(language);
      const searchTerm = query.trim().toLowerCase();
      
      // Try to use search index if available
      const searchIndex = this.getSearchIndex(language);
      
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
      console.error(`Error searching offline verses for ${language}:`, error);
      return [];
    }
  }
  
  private static getSearchIndex(language: string = 'en'): Record<string, string[]> | null {
    try {
      const indexKey = `${this.SEARCH_INDEX_PREFIX}_${language}`;
      const indexData = localStorage.getItem(indexKey);
      if (!indexData) return null;
      
      return JSON.parse(indexData);
    } catch (error) {
      console.error(`Error parsing search index for ${language}:`, error);
      return null;
    }
  }
  
  static getCacheSize(language: string = 'en'): number {
    const verses = this.getCachedVerses(language);
    return verses.length;
  }

  static getDownloadedLanguages(): Array<{code: string, count: number, timestamp: number}> {
    try {
      const data = localStorage.getItem(this.DOWNLOADED_LANGUAGES_KEY);
      if (!data) return [];
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting downloaded languages:', error);
      return [];
    }
  }
  
  private static addToDownloadedLanguages(languageCode: string, verseCount: number): void {
    try {
      const languages = this.getDownloadedLanguages();
      const existingIndex = languages.findIndex(l => l.code === languageCode);
      
      if (existingIndex >= 0) {
        // Update existing entry
        languages[existingIndex] = {
          code: languageCode,
          count: verseCount,
          timestamp: Date.now()
        };
      } else {
        // Add new entry
        languages.push({
          code: languageCode,
          count: verseCount,
          timestamp: Date.now()
        });
      }
      
      localStorage.setItem(this.DOWNLOADED_LANGUAGES_KEY, JSON.stringify(languages));
    } catch (error) {
      console.error('Error adding to downloaded languages:', error);
    }
  }
  
  private static removeFromDownloadedLanguages(languageCode: string): void {
    try {
      const languages = this.getDownloadedLanguages();
      const updatedLanguages = languages.filter(l => l.code !== languageCode);
      
      localStorage.setItem(this.DOWNLOADED_LANGUAGES_KEY, JSON.stringify(updatedLanguages));
    } catch (error) {
      console.error('Error removing from downloaded languages:', error);
    }
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

  static async syncUserLanguagePreferences(userId: string | null): Promise<void> {
    if (!userId) return;
    
    try {
      const downloadedLanguages = this.getDownloadedLanguages();
      const userPreferences = await LanguageService.getUserLanguagePreferences(userId);
      
      // For each downloaded language, update user preferences in the database
      for (const lang of downloadedLanguages) {
        await LanguageService.saveUserLanguagePreference(
          userId,
          lang.code,
          true,
          lang.count
        );
      }
      
      console.log('Synced user language preferences with database');
    } catch (error) {
      console.error('Error syncing user language preferences:', error);
    }
  }
}

export default OfflineVerseService;
