
import React, { Suspense } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import Header from './components/Header';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/ThemeProvider';
import { Skeleton } from './components/ui/skeleton';
import { AppContextProvider, useAppContext } from './components/AppContext';

// Export the context hook for use in other components
export function useVerseContext() {
  return useAppContext();
}

const AppContent = () => {
  const { recentVerses, handleSelectVerse, language, isOfflineMode, handleLanguageChange, toggleOfflineMode } = useAppContext();

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
          <Suspense fallback={<div className="w-full py-10 flex justify-center"><Skeleton className="h-[400px] w-full max-w-2xl" /></div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="bible-verse-theme">
      <AppContextProvider>
        <AppContent />
        <Toaster />
      </AppContextProvider>
    </ThemeProvider>
  );
};

export default App;
