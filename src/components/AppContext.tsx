
import React from 'react';
import { useVerseContext } from '@/contexts/VerseContext';
import { useSettingsContext } from '@/contexts/SettingsContext';

export const useAppContext = () => {
  // Access both context hooks
  const verse = useVerseContext();
  const settings = useSettingsContext();
  
  return {
    ...verse,
    ...settings,
    language: settings.language || 'en' // Ensure English is the default
  };
};

export default useAppContext;
