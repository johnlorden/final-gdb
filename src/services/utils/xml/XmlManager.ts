
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
  
  static async initializeXmlUrls(): Promise<void> {
    try {
      const languages = await LanguageService.getActiveLanguages();
      
      languages.forEach(lang => {
        if (lang.is_active) {
          this.xmlUrlMap[lang.language_code] = lang.xml_url;
        } else {
          this.disabledLanguages.add(lang.language_code);
        }
      });
      
      console.log('Initialized XML URLs for languages:', Object.keys(this.xmlUrlMap).join(', '));
    } catch (error) {
      console.error('Error initializing XML URLs:', error);
      console.log('Falling back to local languages: en, fil');
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
    
    LanguageService.updateLanguageStatus(language, false)
      .then(() => console.log(`Disabled language ${language}`))
      .catch(err => console.error(`Failed to update language status for ${language}`, err));
    
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
    this.xmlUrlMap[languageCode] = xmlUrl;
    
    this.disabledLanguages.delete(languageCode);
    
    return true;
  }
}

XmlManager.initializeXmlUrls().catch(err => 
  console.error("Failed to initialize XML URLs:", err)
);
