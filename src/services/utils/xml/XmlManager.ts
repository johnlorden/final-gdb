
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
  
  static isLanguageDisabled(language: string): boolean {
    return this.disabledLanguages.has(language);
  }
  
  static disableLanguage(language: string): void {
    this.disabledLanguages.add(language);
    
    // Update language status in database
    LanguageService.updateLanguageStatus(language, false)
      .then(() => console.log(`Disabled language ${language}`))
      .catch(err => console.error(`Failed to update language status for ${language}`, err));
  }
  
  static getXmlUrl(language: string): string {
    // Check if language is disabled
    if (this.disabledLanguages.has(language)) {
      console.warn(`Language ${language} is disabled due to previous errors, falling back to English`);
      language = 'en';
    }
    
    // Check if we support this language
    if (!this.xmlUrlMap[language]) {
      console.warn(`Language ${language} not found in XML URL mappings, falling back to English`);
      language = 'en';
    }
    
    return this.xmlUrlMap[language];
  }
  
  static async addLanguageXml(languageCode: string, xmlUrl: string): Promise<boolean> {
    this.xmlUrlMap[languageCode] = xmlUrl;
    
    // Remove from disabled languages if it was previously disabled
    this.disabledLanguages.delete(languageCode);
    
    return true;
  }
}

// Initialize XML URLs when module loads
setTimeout(() => {
  XmlManager.initializeXmlUrls();
}, 2000);
