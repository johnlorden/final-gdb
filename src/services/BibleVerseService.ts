import { VerseResult } from './types/BibleVerseTypes';
import { XmlParser } from './utils/XmlParser';
import { VerseCache } from './utils/VerseCache';
import { XmlFileLoader } from './utils/XmlFileLoader';
import { VerseSelector } from './utils/VerseSelector';
import LanguageService from './LanguageService';
import { XmlManager } from './utils/xml/XmlManager';

class BibleVerseService {
  private static categories = [
    'Faith', 'Love', 'Hope', 'Wisdom', 'Prayer',
    'Forgiveness', 'Peace', 'Salvation', 'Strength',
    'Comfort', 'Guidance', 'Joy', 'Gratitude', 'Humility',
    'Perseverance', 'Courage', 'Patience', 'Righteousness',
    'Encouragement', 'Protection', 'Spiritual Growth'
  ];
  
  private static currentLanguage: string = 'en';
  private static availableLanguages: Set<string> = new Set(['en', 'fil']);
  private static invalidLanguages: Set<string> = new Set();
  private static isInitialized: boolean = false;

  static async initializeService(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Initialize XML file loader
      await XmlFileLoader.initializeXmlUrls();
      
      // Get languages from database
      await this.refreshLanguageList();
      
      // Pre-cache local languages
      this.preloadAllVerses('en').catch(() => console.warn("Failed to preload English verses"));
      this.preloadAllVerses('fil').catch(() => console.warn("Failed to preload Filipino verses"));
      
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize BibleVerseService:", error);
    }
  }

  static async refreshLanguageList(): Promise<void> {
    try {
      const languages = await LanguageService.getActiveLanguages();
      
      // Start with English and Filipino as available
      this.availableLanguages = new Set(['en', 'fil']);
      
      // Add other active languages
      languages.forEach(l => {
        if (l.is_active) {
          this.availableLanguages.add(l.language_code);
        }
      });
      
      console.log('Available languages:', Array.from(this.availableLanguages).join(', '));
    } catch (error) {
      console.error('Error refreshing language list:', error);
    }
  }

  static setLanguage(language: string): void {
    if (this.invalidLanguages.has(language)) {
      console.warn(`Language ${language} was previously marked as invalid, defaulting to English`);
      this.currentLanguage = 'en';
      return;
    }

    if (this.availableLanguages.has(language) || language === 'en' || language === 'fil') {
      this.currentLanguage = language;
      
      // Validate the language immediately for non-local languages
      if (language !== 'en' && language !== 'fil') {
        this.validateLanguage(language).catch(err => {
          console.error(`Failed to validate language ${language}:`, err);
          this.markLanguageAsInvalid(language);
          this.currentLanguage = 'en';
        });
      }
    } else {
      console.warn(`Language ${language} is not available, defaulting to English`);
      this.currentLanguage = 'en';
    }
  }
  
  private static async validateLanguage(language: string): Promise<boolean> {
    try {
      // Try to load at least one verse to validate the language
      const xmlDoc = await XmlFileLoader.loadXmlDoc(language);
      const verseNodes = xmlDoc.getElementsByTagName('verse');
      
      if (verseNodes.length === 0) {
        console.error(`No verses found for language ${language}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error validating language ${language}:`, error);
      return false;
    }
  }

  static getLanguage(): string {
    return this.currentLanguage;
  }

  static async isLanguageAvailable(language: string): Promise<boolean> {
    // If language has been marked as invalid, it's not available
    if (this.invalidLanguages.has(language)) {
      return false;
    }
    
    // For local languages, always try to load them
    if (language === 'en' || language === 'fil') {
      try {
        const xmlDoc = await XmlFileLoader.loadXmlDoc(language);
        const verseCount = xmlDoc.getElementsByTagName('verse').length;
        return verseCount > 0;
      } catch (error) {
        console.error(`Error checking local language availability for ${language}:`, error);
        return false;
      }
    }
    
    // For other languages, check if they're in the available languages list
    if (!this.availableLanguages.has(language)) {
      return false;
    }
    
    // Validate by attempting to load the XML
    try {
      const isValid = await this.validateLanguage(language);
      if (!isValid) {
        this.markLanguageAsInvalid(language);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error checking language availability for ${language}:`, error);
      this.markLanguageAsInvalid(language);
      return false;
    }
  }

  static markLanguageAsInvalid(language: string): void {
    // Never mark local languages as invalid
    if (language === 'en' || language === 'fil') {
      console.warn(`Cannot mark local language ${language} as invalid`);
      return;
    }
    
    this.invalidLanguages.add(language);
    console.warn(`Marked language ${language} as invalid`);
    
    if (this.currentLanguage === language) {
      console.warn(`Current language ${language} is invalid, switching to English`);
      this.currentLanguage = 'en';
    }
    
    // Update in database if possible
    try {
      LanguageService.updateLanguageStatus(language, false)
        .then(() => console.log(`Updated language ${language} status in database`))
        .catch((err) => console.error(`Failed to update language status in database:`, err));
    } catch (error) {
      console.error(`Error updating language status:`, error);
    }
    
    // Dispatch event to notify UI components
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('language-disabled', { detail: language });
      window.dispatchEvent(event);
    }
  }
  
  static async getAllVerses(language?: string): Promise<VerseResult[]> {
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
        
        // Mark this language as invalid
        this.markLanguageAsInvalid(lang);
        
        if (lang !== 'en') {
          console.log('Falling back to English verses');
          return this.getAllVerses('en');
        }
        
        return [];
      }
      
      VerseCache.setAllVerses(verses, lang);
      return verses;
    } catch (error) {
      console.error('Error parsing all verses:', error);
      
      // Mark this language as invalid if we can't load it and it's not a local language
      if (lang !== 'en' && lang !== 'fil') {
        this.markLanguageAsInvalid(lang);
      }
      
      if (lang !== 'en') {
        console.log('Error with non-English verses, falling back to English');
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
    
    try {
      VerseCache.clearCache(lang);
      XmlFileLoader.clearPromiseCache(lang);
    } catch (error) {
      console.error(`Error clearing cache for language ${lang}:`, error);
    }
  }
}

// Initialize service immediately
BibleVerseService.initializeService();

export default BibleVerseService;
