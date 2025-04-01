
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

  static async getRandomVerse(): Promise<VerseResult | null> {
    try {
      const response = await fetch('/data/bible-verses.xml');
      const xmlText = await response.text();
      const xmlDoc = this.parser.parseFromString(xmlText, 'text/xml');
      
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
    try {
      const response = await fetch('/data/bible-verses.xml');
      const xmlText = await response.text();
      const xmlDoc = this.parser.parseFromString(xmlText, 'text/xml');
      
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
  
  static async getVerseByReference(reference: string): Promise<VerseResult | null> {
    try {
      const response = await fetch('/data/bible-verses.xml');
      const xmlText = await response.text();
      const xmlDoc = this.parser.parseFromString(xmlText, 'text/xml');
      
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
