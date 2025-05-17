
import { XmlParser } from '../XmlParser';

export class XmlCache {
  private static cachedXmlDocs: {
    [key: string]: Document | null;
  } = {
    en: null,
    fil: null
  };
  
  static getCachedDocument(language: string): Document | null {
    return this.cachedXmlDocs[language] || null;
  }
  
  static setCachedDocument(language: string, doc: Document): void {
    this.cachedXmlDocs[language] = doc;
  }
  
  static clearCache(language: string): void {
    this.cachedXmlDocs[language] = null;
    
    try {
      localStorage.removeItem(`bible_xml_${language}`);
    } catch (error) {
      console.warn(`Error clearing XML cache for ${language}:`, error);
    }
  }
  
  static tryGetFromLocalStorage(language: string): Document | null {
    try {
      const cachedXml = localStorage.getItem(`bible_xml_${language}`);
      if (cachedXml) {
        console.log(`Found cached XML for ${language} in local storage, parsing...`);
        const doc = XmlParser.parseXmlDocument(cachedXml);
        this.setCachedDocument(language, doc);
        return doc;
      }
    } catch (error) {
      console.warn(`Error parsing cached XML for ${language}`, error);
      localStorage.removeItem(`bible_xml_${language}`);
    }
    return null;
  }
  
  static saveToLocalStorage(language: string, xmlText: string): void {
    try {
      localStorage.setItem(`bible_xml_${language}`, xmlText);
      console.log(`Cached XML for ${language} in local storage`);
    } catch (error) {
      console.warn('Error caching XML in localStorage:', error);
    }
  }
}
