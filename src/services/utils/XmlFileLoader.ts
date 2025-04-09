
// This is a facade for the refactored XML utilities
import { XmlLoader } from './xml/XmlLoader';
import { XmlManager } from './xml/XmlManager';
import { XmlCache } from './xml/XmlCache';

export class XmlFileLoader {
  static async initializeXmlUrls(): Promise<void> {
    return XmlManager.initializeXmlUrls();
  }
  
  static isLanguageDisabled(language: string): boolean {
    return XmlManager.isLanguageDisabled(language);
  }
  
  static async loadXmlDoc(language: string = 'en'): Promise<Document> {
    return XmlLoader.loadXmlDoc(language);
  }
  
  static clearPromiseCache(language: string): void {
    XmlLoader.clearPromiseCache(language);
  }
  
  static preloadAllLanguages(): void {
    XmlLoader.preloadAllLanguages();
  }
  
  static async addLanguageXml(languageCode: string, xmlUrl: string): Promise<boolean> {
    return XmlManager.addLanguageXml(languageCode, xmlUrl);
  }
}

// Initialize XML URLs when module loads
setTimeout(() => {
  XmlFileLoader.initializeXmlUrls();
}, 2000);
