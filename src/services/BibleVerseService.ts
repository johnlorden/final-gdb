import { DOMParser } from '@xmldom/xmldom';

interface VerseResult {
  text: string;
  reference: string;
  categories?: string[];
  category?: string;
}

class BibleVerseService {
  private static parser = new DOMParser();
  private static categories = [
    'Faith', 'Love', 'Hope', 'Wisdom', 'Prayer',
    'Forgiveness', 'Peace', 'Salvation', 'Strength',
    'Comfort', 'Guidance', 'Joy', 'Gratitude', 'Humility',
    'Perseverance', 'Courage', 'Patience', 'Righteousness',
    'Encouragement', 'Protection', 'Spiritual Growth'
  ];
  
  private static xmlDocPromises: Record<string, Promise<Document> | null> = {
    en: null,
    fil: null
  };
  
  private static verseCaches: Record<string, Map<string, VerseResult[]>> = {
    en: new Map(),
    fil: new Map()
  };
  
  private static allVersesCaches: Record<string, VerseResult[] | null> = {
    en: null,
    fil: null
  };
  
  private static categoryLastVerseIndex: Map<string, number> = new Map();
  private static searchCaches: Record<string, Map<string, VerseResult[]>> = {
    en: new Map(),
    fil: new Map()
  };
  
  private static currentLanguage: string = 'en';

  static setLanguage(language: string): void {
    if (language === 'en' || language === 'fil') {
      this.currentLanguage = language;
    }
  }

  static getLanguage(): string {
    return this.currentLanguage;
  }

  private static async getXmlDoc(language: string = 'en'): Promise<Document> {
    const lang = language === 'fil' ? 'fil' : 'en';
    
    if (!this.xmlDocPromises[lang]) {
      this.xmlDocPromises[lang] = fetch(`/data/bible-verses-${lang}.xml`)
        .then(response => {
          if (!response.ok) {
            // If Filipino version not found, fallback to English
            if (lang === 'fil') {
              console.warn('Filipino Bible verses not found, falling back to English');
              return fetch('/data/bible-verses.xml');
            }
            throw new Error(`Failed to load Bible verses XML: ${response.status} ${response.statusText}`);
          }
          return response.text();
        })
        .then(xmlText => {
          try {
            return this.parser.parseFromString(xmlText, 'text/xml');
          } catch (parseError) {
            console.error('Error parsing XML:', parseError);
            throw parseError;
          }
        })
        .catch(error => {
          console.error('Error loading XML document:', error);
          this.xmlDocPromises[lang] = null;
          throw error;
        });
    }
    return this.xmlDocPromises[lang]!;
  }

  private static async getAllVerses(language?: string): Promise<VerseResult[]> {
    const lang = language || this.currentLanguage;
    
    if (this.allVersesCaches[lang]) {
      return this.allVersesCaches[lang]!;
    }
    
    try {
      const xmlDoc = await this.getXmlDoc(lang);
      const verses = Array.from(xmlDoc.getElementsByTagName('verse'));
      
      this.allVersesCaches[lang] = verses.map(verse => {
        const text = verse.getElementsByTagName('text')[0]?.textContent || '';
        const reference = verse.getElementsByTagName('reference')[0]?.textContent || '';
        const categoryNode = verse.getElementsByTagName('category')[0]?.textContent || '';
        const categories = categoryNode ? [categoryNode] : [];
        
        return { 
          text, 
          reference, 
          categories,
          category: categoryNode
        };
      });
      
      return this.allVersesCaches[lang]!;
    } catch (error) {
      console.error('Error parsing all verses:', error);
      return [];
    }
  }

