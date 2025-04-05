
import { XmlParser } from './XmlParser';
import { XmlDocPromises } from '../types/BibleVerseTypes';

export class XmlFileLoader {
  private static xmlDocPromises: XmlDocPromises = {
    en: null,
    fil: null
  };
  
  static async loadXmlDoc(language: string = 'en'): Promise<Document> {
    const lang = language === 'fil' ? 'fil' : 'en';
    
    if (!this.xmlDocPromises[lang]) {
      const filePath = lang === 'fil' ? 'bible-verses-fil.xml' : 'bible-verses.xml';
      const url = `/data/${filePath}`;
      
      console.log(`Attempting to load XML from: ${url}`);
      
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
          return XmlParser.parseXmlDocument(xmlText);
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
    this.xmlDocPromises[language as keyof XmlDocPromises] = null;
  }
}
