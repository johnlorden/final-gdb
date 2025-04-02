
import { DOMParser } from '@xmldom/xmldom';

interface VerseResult {
  text: string;
  reference: string;
  categories?: string[];
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
  
  // Cache the XML document and verses for better performance
  private static xmlDocPromise: Promise<Document> | null = null;
  private static verseCache: Map<string, VerseResult[]> = new Map();
  private static allVersesCache: VerseResult[] | null = null;
  private static categoryLastVerseIndex: Map<string, number> = new Map();

  // Get the XML document, loading it only once
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
          // Reset promise so it can try again
          this.xmlDocPromise = null;
          throw error;
        });
    }
    return this.xmlDocPromise;
  }

  // Parse all verses once and cache them
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
        const categoriesNode = verse.getElementsByTagName('categories')[0]?.textContent || 
                              verse.getElementsByTagName('category')[0]?.textContent || '';
        const categories = categoriesNode.split(',').map(c => c.trim()).filter(c => c);
        
        return { text, reference, categories };
      });
      
      return this.allVersesCache;
    } catch (error) {
      console.error('Error parsing all verses:', error);
      return [];
    }
  }

  // Helper method to get a random verse that hasn't been shown recently
  private static getRandomVerseFromArray(verses: VerseResult[], category: string = 'All'): VerseResult {
    if (verses.length === 0) {
      throw new Error('No verses available');
    }
    
    if (verses.length === 1) {
      return verses[0];
    }
    
    let lastIndex = this.categoryLastVerseIndex.get(category) ?? -1;
    let randomIndex;
    
    // Make sure we don't show the same verse twice in a row
    do {
      randomIndex = Math.floor(Math.random() * verses.length);
    } while (randomIndex === lastIndex && verses.length > 1);
    
    // Store this index as the last one shown for this category
    this.categoryLastVerseIndex.set(category, randomIndex);
    
    return verses[randomIndex];
  }

  static async getRandomVerse(): Promise<VerseResult | null> {
    try {
      const allVerses = await this.getAllVerses();
      if (allVerses.length === 0) return null;
      
      return this.getRandomVerseFromArray(allVerses);
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
      // Check if we already have cached verses for this category
      if (this.verseCache.has(category)) {
        const cachedVerses = this.verseCache.get(category)!;
        if (cachedVerses.length > 0) {
          return this.getRandomVerseFromArray(cachedVerses, category);
        }
      }
      
      // If not cached, get all verses for this category
      const allVerses = await this.getAllVerses();
      const matchingVerses = allVerses.filter(verse => 
        verse.categories?.some(c => c.toLowerCase() === category.toLowerCase())
      );
      
      if (matchingVerses.length === 0) return null;
      
      // Cache these verses for future use
      this.verseCache.set(category, matchingVerses);
      
      return this.getRandomVerseFromArray(matchingVerses, category);
    } catch (error) {
      console.error(`Error fetching verse by category '${category}':`, error);
      return null;
    }
  }
  
  // Get multiple verses by category for caching
  static async getVersesByCategory(category: string, count = 20): Promise<VerseResult[] | null> {
    if (category === 'All') {
      return null;
    }
    
    // Check cache first
    if (this.verseCache.has(category)) {
      return this.verseCache.get(category) || null;
    }
    
    try {
      const allVerses = await this.getAllVerses();
      const matchingVerses = allVerses.filter(verse => 
        verse.categories?.some(c => c.toLowerCase() === category.toLowerCase())
      );
      
      if (matchingVerses.length === 0) return null;
      
      // Store in cache
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
      
      // Normalize the search reference
      const searchRef = reference.trim().toLowerCase();
      
      // Find exact matches first
      let matchingVerse = allVerses.find(verse => 
        verse.reference.toLowerCase() === searchRef
      );
      
      // If no exact match, look for partial matches
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
  
  // Method to search verses by text content
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
  
  // Method to get available categories
  static getCategories(): string[] {
    return this.categories;
  }
  
  // Method to preload all verses for faster access
  static async preloadAllVerses(): Promise<void> {
    try {
      await this.getAllVerses();
      
      // Preload verses for each category
      for (const category of this.categories) {
        if (!this.verseCache.has(category)) {
          await this.getVersesByCategory(category, 25);
        }
      }
    } catch (error) {
      console.error('Error preloading verses:', error);
    }
  }
  
  // Clear cache if needed
  static clearCache(): void {
    this.verseCache.clear();
    this.allVersesCache = null;
    this.xmlDocPromise = null;
    this.categoryLastVerseIndex.clear();
  }
}

// Start preloading verses in the background after a small delay
// Using setTimeout to not block initial page load
setTimeout(() => {
  BibleVerseService.preloadAllVerses();
}, 1000);

export default BibleVerseService;
