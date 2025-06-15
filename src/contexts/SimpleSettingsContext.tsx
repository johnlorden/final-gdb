
import React, { createContext, useState, useEffect, useContext } from 'react';
import LocalBibleService from '../services/LocalBibleService';

interface SimpleSettingsContextType {
  language: string;
  handleLanguageChange: (newLanguage: string) => void;
}

const SimpleSettingsContext = createContext<SimpleSettingsContextType | undefined>(undefined);

export const useSimpleSettingsContext = () => {
  const context = useContext(SimpleSettingsContext);
  if (!context) {
    throw new Error("useSimpleSettingsContext must be used within a SimpleSettingsContextProvider");
  }
  return context;
};

export const SimpleSettingsContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('app_language');
      return savedLanguage || 'en';
    }
    return 'en';
  });
  
  // Set language in the Bible service whenever it changes
  useEffect(() => {
    LocalBibleService.setLanguage(language);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_language', language);
    }
    
    // Dispatch a custom event to notify components about language change
    const event = new CustomEvent('language-changed', { detail: language });
    window.dispatchEvent(event);
  }, [language]);
  
  // Handle language switch
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const value = {
    language,
    handleLanguageChange,
  };

  return <SimpleSettingsContext.Provider value={value}>{children}</SimpleSettingsContext.Provider>;
};

export default SimpleSettingsContextProvider;
