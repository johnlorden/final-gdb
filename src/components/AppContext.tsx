
import React from 'react';
import { VerseContextProvider, useVerseContext as useVerseContextImport } from '@/contexts/VerseContext';
import { SettingsContextProvider, useSettingsContext } from '@/contexts/SettingsContext';

export const useAppContext = () => {
  // This is a composite hook that combines both contexts
  const verse = useVerseContextImport();
  const settings = useSettingsContext();
  
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
