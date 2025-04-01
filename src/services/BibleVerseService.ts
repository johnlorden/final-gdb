
import { DOMParser } from '@xmldom/xmldom';

interface VerseResult {
  text: string;
  reference: string;
}

class BibleVerseService {
  private static parser = new DOMParser();
  private static categories = [
    'faith', 'love', 'hope', 'wisdom', 'prayer',
    'forgiveness', 'peace', 'salvation', 'strength',
    'comfort', 'guidance', 'joy', 'gratitude', 'humility',
    'perseverance', 'courage', 'patience', 'righteousness'
  ];
  
  // Cache the XML document once it's loaded
  private static xmlDocPromise: Promise<Document> | null = null;

  // Get the XML document, loading it only once
  private static async getXmlDoc(): Promise<Document> {
    if (!this.xmlDocPromise) {
      this.xmlDocPromise = fetch('/data/bible-verses.xml')
        .then(response => response.text())
        .then(xmlText => this.parser.parseFromString(xmlText, 'text/xml'));
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
      
      return { text, reference };
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
      
      return { text, reference };
    } catch (error) {
      console.error(`Error fetching verse by category '${category}':`, error);
      return null;
    }
  }
  
  // New method to get multiple verses by category for caching
  static async getVersesByCategory(category: string, count = 5): Promise<VerseResult[] | null> {
    if (category === 'All') {
      return null;
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
      
      return selectedVerses.map(verse => {
        const text = verse.getElementsByTagName('text')[0]?.textContent || '';
        const reference = verse.getElementsByTagName('reference')[0]?.textContent || '';
        return { text, reference };
      });
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
      
      return { text, reference: actualReference };
    } catch (error) {
      console.error(`Error fetching verse by reference '${reference}':`, error);
      return null;
    }
  }
  
  static getCategories(): string[] {
    return this.categories;
  }
}

export default BibleVerseService;
