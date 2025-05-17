
import { XmlParser } from '../XmlParser';
import { XmlDocPromises } from '../../types/BibleVerseTypes';
import { XmlManager } from './XmlManager';
import { XmlCache } from './XmlCache';
import LanguageService from '../../LanguageService';

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
        this.xmlDocPromises[language] = Promise.resolve(localDoc);
        return localDoc;
      }
      
      const url = XmlManager.getXmlUrl(language);
      
      this.xmlDocPromises[language] = this.fetchXmlDocument(url, language);
    }
    
    try {
      const doc = await this.xmlDocPromises[language]!;
      
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
      if (language !== 'en') {
        console.warn(`Error loading ${language}, falling back to English`);
        XmlManager.disableLanguage(language);
        
        if (!XmlManager.isLocalLanguage(language)) {
          LanguageService.updateLanguageStatus(language, false)
            .catch(err => console.error(`Failed to update language status for ${language}:`, err));
        }
        
        return this.loadXmlDoc('en');
      }
      throw error;
    }
  }
  
  private static async fetchXmlDocument(url: string, language: string): Promise<Document> {
    try {
      if (XmlManager.isLocalLanguage(language)) {
        const localUrl = language === 'en' ? '/data/bible-verses.xml' : '/data/bible-verses-fil.xml';
        try {
          const response = await fetch(localUrl);
          if (response.ok) {
            const xmlText = await response.text();
            return this.processXmlText(language)(xmlText);
          }
        } catch (localError) {
          console.warn(`Failed to load local XML for ${language}, trying remote URL`);
        }
      }
      
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
      if (!response.ok) {
        if (language !== 'en') {
          console.warn(`${language} Bible verses not found, falling back to English`);
          XmlManager.disableLanguage(language);
          
          if (!XmlManager.isLocalLanguage(language)) {
            LanguageService.updateLanguageStatus(language, false)
              .catch(err => console.error(`Failed to update language status for ${language}:`, err));
          }
          
          const fallbackResponse = await fetch('/data/bible-verses.xml');
          const xmlText = await fallbackResponse.text();
          return this.processXmlText('en')(xmlText);
        }
        throw new Error(`Failed to load Bible verses XML: ${response.status} ${response.statusText}`);
      }
      
      const xmlText = await response.text();
      return this.processXmlText(language)(xmlText);
    } catch (error) {
      console.error(`Error loading XML document for ${language}:`, error);
      
      if (language !== 'en' && language !== 'fil') {
        XmlManager.disableLanguage(language);
        
        if (!XmlManager.isLocalLanguage(language)) {
          LanguageService.updateLanguageStatus(language, false)
            .catch(err => console.error(`Failed to update language status for ${language}:`, err));
        }
      }
      
      if (XmlManager.isLocalLanguage(language)) {
        this.xmlDocPromises[language] = null;
      }
      
      throw error;
    }
  }
  
  private static processXmlText(language: string) {
    return (xmlText: string): Document => {
      if (!xmlText || xmlText.trim().length === 0) {
        throw new Error(`Empty XML content for language ${language}`);
      }
      
      try {
        const doc = XmlParser.parseXmlDocument(xmlText);
        
        const verseNodes = doc.getElementsByTagName('verse');
        if (verseNodes.length === 0) {
          throw new Error(`No verses found in XML for language ${language}`);
        }
        
        XmlCache.saveToLocalStorage(language, xmlText);
        XmlCache.setCachedDocument(language, doc);
        
        return doc;
      } catch (xmlError) {
        console.error(`Invalid XML format for language ${language}:`, xmlError);
        
        if (!XmlManager.isLocalLanguage(language)) {
          XmlManager.disableLanguage(language);
          
          LanguageService.updateLanguageStatus(language, false)
            .catch(err => console.error(`Failed to update language status for ${language}:`, err));
        }
        
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
    this.loadXmlDoc('en').catch(err => 
      console.warn(`Failed to preload English XML`, err)
    );
    
    this.loadXmlDoc('fil').catch(err => 
      console.warn(`Failed to preload Filipino XML`, err)
    );
    
    setTimeout(() => {
      LanguageService.getActiveLanguages().then(languages => {
        languages.forEach(lang => {
          if (lang.language_code !== 'en' && lang.language_code !== 'fil' && lang.is_active) {
            this.loadXmlDoc(lang.language_code).catch(err => 
              console.warn(`Failed to preload ${lang.language_code} XML`, err)
            );
          }
        });
      }).catch(err => console.error("Failed to get languages for preloading:", err));
    }, 3000);
  }
}
