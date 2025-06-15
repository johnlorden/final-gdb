
import { VerseResult } from './types/BibleVerseTypes';
import LocalBibleService from './LocalBibleService';

class OfflineVerseService {
  private static isOffline = false;
  
  static setOfflineMode(offline: boolean) {
    this.isOffline = offline;
  }
  
  static getOfflineMode(): boolean {
    return this.isOffline;
  }
  
  static async getRandomVerse(): Promise<VerseResult | null> {
    return LocalBibleService.getRandomVerse();
  }
  
  static async getVerseByCategory(category: string): Promise<VerseResult | null> {
    return LocalBibleService.getVerseByCategory(category);
  }
  
  static async searchVerses(query: string): Promise<VerseResult[]> {
    return LocalBibleService.searchVerses(query);
  }
  
  static async getVerseByReference(reference: string): Promise<VerseResult | null> {
    return LocalBibleService.getVerseByReference(reference);
  }
  
  static getCategories(): string[] {
    return LocalBibleService.getCategories();
  }
}

export default OfflineVerseService;
