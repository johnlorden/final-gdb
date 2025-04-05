
import { VerseResult } from './types/BibleVerseTypes';
import { XmlParser } from './utils/XmlParser';
import { VerseCache } from './utils/VerseCache';
import { XmlFileLoader } from './utils/XmlFileLoader';
import { VerseSelector } from './utils/VerseSelector';

class BibleVerseService {
  private static categories = [
    'Faith', 'Love', 'Hope', 'Wisdom', 'Prayer',
    'Forgiveness', 'Peace', 'Salvation', 'Strength',
    'Comfort', 'Guidance', 'Joy', 'Gratitude', 'Humility',
    'Perseverance', 'Courage', 'Patience', 'Righteousness',
    'Encouragement', 'Protection', 'Spiritual Growth'
  ];
  
  private static currentLanguage: string = 'en';

  static setLanguage(language: string): void {
    if (language === 'en' || language === 'fil') {
      this.currentLanguage = language;
      this.clearCache(language);
    }
  }

  static getLanguage(): string {
    return this.currentLanguage;
  }

  public static async getAllVerses(language?: string): Promise<VerseResult[]> {
    const lang = language || this.currentLanguage;
    
    const cachedVerses = VerseCache.getAllVerses(lang);
    if (cachedVerses && cachedVerses.length > 0) {
      return cachedVerses;
    }
    
    try {
      const xmlDoc = await XmlFileLoader.loadXmlDoc(lang);
      const verses = XmlParser.extractVersesFromDocument(xmlDoc);
      
      if (verses.length === 0) {
        console.warn(`No verses found in XML document for language: ${lang}`);
        
        if (lang === 'fil') {
          console.log('Falling back to English verses');
          return this.getAllVerses('en');
        }
        
        return [];
      }
      
      VerseCache.setAllVerses(verses, lang);
      return verses;
    } catch (error) {
      console.error('Error parsing all verses:', error);
      
      if (lang === 'fil') {
        console.log('Error with Filipino verses, falling back to English');
        return this.getAllVerses('en');
      }
      
      return [];
    }
  }

  static async getRandomVerse(language?: string): Promise<VerseResult | null> {
    const lang = language || this.currentLanguage;
    
    try {
      const allVerses = await this.getAllVerses(lang);
      if (allVerses.length === 0) {
        console.warn('No verses available for random selection');
        return null;
      }
      
      const randomVerse = VerseSelector.getRandomVerseFromArray(allVerses);
      return randomVerse;
    } catch (error) {
      console.error('Error fetching random verse:', error);
      return null;
    }
  }
  
  static async getVerseByCategory(category: string, language?: string): Promise<VerseResult | null> {
    const lang = language || this.currentLanguage;
    
    if (category === 'All') {
      return this.getRandomVerse(lang);
    }
    
    try {
      if (VerseCache.hasCachedVerses(category, lang)) {
        const cachedVerses = VerseCache.getCachedVerses(category, lang);
        if (cachedVerses && cachedVerses.length > 0) {
          return VerseSelector.getRandomVerseFromArray(cachedVerses, category);
        }
      }
      
      const allVerses = await this.getAllVerses(lang);
      if (allVerses.length === 0) {
        console.warn('No verses available for category selection');
        return null;
      }
      
      const matchingVerses = allVerses.filter(verse => 
        verse.categories?.some(c => c.toLowerCase() === category.toLowerCase())
      );
      
      if (matchingVerses.length === 0) {
        console.warn(`No verses found for category: ${category}, falling back to random verse`);
        return this.getRandomVerse(lang);
      }
      
      VerseCache.setCachedVerses(category, matchingVerses, lang);
      
      return VerseSelector.getRandomVerseFromArray(matchingVerses, category);
    } catch (error) {
      console.error(`Error fetching verse by category '${category}':`, error);
      return null;
    }
  }
  
  static async getVersesByCategory(category: string, count = 20, language?: string): Promise<VerseResult[] | null> {
    const lang = language || this.currentLanguage;
    
    if (category === 'All') {
      return null;
    }
    
    if (VerseCache.hasCachedVerses(category, lang)) {
      return VerseCache.getCachedVerses(category, lang) || null;
    }
    
    try {
      const allVerses = await this.getAllVerses(lang);
      const matchingVerses = allVerses.filter(verse => 
        verse.categories?.some(c => c.toLowerCase() === category.toLowerCase())
      );
      
      if (matchingVerses.length === 0) return null;
      
      VerseCache.setCachedVerses(category, matchingVerses, lang);
      
      return matchingVerses;
    } catch (error) {
      console.error(`Error fetching multiple verses by category '${category}':`, error);
      return null;
    }
  }
  
  static async getVerseByReference(reference: string, language?: string): Promise<VerseResult | null> {
    const lang = language || this.currentLanguage;
    
    try {
      const allVerses = await this.getAllVerses(lang);
      
      const searchRef = reference.trim().toLowerCase();
      
      let matchingVerse = allVerses.find(verse => 
        verse.reference.toLowerCase() === searchRef
      );
      
      if (!matchingVerse) {
        matchingVerse = allVerses.find(verse => 
          verse.reference.toLowerCase().includes(searchRef)
        );
      }
      
      if (!matchingVerse) return null;
      
      return matchingVerse;
    } catch (error) {
      console.error(`Error fetching verse by reference '${reference}':`, error);
      return null;
    }
  }
  
  static async searchVerses(query: string, language?: string): Promise<VerseResult[]> {
    const lang = language || this.currentLanguage;
    
    if (!query || query.trim().length < 2) return [];
    
    const cacheKey = query.trim().toLowerCase();
    if (VerseCache.hasSearchCache(cacheKey, lang)) {
      return VerseCache.getSearchCache(cacheKey, lang)!;
    }
    
    try {
      const allVerses = await this.getAllVerses(lang);
      const searchTerm = query.trim().toLowerCase();
      
      const results = VerseSelector.rankSearchResults(allVerses, searchTerm);
      
      VerseCache.setSearchCache(cacheKey, results, lang);
      return results;
    } catch (error) {
      console.error(`Error searching verses by query '${query}':`, error);
      return [];
    }
  }
  
  static async searchVersesByText(query: string, language?: string): Promise<VerseResult[]> {
    const lang = language || this.currentLanguage;
    
    if (!query || query.trim().length < 2) return [];
    
    try {
      const allVerses = await this.getAllVerses(lang);
      const searchTerm = query.trim().toLowerCase();
      
      return allVerses.filter(verse => 
        verse.text.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error(`Error searching verses by text '${query}':`, error);
      return [];
    }
  }
  
  static getCategories(): string[] {
    return [...new Set(this.categories)];
  }
  
  static async preloadAllVerses(language?: string): Promise<void> {
    const lang = language || this.currentLanguage;
    
    try {
      console.log(`Preloading verses for language: ${lang}`);
      const verses = await this.getAllVerses(lang);
      console.log(`Preloaded ${verses.length} verses for language: ${lang}`);
      
      if (verses.length > 0) {
        for (const category of this.categories) {
          if (!VerseCache.hasCachedVerses(category, lang)) {
            await this.getVersesByCategory(category, 25, lang);
          }
        }
      }
    } catch (error) {
      console.error('Error preloading verses:', error);
    }
  }
  
  static clearCache(language?: string): void {
    const lang = language || this.currentLanguage;
    
    VerseCache.clearCache(lang);
    XmlFileLoader.clearPromiseCache(lang);
  }
}

setTimeout(() => {
  console.log('Starting Bible verse preload');
  BibleVerseService.preloadAllVerses();
}, 1000);

export default BibleVerseService;
