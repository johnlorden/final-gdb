
import { VerseResult } from '../types/BibleVerseTypes';

// Create a DOMParser instance for XML parsing
const domParser = new DOMParser();

export class XmlParser {
  static parseXmlDocument(xmlText: string): Document {
    if (!xmlText || xmlText.trim() === '') {
      throw new Error('Empty XML content received');
    }
    
    if (xmlText.includes('<!DOCTYPE html>')) {
      throw new Error('Received HTML instead of XML, check server configuration');
    }
    
    try {
      const parsedDoc = domParser.parseFromString(xmlText, 'text/xml');
      const verses = parsedDoc.getElementsByTagName('verse');
      if (verses.length === 0) {
        console.warn('No verses found in parsed XML document');
      } else {
        console.log(`Successfully loaded ${verses.length} verses`);
      }
      return parsedDoc;
    } catch (parseError) {
      console.error('Error parsing XML:', parseError);
      throw parseError;
    }
  }
  
  static extractVersesFromDocument(xmlDoc: Document): VerseResult[] {
    const verses = Array.from(xmlDoc.getElementsByTagName('verse'));
    
    if (verses.length === 0) {
      console.warn('No verses found in XML document');
      return [];
    }
    
    return verses.map(verse => {
      const text = verse.getElementsByTagName('text')[0]?.textContent || '';
      const reference = verse.getElementsByTagName('reference')[0]?.textContent || '';
      const categoryNode = verse.getElementsByTagName('category')[0]?.textContent || '';
      const categories = categoryNode ? [categoryNode] : [];
      
      return { 
        text, 
        reference, 
        categories,
        category: categoryNode
      };
    });
  }
}
