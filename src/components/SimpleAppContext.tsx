
import React from 'react';
import { useVerseContext } from '@/contexts/VerseContext';
import { useSimpleSettingsContext } from '@/contexts/SimpleSettingsContext';

export const useSimpleAppContext = () => {
  const verse = useVerseContext();
  const settings = useSimpleSettingsContext();
  
  return {
    ...verse,
    ...settings,
    language: settings.language || 'en'
  };
};

export default useSimpleAppContext;
