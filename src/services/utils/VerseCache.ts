
import { VerseResult, CachedVerses, CachedAllVerses, SearchCaches } from '../types/BibleVerseTypes';

export class VerseCache {
  private static verseCaches: Record<string, CachedVerses> = {
    en: new Map(),
    fil: new Map()
  };
  
  private static allVersesCaches: Record<string, CachedAllVerses> = {
    en: null,
    fil: null
  };
  
  private static categoryLastVerseIndex: Map<string, number> = new Map();
  
  private static searchCaches: SearchCaches = {
    en: new Map(),
    fil: new Map()
  };
  
  static setCachedVerses(category: string, verses: VerseResult[], language: string): void {
    // Initialize language caches if they don't exist
    if (!this.verseCaches[language]) {
      this.verseCaches[language] = new Map();
    }
    this.verseCaches[language].set(category, verses);
  }
  
  static getCachedVerses(category: string, language: string): VerseResult[] | undefined {
    return this.verseCaches[language]?.get(category);
  }
  
  static hasCachedVerses(category: string, language: string): boolean {
    return !!this.verseCaches[language]?.has(category);
  }
  
  static setAllVerses(verses: VerseResult[], language: string): void {
    // Initialize if it doesn't exist
    if (!this.allVersesCaches[language]) {
      this.allVersesCaches[language] = null;
    }
    this.allVersesCaches[language] = verses;
  }
  
  static getAllVerses(language: string): VerseResult[] | null {
    return this.allVersesCaches[language] || null;
  }
  
  static clearCache(language: string): void {
    // Check if the caches exist for this language before clearing
    if (this.verseCaches[language]) {
      this.verseCaches[language].clear();
    } else {
      // Initialize an empty cache for this language
      this.verseCaches[language] = new Map();
    }
    
    // Reset all verses cache
    this.allVersesCaches[language] = null;
    
    // Clear category index (no need to check, as Map.clear() doesn't throw if empty)
    this.categoryLastVerseIndex.clear();
    
    // Check if search caches exist for this language
    if (this.searchCaches[language]) {
      this.searchCaches[language].clear();
    } else {
      // Initialize an empty search cache for this language
      this.searchCaches[language] = new Map();
    }
  }
  
  static setCategoryLastIndex(category: string, index: number): void {
    this.categoryLastVerseIndex.set(category, index);
  }
  
  static getCategoryLastIndex(category: string): number {
    return this.categoryLastVerseIndex.get(category) ?? -1;
  }
  
  static setSearchCache(query: string, results: VerseResult[], language: string): void {
    // Initialize language cache if it doesn't exist
    if (!this.searchCaches[language]) {
      this.searchCaches[language] = new Map();
    }
    this.searchCaches[language].set(query, results);
  }
  
  static getSearchCache(query: string, language: string): VerseResult[] | undefined {
    return this.searchCaches[language]?.get(query);
  }
  
  static hasSearchCache(query: string, language: string): boolean {
    return !!this.searchCaches[language]?.has(query);
  }
}
