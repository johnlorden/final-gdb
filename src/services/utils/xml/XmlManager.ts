
// Update this file to make sure the disableLanguage method is available
export class XmlManager {
  private static xmlUrls: { [key: string]: string } = {
    en: 'https://raw.githubusercontent.com/username/repo/main/bible-verses.xml',
    fil: 'https://raw.githubusercontent.com/username/repo/main/bible-verses-fil.xml'
  };

  private static disabledLanguages: Set<string> = new Set();

  static async initializeXmlUrls(): Promise<void> {
    try {
      console.log("Initialized XML URLs for languages:", Object.keys(this.xmlUrls).join(", "));
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

  static getAvailableLanguages(): string[] {
    return Object.keys(this.xmlUrls);
  }

  static getDisabledLanguages(): string[] {
    return Array.from(this.disabledLanguages);
  }

  static async addLanguageXml(languageCode: string, xmlUrl: string): Promise<boolean> {
    try {
      if (this.xmlUrls[languageCode] && this.xmlUrls[languageCode] === xmlUrl) {
        console.log(`Language ${languageCode} already has URL ${xmlUrl}`);
        return true;
      }

      this.xmlUrls[languageCode] = xmlUrl;
      this.disabledLanguages.delete(languageCode); // Re-enable if it was disabled
      console.log(`Added/updated XML URL for language ${languageCode}: ${xmlUrl}`);
      return true;
    } catch (error) {
      console.error(`Error adding language XML for ${languageCode}:`, error);
      return false;
    }
  }
}
