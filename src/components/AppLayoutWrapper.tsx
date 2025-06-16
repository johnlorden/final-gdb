
import React from 'react';
import { AppLayout } from './AppLayout';
import { useSimpleSettingsContext } from '@/contexts/SimpleSettingsContext';

interface AppLayoutWrapperProps {
  children: React.ReactNode;
}

export const AppLayoutWrapper: React.FC<AppLayoutWrapperProps> = ({ children }) => {
  const { language, handleLanguageChange } = useSimpleSettingsContext();

  return (
    <AppLayout 
      language={language} 
      onLanguageChange={handleLanguageChange}
    >
      {children}
    </AppLayout>
  );
};
