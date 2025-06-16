
import { VerseResult } from './types/BibleVerseTypes';
import LocalBibleService from './LocalBibleService';

interface UserPreferences {
  backgroundImages?: string[];
  [key: string]: any;
}

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
  
  static getUserPreferences(): UserPreferences {
    try {
      const prefs = localStorage.getItem('user_preferences');
      return prefs ? JSON.parse(prefs) : { backgroundImages: [] };
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return { backgroundImages: [] };
    }
  }
  
  static saveUserPreferences(preferences: Partial<UserPreferences>): void {
    try {
      const existingPrefs = this.getUserPreferences();
      const updatedPrefs = { ...existingPrefs, ...preferences };
      localStorage.setItem('user_preferences', JSON.stringify(updatedPrefs));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }
}

export default OfflineVerseService;
