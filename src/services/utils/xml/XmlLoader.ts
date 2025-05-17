
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
    if (XmlManager.isLanguageDisabled(language)) {
      console.warn(`Language ${language} is disabled due to previous errors, falling back to English`);
      language = 'en';
    }
    
    const cachedDoc = XmlCache.getCachedDocument(language);
    if (cachedDoc) {
      console.log(`Using cached XML document for ${language}`);
      return cachedDoc;
    }
    
    if (!this.xmlDocPromises[language]) {
      const localDoc = XmlCache.tryGetFromLocalStorage(language);
      if (localDoc) {
        console.log(`Found cached XML for ${language} in localStorage`);
        this.xmlDocPromises[language] = Promise.resolve(localDoc);
        return localDoc;
      }
      
      console.log(`No cached XML found for ${language}, fetching from URL`);
      const url = XmlManager.getXmlUrl(language);
      console.log(`Fetching XML document from URL: ${url} for language: ${language}`);
      this.xmlDocPromises[language] = this.fetchXmlDocument(url, language);
    }
    
    try {
      console.log(`Waiting for XML promise to resolve for ${language}`);
      const doc = await this.xmlDocPromises[language]!;
      
      const verseCount = doc.getElementsByTagName('verse').length;
      console.log(`XML document for ${language} loaded with ${verseCount} verses`);
      
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
      console.error(`Error loading XML for ${language}:`, error);
      XmlManager.disableLanguage(language);
      
      if (language !== 'en') {
        console.warn(`Error loading ${language}, falling back to English`);
        return this.loadXmlDoc('en');
      }
      throw error;
    }
  }
  
  private static async fetchXmlDocument(url: string, language: string): Promise<Document> {
    try {
      // Always try to load from public folder first if it's English or Filipino
      if (language === 'en' || language === 'fil') {
        const fileName = language === 'en' ? 'bible-verses.xml' : 'bible-verses-fil.xml';
        try {
          const response = await fetch(`/data/${fileName}`);
          if (response.ok) {
            const xmlText = await response.text();
            const doc = XmlParser.parseXmlDocument(xmlText);
            console.log(`Successfully loaded ${language} XML document from public folder`);
            XmlCache.saveToLocalStorage(language, xmlText);
            XmlCache.setCachedDocument(language, doc);
            return doc;
          }
        } catch (localError) {
          console.warn(`Failed to load ${language} XML from public folder`, localError);
        }
      }
      
      // Fallback to remote URL
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load Bible verses XML: ${response.status} ${response.statusText}`);
      }
      
      const xmlText = await response.text();
      const doc = XmlParser.parseXmlDocument(xmlText);
      
      // Cache the result
      XmlCache.saveToLocalStorage(language, xmlText);
      XmlCache.setCachedDocument(language, doc);
      
      return doc;
    } catch (error) {
      console.error(`Error loading XML document for ${language}:`, error);
      
      // Disable the language for future attempts if it's not English
      if (language !== 'en') {
        XmlManager.disableLanguage(language);
        console.warn(`Error loading ${language} XML, falling back to English`);
        return this.loadXmlDoc('en');
      }
      
      throw error;
    }
  }
  
  static clearPromiseCache(language: string): void {
    this.xmlDocPromises[language] = null;
    XmlCache.clearCache(language);
  }
}
