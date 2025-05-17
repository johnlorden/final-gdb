
import { supabase } from '@/integrations/supabase/client';
import { BibleLanguage, UserLanguagePreference } from '@/types/LanguageTypes';
import { XmlManager } from './utils/xml/XmlManager';

class LanguageService {
  static async getAllLanguages(): Promise<BibleLanguage[]> {
    try {
      const { data, error } = await supabase
        .from('bible_languages')
        .select('*')
        .order('language_name');
      
      if (error) {
        console.error('Error fetching languages:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAllLanguages:', error);
      return [];
    }
  }

  static async getActiveLanguages(): Promise<BibleLanguage[]> {
    try {
      const { data, error } = await supabase
        .from('bible_languages')
        .select('*')
        .eq('is_active', true)
        .order('language_name');
      
      if (error) {
        console.error('Error fetching active languages:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getActiveLanguages:', error);
      return [];
    }
  }

  static async getUserLanguagePreferences(userId: string): Promise<UserLanguagePreference[]> {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('user_language_preferences')
        .select(`
          *,
          bible_languages (*)
        `)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching user language preferences:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getUserLanguagePreferences:', error);
      return [];
    }
  }

  static async saveUserLanguagePreference(
    userId: string, 
    languageCode: string, 
    offlineEnabled: boolean = false,
    versesDownloaded: number = 0
  ): Promise<boolean> {
    if (!userId) return false;
    
    try {
      const { error } = await supabase
        .from('user_language_preferences')
        .upsert({
          user_id: userId,
          language_code: languageCode,
          offline_enabled: offlineEnabled,
          verses_downloaded: versesDownloaded,
          last_downloaded: offlineEnabled ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error saving user language preference:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in saveUserLanguagePreference:', error);
      return false;
    }
  }

  static async addLanguage(language: Omit<BibleLanguage, 'id' | 'created_at' | 'updated_at'>): Promise<BibleLanguage | null> {
    try {
      const { data, error } = await supabase
        .from('bible_languages')
        .insert({
          language_code: language.language_code,
          language_name: language.language_name,
          xml_url: language.xml_url,
          is_active: language.is_active || true
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding language:', error);
        return null;
      }
      
      await XmlManager.addLanguageXml(language.language_code, language.xml_url);
      return data;
    } catch (error) {
      console.error('Error in addLanguage:', error);
      return null;
    }
  }

  static async updateLanguage(language: BibleLanguage): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bible_languages')
        .update({
          language_name: language.language_name,
          xml_url: language.xml_url,
          is_active: language.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('language_code', language.language_code);
      
      if (error) {
        console.error('Error updating language:', error);
        return false;
      }
      
      if (language.is_active) {
        await XmlManager.addLanguageXml(language.language_code, language.xml_url);
      } else {
        XmlManager.disableLanguage(language.language_code);
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateLanguage:', error);
      return false;
    }
  }
  
  static async updateLanguageStatus(languageCode: string, isActive: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bible_languages')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('language_code', languageCode);
      
      if (error) {
        console.error('Error updating language status:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateLanguageStatus:', error);
      return false;
    }
  }

  static async verifyLanguages(): Promise<void> {
    try {
      const languages = await this.getAllLanguages();
      
      for (const language of languages) {
        if (language.language_code === 'en' || language.language_code === 'fil') continue;
        
        if (!language.xml_url) {
          await this.updateLanguageStatus(language.language_code, false);
          XmlManager.disableLanguage(language.language_code);
          continue;
        }
        
        try {
          const response = await fetch(language.xml_url, { method: 'HEAD' });
          if (!response.ok) {
            await this.updateLanguageStatus(language.language_code, false);
            XmlManager.disableLanguage(language.language_code);
          }
        } catch {
          await this.updateLanguageStatus(language.language_code, false);
          XmlManager.disableLanguage(language.language_code);
        }
      }
    } catch (error) {
      console.error('Error verifying languages:', error);
    }
  }
}

export default LanguageService;
