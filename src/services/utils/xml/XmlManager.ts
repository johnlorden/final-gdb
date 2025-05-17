
import { XmlParser } from '../XmlParser';
import LanguageService from '../../LanguageService';

export class XmlManager {
  private static xmlUrlMap: {
    [key: string]: string;
  } = {
    en: '/data/bible-verses.xml',
    fil: '/data/bible-verses-fil.xml'
  };
  
  private static disabledLanguages: Set<string> = new Set();
  private static localLanguages: Set<string> = new Set(['en', 'fil']);
  private static isInitializing = false;
  
  static async initializeXmlUrls(): Promise<void> {
    if (this.isInitializing) {
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!this.isInitializing) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    }
    
    this.isInitializing = true;
    
    try {
      const languages = await LanguageService.getActiveLanguages();
      
      languages.forEach(lang => {
        if (lang.language_code === 'en' || lang.language_code === 'fil') {
          return;
        }
        
        if (lang.is_active && lang.xml_url) {
          this.xmlUrlMap[lang.language_code] = lang.xml_url;
          this.disabledLanguages.delete(lang.language_code);
        } else {
          this.disabledLanguages.add(lang.language_code);
        }
      });
      
      console.log('Initialized XML URLs for languages:', Object.keys(this.xmlUrlMap).join(', '));
      
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('languages-initialized', { 
          detail: {
            availableLanguages: Object.keys(this.xmlUrlMap),
            disabledLanguages: Array.from(this.disabledLanguages)
          }
        });
        window.dispatchEvent(event);
      }
      
      setTimeout(() => {
        LanguageService.verifyLanguages().catch(err => 
          console.error("Failed to verify languages:", err)
        );
      }, 5000);
    } catch (error) {
      console.error('Error initializing XML URLs:', error);
      console.log('Falling back to local languages: en, fil');
    } finally {
      this.isInitializing = false;
    }
  }
  
  static isLanguageDisabled(language: string): boolean {
    return this.disabledLanguages.has(language);
  }

  static isLocalLanguage(language: string): boolean {
    return this.localLanguages.has(language);
  }
  
  static disableLanguage(language: string): void {
    if (this.isLocalLanguage(language)) {
      console.warn(`Cannot disable local language ${language}`);
      return;
    }
    
    this.disabledLanguages.add(language);
    
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('language-disabled', { detail: language });
      window.dispatchEvent(event);
    }
  }
  
  static getXmlUrl(language: string): string {
    if (this.disabledLanguages.has(language)) {
      console.warn(`Language ${language} is disabled due to previous errors, falling back to English`);
      language = 'en';
    }
    
    if (!this.xmlUrlMap[language]) {
      console.warn(`Language ${language} not found in XML URL mappings, falling back to English`);
      language = 'en';
    }
    
    return this.xmlUrlMap[language];
  }
  
  static async addLanguageXml(languageCode: string, xmlUrl: string): Promise<boolean> {
    if (languageCode === 'en' || languageCode === 'fil') {
      return true;
    }
    
    this.xmlUrlMap[languageCode] = xmlUrl;
    this.disabledLanguages.delete(languageCode);
    
    try {
      const response = await fetch(xmlUrl, { method: 'HEAD' });
      if (!response.ok) {
        this.disableLanguage(languageCode);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to validate XML URL for ${languageCode}:`, error);
      this.disableLanguage(languageCode);
      return false;
    }
  }
  
  static getAvailableLanguages(): string[] {
    return Object.keys(this.xmlUrlMap).filter(lang => !this.disabledLanguages.has(lang));
  }
  
  static getDisabledLanguages(): string[] {
    return Array.from(this.disabledLanguages);
  }
}

XmlManager.initializeXmlUrls().catch(err => 
  console.error("Failed to initialize XML URLs:", err)
);
