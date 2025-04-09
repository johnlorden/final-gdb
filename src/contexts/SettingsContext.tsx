
import React, { createContext, useState, useEffect, useContext } from 'react';
import BibleVerseService from '../services/BibleVerseService';
import OfflineVerseService from '../services/OfflineVerseService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SettingsContextType {
  language: string;
  isOfflineMode: boolean;
  user: any;
  handleLanguageChange: (newLanguage: string) => void;
  toggleOfflineMode: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within a SettingsContextProvider");
  }
  return context;
};

export const SettingsContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { toast } = useToast();
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('app_language');
      return savedLanguage || 'en';
    }
    return 'en';
  });
  
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedOfflineMode = localStorage.getItem('offline_mode');
      return savedOfflineMode === 'true';
    }
    return false;
  });
  
  const [user, setUser] = useState<any>(null);
  
  // Set language in the Bible service whenever it changes
  useEffect(() => {
    const applyLanguageChange = async () => {
      try {
        // Check if language is valid before setting it
        const isAvailable = await BibleVerseService.isLanguageAvailable(language);
        
        if (isAvailable) {
          BibleVerseService.setLanguage(language);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('app_language', language);
          }
          
          // Dispatch a custom event to notify components about language change
          const event = new CustomEvent('language-changed', { detail: language });
          window.dispatchEvent(event);
        } else {
          console.warn(`Language ${language} is not available, defaulting to English`);
          setLanguage('en');
          toast({
            title: "Language Not Available",
            description: `The selected language is not available. Using English instead.`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error applying language change:', error);
        BibleVerseService.markLanguageAsInvalid(language);
        setLanguage('en');
        toast({
          title: "Language Error",
          description: `There was an error loading the language file. Using English instead.`,
          variant: "destructive"
        });
      }
    };
    
    applyLanguageChange();
  }, [language, toast]);
  
  // Save offline mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('offline_mode', isOfflineMode.toString());
    }
  }, [isOfflineMode]);
  
  // Check for auth status
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      
      // Subscribe to auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user || null);
          
          if (event === 'SIGNED_IN' && session?.user) {
            // Sync offline preferences with database
            await OfflineVerseService.syncUserLanguagePreferences(session.user.id);
          }
        }
      );
      
      return () => {
        if (authListener?.subscription?.unsubscribe) {
          authListener.subscription.unsubscribe();
        }
      };
    };
    
    checkUser();
  }, []);
  
  // Initialize offline cache if it's not valid
  useEffect(() => {
    const checkOfflineCache = async () => {
      if (isOfflineMode) {
        const downloadedLanguages = OfflineVerseService.getDownloadedLanguages();
        
        // If no languages are downloaded or current language not downloaded
        if (downloadedLanguages.length === 0 || 
            !downloadedLanguages.some(l => l.code === language)) {
          // Default to English if available
          if (downloadedLanguages.some(l => l.code === 'en')) {
            setLanguage('en');
          }
          // Otherwise, use the first available language
          else if (downloadedLanguages.length > 0) {
            setLanguage(downloadedLanguages[0].code);
          }
          // If no languages are downloaded at all, try to cache current language
          else {
            await OfflineVerseService.cacheVerses(100, language);
          }
        }
      }
    };
    
    checkOfflineCache();
  }, [isOfflineMode]);
  
  // Handle language switch
  const handleLanguageChange = (newLanguage: string) => {
    // Verify if the language is available in offline mode
    if (isOfflineMode && !OfflineVerseService.isLanguageDownloaded(newLanguage)) {
      toast({
        title: "Language Not Available Offline",
        description: `The selected language is not available in offline mode.`,
        variant: "destructive"
      });
      return; // Don't change language if not available offline
    }
    
    setLanguage(newLanguage);
  };
  
  // Toggle offline mode
  const toggleOfflineMode = () => {
    // When turning on offline mode, make sure current language is downloaded
    const newOfflineMode = !isOfflineMode;
    
    if (newOfflineMode && !OfflineVerseService.isLanguageDownloaded(language)) {
      // Switch to a downloaded language if available
      const downloadedLanguages = OfflineVerseService.getDownloadedLanguages();
      if (downloadedLanguages.length > 0) {
        // Prefer English if available
        const englishLang = downloadedLanguages.find(l => l.code === 'en');
        if (englishLang) {
          setLanguage('en');
        } else {
          // Otherwise use first available
          setLanguage(downloadedLanguages[0].code);
        }
      }
    }
    
    setIsOfflineMode(newOfflineMode);
  };

  const value = {
    language,
    isOfflineMode,
    user,
    handleLanguageChange,
    toggleOfflineMode,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export default SettingsContextProvider;
