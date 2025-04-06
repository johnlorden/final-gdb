
import { XmlParser } from './XmlParser';
import { XmlDocPromises } from '../types/BibleVerseTypes';
import LanguageService from '../LanguageService';

export class XmlFileLoader {
  private static xmlDocPromises: XmlDocPromises = {
    en: null,
    fil: null
  };
  
  private static cachedXmlDocs: {
    [key: string]: Document | null;
  } = {
    en: null,
    fil: null
  };

  private static xmlUrlMap: {
    [key: string]: string;
  } = {
    en: '/data/bible-verses.xml',
    fil: '/data/bible-verses-fil.xml'
  };
  
  /**
   * Initialize XML URL mappings from the database
   */
  static async initializeXmlUrls(): Promise<void> {
    try {
      const languages = await LanguageService.getActiveLanguages();
      
      languages.forEach(lang => {
        this.xmlUrlMap[lang.language_code] = lang.xml_url;
      });
      
      console.log('Initialized XML URLs for languages:', Object.keys(this.xmlUrlMap).join(', '));
    } catch (error) {
      console.error('Error initializing XML URLs:', error);
    }
  }
  
  static async loadXmlDoc(language: string = 'en'): Promise<Document> {
    // Ensure the xmlUrlMap is initialized
    if (Object.keys(this.xmlUrlMap).length <= 2) {
      await this.initializeXmlUrls();
    }
    
    // Check if we support this language
    if (!this.xmlUrlMap[language]) {
      console.warn(`Language ${language} not found in XML URL mappings, falling back to English`);
      language = 'en';
    }
    
    // Check cached document first for better offline performance
    if (this.cachedXmlDocs[language]) {
      console.log(`Using cached XML document for ${language}`);
      return this.cachedXmlDocs[language]!;
    }
    
    if (!this.xmlDocPromises[language]) {
      const filePath = this.xmlUrlMap[language];
      let url = filePath;
      
      // Add server base URL if the path is not absolute and not already a full URL
      if (!filePath.startsWith('http') && !filePath.startsWith('/')) {
        url = `/${filePath}`;
      }
      
      console.log(`Attempting to load XML from: ${url} for language: ${language}`);
      
      // Try to load from cache first
      const cachedXml = localStorage.getItem(`bible_xml_${language}`);
      if (cachedXml) {
        try {
          console.log(`Found cached XML for ${language} in local storage, parsing...`);
          const doc = XmlParser.parseXmlDocument(cachedXml);
          this.cachedXmlDocs[language] = doc;
          this.xmlDocPromises[language] = Promise.resolve(doc);
          return doc;
        } catch (error) {
          console.warn(`Error parsing cached XML for ${language}`, error);
          localStorage.removeItem(`bible_xml_${language}`);
        }
      }
      
      // If not in cache, load from network
      this.xmlDocPromises[language] = fetch(url)
        .then(response => {
          if (!response.ok) {
            if (language !== 'en') {
              console.warn(`${language} Bible verses not found, falling back to English`);
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
            localStorage.setItem(`bible_xml_${language}`, xmlText);
            console.log(`Cached XML for ${language} in local storage`);
          } catch (error) {
            console.warn('Error caching XML in localStorage:', error);
          }
          
          const doc = XmlParser.parseXmlDocument(xmlText);
          this.cachedXmlDocs[language] = doc;
          return doc;
        })
        .catch(error => {
          console.error(`Error loading XML document for ${language}:`, error);
          this.xmlDocPromises[language] = null;
          throw error;
        });
    }
    return this.xmlDocPromises[language]!;
  }
  
  static clearPromiseCache(language: string): void {
    this.xmlDocPromises[language] = null;
    this.cachedXmlDocs[language] = null;
    
    // Also clear from local storage if needed
    try {
      localStorage.removeItem(`bible_xml_${language}`);
    } catch (error) {
      console.warn(`Error clearing XML cache for ${language}:`, error);
    }
  }
  
  static preloadAllLanguages(): void {
    // Get all active languages from our map
    Object.keys(this.xmlUrlMap).forEach(lang => {
      this.loadXmlDoc(lang).catch(err => 
        console.warn(`Failed to preload ${lang} XML`, err)
      );
    });
  }
  
  static async addLanguageXml(languageCode: string, xmlUrl: string): Promise<boolean> {
    this.xmlUrlMap[languageCode] = xmlUrl;
    
    // Try to load the XML to verify it's valid
    try {
      await this.loadXmlDoc(languageCode);
      return true;
    } catch (error) {
      console.error(`Failed to load XML for language ${languageCode}:`, error);
      delete this.xmlUrlMap[languageCode];
      return false;
    }
  }
}

// Initialize XML URLs when module loads
setTimeout(() => {
  XmlFileLoader.initializeXmlUrls();
}, 2000);
