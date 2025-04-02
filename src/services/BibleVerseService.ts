
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
        .then(xmlText => this.parser.parseFromString(xmlText, 'text/xml'))
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

  static async getRandomVerse(): Promise<VerseResult | null> {
    try {
      const allVerses = await this.getAllVerses();
      if (allVerses.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * allVerses.length);
      return allVerses[randomIndex];
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
      const allVerses = await this.getAllVerses();
      const matchingVerses = allVerses.filter(verse => 
        verse.categories?.some(c => c.toLowerCase() === category.toLowerCase())
      );
      
      if (matchingVerses.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * matchingVerses.length);
      return matchingVerses[randomIndex];
    } catch (error) {
      console.error(`Error fetching verse by category '${category}':`, error);
      return null;
    }
  }
  
  // Get multiple verses by category for caching
  static async getVersesByCategory(category: string, count = 10): Promise<VerseResult[] | null> {
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
      
      // Shuffle array to get random verses
      const shuffled = [...matchingVerses].sort(() => 0.5 - Math.random());
      // Get subset of verses
      const selectedVerses = shuffled.slice(0, Math.min(count, shuffled.length));
      
      // Store in cache
      this.verseCache.set(category, selectedVerses);
      
      return selectedVerses;
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
      
      // Find the verse by matching reference
      const matchingVerse = allVerses.find(verse => 
        verse.reference.toLowerCase().includes(searchRef)
      );
      
      if (!matchingVerse) return null;
      
      return matchingVerse;
    } catch (error) {
      console.error(`Error fetching verse by reference '${reference}':`, error);
      return null;
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
          await this.getVersesByCategory(category, 15);
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
  }
}

// Start preloading verses in the background
BibleVerseService.preloadAllVerses();

export default BibleVerseService;
