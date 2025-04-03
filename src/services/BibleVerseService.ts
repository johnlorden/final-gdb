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
    'Encouragement'
  ];
  
  private static xmlDocPromise: Promise<Document> | null = null;
  private static verseCache: Map<string, VerseResult[]> = new Map();
  private static allVersesCache: VerseResult[] | null = null;
  private static categoryLastVerseIndex: Map<string, number> = new Map();

  private static async getXmlDoc(): Promise<Document> {
    if (!this.xmlDocPromise) {
      this.xmlDocPromise = fetch('/data/bible-verses.xml')
        .then(response => {
          if (!response.ok) {
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
          this.xmlDocPromise = null;
          throw error;
        });
    }
    return this.xmlDocPromise;
  }

  private static async getAllVerses(): Promise<VerseResult[]> {
    if (this.allVersesCache) {
      return this.allVersesCache;
    }
    
    try {
      const xmlDoc = await this.getXmlDoc();
      const verses = Array.from(xmlDoc.getElementsByTagName('verse'));
      
      this.allVersesCache = verses.map(verse => {
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
      
      return this.allVersesCache;
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

  static async getRandomVerse(): Promise<VerseResult | null> {
    try {
      const allVerses = await this.getAllVerses();
      if (allVerses.length === 0) return null;
      
      const randomVerse = this.getRandomVerseFromArray(allVerses);
      return randomVerse;
    } catch (error) {
      console.error('Error fetching random verse:', error);
      return null;
    }
  }
  
  static async getVerseByCategory(category: string): Promise<VerseResult | null> {
    if (category === 'All') {
      return this.getRandomVerse();
    }
    
    try {
      if (this.verseCache.has(category)) {
        const cachedVerses = this.verseCache.get(category)!;
        if (cachedVerses.length > 0) {
          return this.getRandomVerseFromArray(cachedVerses, category);
        }
      }
      
      const allVerses = await this.getAllVerses();
      const matchingVerses = allVerses.filter(verse => 
        verse.categories?.some(c => c.toLowerCase() === category.toLowerCase())
      );
      
      if (matchingVerses.length === 0) return null;
      
      this.verseCache.set(category, matchingVerses);
      
      return this.getRandomVerseFromArray(matchingVerses, category);
    } catch (error) {
      console.error(`Error fetching verse by category '${category}':`, error);
      return null;
    }
  }
  
  static async getVersesByCategory(category: string, count = 20): Promise<VerseResult[] | null> {
    if (category === 'All') {
      return null;
    }
    
    if (this.verseCache.has(category)) {
      return this.verseCache.get(category) || null;
    }
    
    try {
      const allVerses = await this.getAllVerses();
      const matchingVerses = allVerses.filter(verse => 
        verse.categories?.some(c => c.toLowerCase() === category.toLowerCase())
      );
      
      if (matchingVerses.length === 0) return null;
      
      this.verseCache.set(category, matchingVerses);
      
      return matchingVerses;
    } catch (error) {
      console.error(`Error fetching multiple verses by category '${category}':`, error);
      return null;
    }
  }
  
  static async getVerseByReference(reference: string): Promise<VerseResult | null> {
    try {
      const allVerses = await this.getAllVerses();
      
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
  
  static async searchVersesByText(query: string): Promise<VerseResult[]> {
    if (!query || query.trim().length < 2) return [];
    
    try {
      const allVerses = await this.getAllVerses();
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
    return this.categories;
  }
  
  static async preloadAllVerses(): Promise<void> {
    try {
      await this.getAllVerses();
      
      for (const category of this.categories) {
        if (!this.verseCache.has(category)) {
          await this.getVersesByCategory(category, 25);
        }
      }
    } catch (error) {
      console.error('Error preloading verses:', error);
    }
  }
  
  static clearCache(): void {
    this.verseCache.clear();
    this.allVersesCache = null;
    this.xmlDocPromise = null;
    this.categoryLastVerseIndex.clear();
  }
}

setTimeout(() => {
  BibleVerseService.preloadAllVerses();
}, 1000);

export default BibleVerseService;
