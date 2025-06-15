
import { VerseResult } from './types/BibleVerseTypes';

class LocalBibleService {
  private static categories = [
    'Faith', 'Love', 'Hope', 'Wisdom', 'Prayer',
    'Forgiveness', 'Peace', 'Salvation', 'Strength',
    'Comfort', 'Guidance', 'Joy', 'Gratitude', 'Humility',
    'Perseverance', 'Courage', 'Patience', 'Righteousness',
    'Encouragement', 'Protection', 'Spiritual Growth'
  ];
  
  private static currentLanguage: string = 'en';
  private static versesCache: { [key: string]: VerseResult[] } = {};
  private static isInitialized: boolean = false;

  static async initializeService(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Preload both languages
      await Promise.all([
        this.loadVerses('en'),
        this.loadVerses('fil')
      ]);
      
      this.isInitialized = true;
      console.log("LocalBibleService initialized successfully");
    } catch (error) {
      console.error("Failed to initialize LocalBibleService:", error);
    }
  }

  private static async loadVerses(language: string): Promise<VerseResult[]> {
    if (this.versesCache[language]) {
      return this.versesCache[language];
    }

    try {
      const xmlUrl = language === 'fil' ? '/data/bible-verses-fil.xml' : '/data/bible-verses.xml';
      const response = await fetch(xmlUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to load XML file: ${response.status}`);
      }
      
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const verses = Array.from(xmlDoc.getElementsByTagName('verse')).map(verse => {
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
      
      this.versesCache[language] = verses;
      console.log(`Loaded ${verses.length} verses for ${language}`);
      return verses;
    } catch (error) {
      console.error(`Error loading verses for ${language}:`, error);
      // Fallback to English if Filipino fails
      if (language === 'fil') {
        return this.loadVerses('en');
      }
      return [];
    }
  }

  static setLanguage(language: string): void {
    this.currentLanguage = language;
    console.log(`Language set to: ${language}`);
  }
  
  static getLanguage(): string {
    return this.currentLanguage;
  }
  
  static async getAllVerses(language?: string): Promise<VerseResult[]> {
    const lang = language || this.currentLanguage;
    await this.initializeService();
    return this.versesCache[lang] || [];
  }

  static async getRandomVerse(language?: string): Promise<VerseResult | null> {
    const verses = await this.getAllVerses(language);
    if (verses.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * verses.length);
    return verses[randomIndex];
  }
  
  static async getVerseByCategory(category: string, language?: string): Promise<VerseResult | null> {
    if (category === 'All') {
      return this.getRandomVerse(language);
    }
    
    const verses = await this.getAllVerses(language);
    const matchingVerses = verses.filter(verse => 
      verse.categories?.some(c => c.toLowerCase() === category.toLowerCase())
    );
    
    if (matchingVerses.length === 0) {
      return this.getRandomVerse(language);
    }
    
    const randomIndex = Math.floor(Math.random() * matchingVerses.length);
    return matchingVerses[randomIndex];
  }
  
  static async getVerseByReference(reference: string, language?: string): Promise<VerseResult | null> {
    const verses = await this.getAllVerses(language);
    const searchRef = reference.trim().toLowerCase();
    
    return verses.find(verse => 
      verse.reference.toLowerCase().includes(searchRef)
    ) || null;
  }
  
  static async searchVerses(query: string, language?: string): Promise<VerseResult[]> {
    if (!query || query.trim().length < 2) return [];
    
    const verses = await this.getAllVerses(language);
    const searchTerm = query.trim().toLowerCase();
    
    return verses.filter(verse => 
      verse.text.toLowerCase().includes(searchTerm) ||
      verse.reference.toLowerCase().includes(searchTerm)
    ).slice(0, 20);
  }
  
  static getCategories(): string[] {
    return [...this.categories];
  }
}

export default LocalBibleService;
