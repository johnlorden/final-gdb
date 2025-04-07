
import React from 'react';
import { VerseContextProvider } from '@/contexts/VerseContext';
import { SettingsContextProvider } from '@/contexts/SettingsContext';

export const useAppContext = () => {
  // This is a composite hook that combines both contexts
  const verse = require('@/contexts/VerseContext').useVerseContext();
  const settings = require('@/contexts/SettingsContext').useSettingsContext();
  
  return {
    ...verse,
    ...settings
  };
};

export const AppContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <SettingsContextProvider>
      <VerseContextProvider>
        {children}
      </VerseContextProvider>
    </SettingsContextProvider>
  );
};

export default AppContextProvider;
