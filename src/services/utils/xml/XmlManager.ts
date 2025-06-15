
// Update this file to make sure the disableLanguage method is available
export class XmlManager {
  private static xmlUrls: { [key: string]: string } = {
    en: '/data/bible-verses.xml',
    fil: '/data/bible-verses-fil.xml'
  };

  private static disabledLanguages: Set<string> = new Set();

  static async initializeXmlUrls(): Promise<void> {
    try {
      console.log("Initialized local XML URLs for languages:", Object.keys(this.xmlUrls).join(", "));
      return Promise.resolve();
    } catch (error) {
      console.error("Error initializing XML URLs:", error);
      return Promise.reject(error);
    }
  }

  static getXmlUrl(language: string = 'en'): string {
    if (this.xmlUrls[language]) {
      return this.xmlUrls[language];
    }
    console.warn(`No XML URL defined for language ${language}, using English`);
    return this.xmlUrls['en'];
  }

  static isLanguageDisabled(language: string): boolean {
    return this.disabledLanguages.has(language);
  }

  static disableLanguage(language: string): void {
    if (language !== 'en') {  // Never disable English
      console.warn(`Disabling language ${language} due to errors`);
      this.disabledLanguages.add(language);
    }
  }

  static async addLanguageXml(languageCode: string, xmlUrl: string): Promise<boolean> {
    try {
      // For this local-only implementation, we only support en and fil
      if (languageCode === 'en' || languageCode === 'fil') {
        this.xmlUrls[languageCode] = xmlUrl;
        console.log(`Added XML URL for ${languageCode}: ${xmlUrl}`);
        return true;
      }
      
      console.warn(`Language ${languageCode} is not supported in local mode`);
      return false;
    } catch (error) {
      console.error(`Error adding language XML for ${languageCode}:`, error);
      return false;
    }
  }

  static getAvailableLanguages(): string[] {
    return Object.keys(this.xmlUrls);
  }

  static getDisabledLanguages(): string[] {
    return Array.from(this.disabledLanguages);
  }
}
