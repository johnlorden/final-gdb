
import { VerseResult } from '../types/BibleVerseTypes';
import { VerseCache } from './VerseCache';

export class VerseSelector {
  static getRandomVerseFromArray(verses: VerseResult[], category: string = 'All'): VerseResult {
    if (verses.length === 0) {
      throw new Error('No verses available');
    }
    
    if (verses.length === 1) {
      return verses[0];
    }
    
    let lastIndex = VerseCache.getCategoryLastIndex(category);
    let randomIndex;
    
    do {
      randomIndex = Math.floor(Math.random() * verses.length);
    } while (randomIndex === lastIndex && verses.length > 1);
    
    VerseCache.setCategoryLastIndex(category, randomIndex);
    
    return verses[randomIndex];
  }
  
  static rankSearchResults(verses: VerseResult[], searchTerm: string): VerseResult[] {
    const results = verses.map(verse => {
      let score = 0;
      
      if (verse.reference.toLowerCase() === searchTerm) {
        score += 100;
      } 
      else if (verse.reference.toLowerCase().includes(searchTerm)) {
        score += 50;
        
        if (verse.reference.toLowerCase().startsWith(searchTerm)) {
          score += 20;
        }
      }
      
      const textLower = verse.text.toLowerCase();
      if (textLower === searchTerm) {
        score += 50;
      } else if (textLower.includes(searchTerm)) {
        score += 30;
        
        const words = textLower.split(/\s+/);
        if (words.some(word => word === searchTerm)) {
          score += 15;
        }
      }
      
      if (verse.categories && 
          verse.categories.some(cat => {
            const catLower = cat.toLowerCase();
            return catLower === searchTerm || catLower.includes(searchTerm);
          })) {
        score += 20;
      }
      
      return { verse, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.verse);
    
    return results;
  }
}