  private static getRandomVerseFromArray(verses: VerseResult[], category: string = 'All'): VerseResult {
    if (verses.length === 0) {
      throw new Error('No verses available');
    }
    
    if (verses.length === 1) {
      return verses[0];
    }
    
    let lastIndex = this.categoryLastVerseIndex.get(category) ?? -1;
    let randomIndex;
    
    do {
      randomIndex = Math.floor(Math.random() * verses.length);
    } while (randomIndex === lastIndex && verses.length > 1);
    
    this.categoryLastVerseIndex.set(category, randomIndex);
    
    return verses[randomIndex];
  }

  static async getRandomVerse(language?: string): Promise<VerseResult | null> {
    const lang = language || this.currentLanguage;
    
    try {
      const allVerses = await this.getAllVerses(lang);
      if (allVerses.length === 0) return null;
      
      const randomVerse = this.getRandomVerseFromArray(allVerses);
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
      if (this.verseCaches[lang].has(category)) {
        const cachedVerses = this.verseCaches[lang].get(category)!;
        if (cachedVerses.length > 0) {
          return this.getRandomVerseFromArray(cachedVerses, category);
        }
      }
      
      const allVerses = await this.getAllVerses(lang);
      const matchingVerses = allVerses.filter(verse => 
        verse.categories?.some(c => c.toLowerCase() === category.toLowerCase())
      );
      
      if (matchingVerses.length === 0) return null;
      
      this.verseCaches[lang].set(category, matchingVerses);
      
      return this.getRandomVerseFromArray(matchingVerses, category);
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
    
    if (this.verseCaches[lang].has(category)) {
      return this.verseCaches[lang].get(category) || null;
    }
    
    try {
      const allVerses = await this.getAllVerses(lang);
      const matchingVerses = allVerses.filter(verse => 
        verse.categories?.some(c => c.toLowerCase() === category.toLowerCase())
      );
      
      if (matchingVerses.length === 0) return null;
      
      this.verseCaches[lang].set(category, matchingVerses);
      
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
    if (this.searchCaches[lang].has(cacheKey)) {
      return this.searchCaches[lang].get(cacheKey)!;
    }
    
    try {
      const allVerses = await this.getAllVerses(lang);
      const searchTerm = query.trim().toLowerCase();
      
      const results = allVerses.map(verse => {
        let score = 0;
        
        // Exact reference match (highest priority)
        if (verse.reference.toLowerCase() === searchTerm) {
          score += 100;
        } 
        // Partial reference match
        else if (verse.reference.toLowerCase().includes(searchTerm)) {
          score += 50;
          
          // Beginning of reference match (higher priority)
          if (verse.reference.toLowerCase().startsWith(searchTerm)) {
            score += 20;
          }
        }
        
        // Text content match
        const textLower = verse.text.toLowerCase();
        if (textLower === searchTerm) {
          score += 50; // Exact text match (very unlikely)
        } else if (textLower.includes(searchTerm)) {
          score += 30;
          
          // Word boundary match (higher priority)
          const words = textLower.split(/\s+/);
          if (words.some(word => word === searchTerm)) {
            score += 15;
          }
        }
        
        // Category match
        if (verse.categories && 
            verse.categories.some(cat => {
              const catLower = cat.toLowerCase();
              return catLower === searchTerm || catLower.includes(searchTerm);
            })) {
          score += 20;
        }
        
        return { verse, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.verse);
      
      this.searchCaches[lang].set(cacheKey, results);
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
      await this.getAllVerses(lang);
      
      for (const category of this.categories) {
        if (!this.verseCaches[lang].has(category)) {
          await this.getVersesByCategory(category, 25, lang);
        }
      }
    } catch (error) {
      console.error('Error preloading verses:', error);
    }
  }
  
  static clearCache(language?: string): void {
    const lang = language || this.currentLanguage;
    
    this.verseCaches[lang].clear();
    this.allVersesCaches[lang] = null;
    this.xmlDocPromises[lang] = null;
    this.categoryLastVerseIndex.clear();
    this.searchCaches[lang].clear();
  }
}

setTimeout(() => {
  BibleVerseService.preloadAllVerses();
}, 1000);

export default BibleVerseService;
