
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
    this.verseCaches[language].set(category, verses);
  }
  
  static getCachedVerses(category: string, language: string): VerseResult[] | undefined {
    return this.verseCaches[language].get(category);
  }
  
  static hasCachedVerses(category: string, language: string): boolean {
    return this.verseCaches[language].has(category);
  }
  
  static setAllVerses(verses: VerseResult[], language: string): void {
    this.allVersesCaches[language] = verses;
  }
  
  static getAllVerses(language: string): VerseResult[] | null {
    return this.allVersesCaches[language];
  }
  
  static clearCache(language: string): void {
    this.verseCaches[language].clear();
    this.allVersesCaches[language] = null;
    this.categoryLastVerseIndex.clear();
    this.searchCaches[language].clear();
  }
  
  static setCategoryLastIndex(category: string, index: number): void {
    this.categoryLastVerseIndex.set(category, index);
  }
  
  static getCategoryLastIndex(category: string): number {
    return this.categoryLastVerseIndex.get(category) ?? -1;
  }
  
  static setSearchCache(query: string, results: VerseResult[], language: string): void {
    this.searchCaches[language].set(query, results);
  }
  
  static getSearchCache(query: string, language: string): VerseResult[] | undefined {
    return this.searchCaches[language].get(query);
  }
  
  static hasSearchCache(query: string, language: string): boolean {
    return this.searchCaches[language].has(query);
  }
}
