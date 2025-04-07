
import React, { Suspense } from 'react';
import Header from './Header';
import { Skeleton } from './ui/skeleton';
import { useAppContext } from './AppContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { 
    recentVerses, 
    handleSelectVerse, 
    language, 
    isOfflineMode, 
    handleLanguageChange, 
    toggleOfflineMode 
  } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        recentVerses={recentVerses} 
        onSelectVerse={handleSelectVerse}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        isOfflineMode={isOfflineMode}
        toggleOfflineMode={toggleOfflineMode}
      />
      <main className="flex-1 mt-16 flex justify-center">
        <div className="w-full max-w-4xl px-4">
          <Suspense fallback={
            <div className="w-full py-10 flex justify-center">
              <Skeleton className="h-[400px] w-full max-w-2xl" />
            </div>
          }>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
};
