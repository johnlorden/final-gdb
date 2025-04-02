
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
  
  // Cache the XML document once it's loaded
  private static xmlDocPromise: Promise<Document> | null = null;
  private static verseCache: Map<string, VerseResult[]> = new Map();

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

  static async getRandomVerse(): Promise<VerseResult | null> {
    try {
      const xmlDoc = await this.getXmlDoc();
      
      const verses = xmlDoc.getElementsByTagName('verse');
      if (verses.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * verses.length);
      const verseElement = verses[randomIndex];
      
      const text = verseElement.getElementsByTagName('text')[0]?.textContent || '';
      const reference = verseElement.getElementsByTagName('reference')[0]?.textContent || '';
      const categoriesNode = verseElement.getElementsByTagName('categories')[0]?.textContent || '';
      const categories = categoriesNode.split(',').map(c => c.trim()).filter(c => c);
      
      return { text, reference, categories };
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
      const xmlDoc = await this.getXmlDoc();
      
      const verses = Array.from(xmlDoc.getElementsByTagName('verse'));
      const matchingVerses = verses.filter(verse => {
        const categories = verse.getElementsByTagName('categories')[0]?.textContent || '';
        return categories.toLowerCase().includes(category.toLowerCase());
      });
      
      if (matchingVerses.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * matchingVerses.length);
      const verseElement = matchingVerses[randomIndex];
      
      const text = verseElement.getElementsByTagName('text')[0]?.textContent || '';
      const reference = verseElement.getElementsByTagName('reference')[0]?.textContent || '';
      const categoriesNode = verseElement.getElementsByTagName('categories')[0]?.textContent || '';
      const categories = categoriesNode.split(',').map(c => c.trim()).filter(c => c);
      
      return { text, reference, categories };
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
      const xmlDoc = await this.getXmlDoc();
      
      const verses = Array.from(xmlDoc.getElementsByTagName('verse'));
      const matchingVerses = verses.filter(verse => {
        const categories = verse.getElementsByTagName('categories')[0]?.textContent || '';
        return categories.toLowerCase().includes(category.toLowerCase());
      });
      
      if (matchingVerses.length === 0) return null;
      
      // Shuffle array to get random verses
      const shuffled = [...matchingVerses].sort(() => 0.5 - Math.random());
      // Get subset of verses
      const selectedVerses = shuffled.slice(0, Math.min(count, shuffled.length));
      
      const results = selectedVerses.map(verse => {
        const text = verse.getElementsByTagName('text')[0]?.textContent || '';
        const reference = verse.getElementsByTagName('reference')[0]?.textContent || '';
        const categoriesNode = verse.getElementsByTagName('categories')[0]?.textContent || '';
        const categories = categoriesNode.split(',').map(c => c.trim()).filter(c => c);
        return { text, reference, categories };
      });
      
      // Store in cache
      this.verseCache.set(category, results);
      
      return results;
    } catch (error) {
      console.error(`Error fetching multiple verses by category '${category}':`, error);
      return null;
    }
  }
  
  static async getVerseByReference(reference: string): Promise<VerseResult | null> {
    try {
      const xmlDoc = await this.getXmlDoc();
      
      const verses = Array.from(xmlDoc.getElementsByTagName('verse'));
      
      // Normalize the search reference
      const searchRef = reference.trim().toLowerCase();
      
      // Find the verse by matching reference
      const matchingVerse = verses.find(verse => {
        const verseRef = verse.getElementsByTagName('reference')[0]?.textContent || '';
        return verseRef.toLowerCase().includes(searchRef);
      });
      
      if (!matchingVerse) return null;
      
      const text = matchingVerse.getElementsByTagName('text')[0]?.textContent || '';
      const actualReference = matchingVerse.getElementsByTagName('reference')[0]?.textContent || '';
      const categoriesNode = matchingVerse.getElementsByTagName('categories')[0]?.textContent || '';
      const categories = categoriesNode.split(',').map(c => c.trim()).filter(c => c);
      
      return { text, reference: actualReference, categories };
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
      await this.getXmlDoc();
      
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
    this.xmlDocPromise = null;
  }
}

// Start preloading verses in the background
BibleVerseService.preloadAllVerses();

export default BibleVerseService;
