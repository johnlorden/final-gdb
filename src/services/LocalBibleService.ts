
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
      console.log(`Loading verses from: ${xmlUrl}`);
      
      const response = await fetch(xmlUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to load XML file: ${response.status}`);
      }
      
      const xmlText = await response.text();
      console.log(`XML text length for ${language}:`, xmlText.length);
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        console.error('XML parsing error:', parseError.textContent);
        throw new Error('XML parsing failed');
      }
      
      const verseElements = xmlDoc.getElementsByTagName('verse');
      console.log(`Found ${verseElements.length} verse elements for ${language}`);
      
      const verses = Array.from(verseElements).map(verse => {
        const textElement = verse.getElementsByTagName('text')[0];
        const referenceElement = verse.getElementsByTagName('reference')[0];
        const categoryElement = verse.getElementsByTagName('category')[0];
        
        const text = textElement?.textContent?.trim() || '';
        const reference = referenceElement?.textContent?.trim() || '';
        const categoryNode = categoryElement?.textContent?.trim() || '';
        const categories = categoryNode ? [categoryNode] : [];
        
        if (!text || !reference) {
          console.warn(`Invalid verse found in ${language}:`, { text, reference });
          return null;
        }
        
        return { 
          text, 
          reference, 
          categories,
          category: categoryNode
        };
      }).filter(verse => verse !== null) as VerseResult[];
      
      this.versesCache[language] = verses;
      console.log(`Successfully loaded ${verses.length} verses for ${language}`);
      return verses;
    } catch (error) {
      console.error(`Error loading verses for ${language}:`, error);
      // Fallback to English if Filipino fails
      if (language === 'fil') {
        console.log('Falling back to English verses for Filipino');
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
    if (verses.length === 0) {
      console.warn(`No verses available for language: ${language || this.currentLanguage}`);
      return null;
    }
    
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
      console.warn(`No verses found for category: ${category} in language: ${language || this.currentLanguage}`);
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
