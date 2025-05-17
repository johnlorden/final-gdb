
import React from 'react';
import { useVerseContext as useVerseContextImport } from '@/contexts/VerseContext';
import { useSettingsContext } from '@/contexts/SettingsContext';

export const useAppContext = () => {
  // This is a composite hook that combines both contexts
  const verse = useVerseContextImport();
  const settings = useSettingsContext();
  
  return {
    ...verse,
    ...settings,
    language: settings.language || 'en' // Ensure English is the default
  };
};

// No need for the AppContextProvider component anymore since
// we're handling context providers in main.tsx

export default useAppContext;
