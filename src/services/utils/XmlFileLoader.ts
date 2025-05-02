
import { XmlLoader } from './xml/XmlLoader';
import { XmlManager } from './xml/XmlManager';
import { XmlCache } from './xml/XmlCache';

export class XmlFileLoader {
  private static isInitialized = false;
  
  static async initializeXmlUrls(): Promise<void> {
    if (this.isInitialized) return Promise.resolve();
    this.isInitialized = true;
    return XmlManager.initializeXmlUrls();
  }
  
  static isLanguageDisabled(language: string): boolean {
    return XmlManager.isLanguageDisabled(language);
  }
  
  static async loadXmlDoc(language: string = 'en'): Promise<Document> {
    if (!this.isInitialized) {
      await this.initializeXmlUrls();
    }
    return XmlLoader.loadXmlDoc(language);
  }
  
  static clearPromiseCache(language: string): void {
    XmlLoader.clearPromiseCache(language);
  }
  
  static preloadAllLanguages(): void {
    this.initializeXmlUrls().then(() => {
      XmlLoader.preloadAllLanguages();
    });
  }
  
  static async addLanguageXml(languageCode: string, xmlUrl: string): Promise<boolean> {
    return XmlManager.addLanguageXml(languageCode, xmlUrl);
  }
}

XmlFileLoader.initializeXmlUrls().catch(err => 
  console.error("Failed to initialize XML URLs:", err)
);
