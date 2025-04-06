
export interface BibleLanguage {
  id: string;
  language_code: string;
  language_name: string;
  xml_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserLanguagePreference {
  id: string;
  user_id: string;
  language_code: string;
  offline_enabled: boolean;
  verses_downloaded: number;
  last_downloaded: string | null;
  created_at: string;
  updated_at: string;
  bible_languages?: BibleLanguage;
}

export interface LanguageOption {
  value: string;
  label: string;
  url?: string;
}
