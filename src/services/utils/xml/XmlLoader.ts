
import { XmlParser } from '../XmlParser';
import { XmlDocPromises } from '../../types/BibleVerseTypes';
import { XmlManager } from './XmlManager';
import { XmlCache } from './XmlCache';

export class XmlLoader {
  private static xmlDocPromises: XmlDocPromises = {
    en: null,
    fil: null
  };
  
  static async loadXmlDoc(language: string = 'en'): Promise<Document> {
    // Check if language is valid
    if (XmlManager.isLanguageDisabled(language)) {
      console.warn(`Language ${language} is disabled due to previous errors, falling back to English`);
      language = 'en';
    }
    
    // Check cached document first for better offline performance
    const cachedDoc = XmlCache.getCachedDocument(language);
    if (cachedDoc) {
      console.log(`Using cached XML document for ${language}`);
      return cachedDoc;
    }
    
    // Check if we have a pending promise for this language
    if (!this.xmlDocPromises[language]) {
      // Try to load from localStorage cache first
      const localDoc = XmlCache.tryGetFromLocalStorage(language);
      if (localDoc) {
        this.xmlDocPromises[language] = Promise.resolve(localDoc);
        return localDoc;
      }
      
      // Get the XML URL for this language
      const url = XmlManager.getXmlUrl(language);
      
      // If not in cache, load from network
      this.xmlDocPromises[language] = this.fetchXmlDocument(url, language);
    }
    
    try {
      // Await the promise to get the actual Document
      const doc = await this.xmlDocPromises[language]!;
      
      // Validate that the document contains verses
      const verseCount = doc.getElementsByTagName('verse').length;
      if (verseCount === 0) {
        console.error(`XML document for ${language} doesn't contain any verses`);
        XmlManager.disableLanguage(language);
        
        if (language !== 'en') {
          console.warn(`Falling back to English`);
          return this.loadXmlDoc('en');
        }
        throw new Error(`No verses found in English XML document`);
      }
      
      return doc;
    } catch (error) {
      // If there was an error and this isn't English, try to fall back to English
      if (language !== 'en') {
        console.warn(`Error loading ${language}, falling back to English`);
        XmlManager.disableLanguage(language);
        return this.loadXmlDoc('en');
      }
      throw error;
    }
  }
  
  private static async fetchXmlDocument(url: string, language: string): Promise<Document> {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (language !== 'en') {
          console.warn(`${language} Bible verses not found, falling back to English`);
          // Disable the language because it's not working
          XmlManager.disableLanguage(language);
          
          const fallbackResponse = await fetch('/data/bible-verses.xml');
          const xmlText = await fallbackResponse.text();
          return this.processXmlText(language)(xmlText);
        }
        throw new Error(`Failed to load Bible verses XML: ${response.status} ${response.statusText}`);
      }
      
      const xmlText = await response.text();
      return this.processXmlText(language)(xmlText);
    } catch (error) {
      console.error(`Error loading XML document for ${language}:`, error);
      
      // Disable the language only if it's not English
      if (language !== 'en') {
        XmlManager.disableLanguage(language);
      }
      
      this.xmlDocPromises[language] = null;
      throw error;
    }
  }
  
  private static processXmlText(language: string) {
    return (xmlText: string): Document => {
      if (!xmlText || xmlText.trim().length === 0) {
        throw new Error(`Empty XML content for language ${language}`);
      }
      
      // Try to parse the XML to validate it
      try {
        const doc = XmlParser.parseXmlDocument(xmlText);
        
        // Validate that it contains verses
        const verseNodes = doc.getElementsByTagName('verse');
        if (verseNodes.length === 0) {
          throw new Error(`No verses found in XML for language ${language}`);
        }
        
        // Cache the XML in localStorage for offline use
        XmlCache.saveToLocalStorage(language, xmlText);
        XmlCache.setCachedDocument(language, doc);
        
        return doc;
      } catch (xmlError) {
        console.error(`Invalid XML format for language ${language}:`, xmlError);
        
        // Disable the language because it has invalid XML
        XmlManager.disableLanguage(language);
        
        // Fallback to English
        if (language !== 'en') {
          throw new Error(`Invalid XML format for ${language}. Falling back to English.`);
        }
        throw xmlError;
      }
    };
  }
  
  static clearPromiseCache(language: string): void {
    this.xmlDocPromises[language] = null;
    XmlCache.clearCache(language);
  }
  
  static preloadAllLanguages(): void {
    // Get all languages and preload them
    ['en', 'fil'].forEach(lang => {
      this.loadXmlDoc(lang).catch(err => 
        console.warn(`Failed to preload ${lang} XML`, err)
      );
    });
  }
}
