
import { XmlParser } from './XmlParser';
import { XmlDocPromises } from '../types/BibleVerseTypes';

export class XmlFileLoader {
  private static xmlDocPromises: XmlDocPromises = {
    en: null,
    fil: null
  };
  
  private static cachedXmlDocs: {
    en: Document | null;
    fil: Document | null;
  } = {
    en: null,
    fil: null
  };
  
  static async loadXmlDoc(language: string = 'en'): Promise<Document> {
    const lang = language === 'fil' ? 'fil' : 'en';
    
    // Check cached document first for better offline performance
    if (this.cachedXmlDocs[lang]) {
      console.log(`Using cached XML document for ${lang}`);
      return this.cachedXmlDocs[lang]!;
    }
    
    if (!this.xmlDocPromises[lang]) {
      const filePath = lang === 'fil' ? 'bible-verses-fil.xml' : 'bible-verses.xml';
      const url = `/data/${filePath}`;
      
      console.log(`Attempting to load XML from: ${url}`);
      
      // Try to load from cache first
      const cachedXml = localStorage.getItem(`bible_xml_${lang}`);
      if (cachedXml) {
        try {
          console.log(`Found cached XML for ${lang} in local storage, parsing...`);
          const doc = XmlParser.parseXmlDocument(cachedXml);
          this.cachedXmlDocs[lang] = doc;
          this.xmlDocPromises[lang] = Promise.resolve(doc);
          return doc;
        } catch (error) {
          console.warn(`Error parsing cached XML for ${lang}`, error);
          localStorage.removeItem(`bible_xml_${lang}`);
        }
      }
      
      // If not in cache, load from network
      this.xmlDocPromises[lang] = fetch(url)
        .then(response => {
          if (!response.ok) {
            if (lang === 'fil') {
              console.warn('Filipino Bible verses not found, falling back to English');
              return fetch('/data/bible-verses.xml');
            }
            throw new Error(`Failed to load Bible verses XML: ${response.status} ${response.statusText}`);
          }
          return response;
        })
        .then(response => response.text())
        .then(xmlText => {
          // Cache the XML in localStorage for offline use
          try {
            localStorage.setItem(`bible_xml_${lang}`, xmlText);
            console.log(`Cached XML for ${lang} in local storage`);
          } catch (error) {
            console.warn('Error caching XML in localStorage:', error);
          }
          
          const doc = XmlParser.parseXmlDocument(xmlText);
          this.cachedXmlDocs[lang] = doc;
          return doc;
        })
        .catch(error => {
          console.error(`Error loading XML document for ${lang}:`, error);
          this.xmlDocPromises[lang] = null;
          throw error;
        });
    }
    return this.xmlDocPromises[lang]!;
  }
  
  static clearPromiseCache(language: string): void {
    const lang = language as keyof XmlDocPromises;
    this.xmlDocPromises[lang] = null;
    this.cachedXmlDocs[lang] = null;
    
    // Also clear from local storage if needed
    try {
      localStorage.removeItem(`bible_xml_${language}`);
    } catch (error) {
      console.warn(`Error clearing XML cache for ${language}:`, error);
    }
  }
  
  static preloadAllLanguages(): void {
    // Preload English
    this.loadXmlDoc('en').catch(err => console.warn('Failed to preload English XML', err));
    
    // Preload Filipino
    this.loadXmlDoc('fil').catch(err => console.warn('Failed to preload Filipino XML', err));
  }
}
