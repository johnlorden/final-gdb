
import React from 'react';
import Header from './Header';
import SimpleLanguageSwitcher from './SimpleLanguageSwitcher';

interface AppLayoutProps {
  children: React.ReactNode;
  language: string;
  onLanguageChange: (language: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, language, onLanguageChange }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header>
        <SimpleLanguageSwitcher 
          currentLanguage={language} 
          onLanguageChange={onLanguageChange} 
        />
      </Header>
      <main>{children}</main>
    </div>
  );
};
