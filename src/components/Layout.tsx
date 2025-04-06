
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Toaster } from './ui/toaster';
import { ThemeProvider } from './ThemeProvider';

interface LayoutProps {
  recentVerses: any[];
  onSelectVerse: (verse: string, reference: string) => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  recentVerses,
  onSelectVerse,
  currentLanguage,
  onLanguageChange,
  isOfflineMode,
  toggleOfflineMode
}) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="bible-verse-theme">
      <div className="flex flex-col min-h-screen">
        <Header 
          recentVerses={recentVerses} 
          onSelectVerse={onSelectVerse}
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
          isOfflineMode={isOfflineMode}
          toggleOfflineMode={toggleOfflineMode}
        />
        <main className="flex-1 mt-16 flex justify-center">
          <div className="w-full max-w-4xl px-4">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default Layout;
