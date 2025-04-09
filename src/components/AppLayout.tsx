
import React, { Suspense, lazy } from 'react';
import { Skeleton } from './ui/skeleton';
import { useAppContext } from './AppContext';

// Lazy load the Header component
const Header = lazy(() => import('./Header'));

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
      <Suspense fallback={
        <div className="h-16 w-full bg-background/80 backdrop-blur-sm border-b dark:border-gray-800 fixed top-0 z-10">
          <div className="container px-4 h-full flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
      }>
        <Header 
          recentVerses={recentVerses} 
          onSelectVerse={handleSelectVerse}
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
          isOfflineMode={isOfflineMode}
          toggleOfflineMode={toggleOfflineMode}
        />
      </Suspense>
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
