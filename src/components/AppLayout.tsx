
import React from 'react';
import Header from './Header';
import { useSimpleAppContext } from './SimpleAppContext';
import SimpleLanguageSwitcher from './SimpleLanguageSwitcher';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { language, handleLanguageChange } = useSimpleAppContext();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header>
        <SimpleLanguageSwitcher 
          currentLanguage={language} 
          onLanguageChange={handleLanguageChange} 
        />
      </Header>
      <main>{children}</main>
    </div>
  );
};
