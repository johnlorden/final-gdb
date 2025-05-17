
import { XmlLoader } from './xml/XmlLoader';
import { XmlManager } from './xml/XmlManager';
import { XmlCache } from './xml/XmlCache';

export class XmlFileLoader {
  private static isInitialized = false;
  private static initPromise: Promise<void> | null = null;
  
  static async initializeXmlUrls(): Promise<void> {
    if (this.isInitialized) return Promise.resolve();
    
    if (this.initPromise) {
      return this.initPromise;
    }
    
    this.initPromise = this._initialize();
    return this.initPromise;
  }
  
  private static async _initialize(): Promise<void> {
    try {
      await XmlManager.initializeXmlUrls();
      this.isInitialized = true;
      console.log("XmlFileLoader initialized successfully");
    } catch (error) {
      console.error("Error initializing XML URLs:", error);
    } finally {
      this.initPromise = null;
    }
  }
  
  static isLanguageDisabled(language: string): boolean {
    // English is always available
    if (language === 'en') return false;
    return XmlManager.isLanguageDisabled(language);
  }
  
  static async loadXmlDoc(language: string = 'en'): Promise<Document> {
    if (!this.isInitialized) {
      await this.initializeXmlUrls();
    }
    
    // Always default to English if the requested language is disabled
    if (language !== 'en' && XmlManager.isLanguageDisabled(language)) {
      console.warn(`Language ${language} is disabled, using English instead`);
      language = 'en';
    }
    
    try {
      return await XmlLoader.loadXmlDoc(language);
    } catch (error) {
      console.error(`Error loading XML for language ${language}, falling back to English:`, error);
      // Fall back to English if there's an error
      if (language !== 'en') {
        return XmlLoader.loadXmlDoc('en');
      }
      throw error;
    }
  }
  
  static clearPromiseCache(language: string): void {
    XmlLoader.clearPromiseCache(language);
  }
  
  static preloadAllLanguages(): void {
    this.initializeXmlUrls().then(() => {
      // Always preload English
      XmlLoader.loadXmlDoc('en').catch(err => 
        console.error("Failed to preload English XML", err)
      );
    });
  }
  
  static async addLanguageXml(languageCode: string, xmlUrl: string): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initializeXmlUrls();
      }
      
      const success = await XmlManager.addLanguageXml(languageCode, xmlUrl);
      
      if (success) {
        this.clearPromiseCache(languageCode);
      }
      
      return success;
    } catch (error) {
      console.error(`Error adding language XML for ${languageCode}:`, error);
      return false;
    }
  }
  
  static getAvailableLanguages(): string[] {
    return XmlManager.getAvailableLanguages();
  }
  
  static getDisabledLanguages(): string[] {
    return XmlManager.getDisabledLanguages();
  }
}

// Initialize on load
XmlFileLoader.preloadAllLanguages();
