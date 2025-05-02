
import React, { Suspense, lazy, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { HeaderSkeleton, PageSkeleton } from './LoadingSkeletons';
import { useAppContext } from './AppContext';
import { useToast } from '@/hooks/use-toast';

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
  
  const { toast } = useToast();
  
  // Listen for language errors
  useEffect(() => {
    const handleLanguageDisabled = (event: CustomEvent) => {
      const disabledLang = event.detail;
      toast({
        title: "Language Disabled",
        description: `The ${disabledLang} language has been disabled due to errors.`,
        variant: "destructive",
        duration: 3000
      });
    };
    
    window.addEventListener('language-disabled', handleLanguageDisabled as EventListener);
    return () => {
      window.removeEventListener('language-disabled', handleLanguageDisabled as EventListener);
    };
  }, [toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <ErrorBoundary>
        <Suspense fallback={<HeaderSkeleton />}>
          <Header 
            recentVerses={recentVerses} 
            onSelectVerse={handleSelectVerse}
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
            isOfflineMode={isOfflineMode}
            toggleOfflineMode={toggleOfflineMode}
          />
        </Suspense>
      </ErrorBoundary>
      
      <main className="flex-1 mt-16 flex justify-center">
        <div className="w-full max-w-4xl px-4">
          <ErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};
