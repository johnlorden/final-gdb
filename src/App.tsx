import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Bookmarks from './pages/Bookmarks';
import Header from './components/Header';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import BibleVerseService from './services/BibleVerseService';
import OfflineVerseService from './services/OfflineVerseService';
import { supabase } from '@/integrations/supabase/client';
import { XmlFileLoader } from './services/utils/XmlFileLoader';

interface VerseItem {
  verse: string;
  reference: string;
  timestamp: number;
}

const App = () => {
  // State management
  const [recentVerses, setRecentVerses] = useState<VerseItem[]>(() => {
    const saved = localStorage.getItem('recentVerses');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentVerse, setCurrentVerse] = useState({
    verse: '',
    reference: ''
  });
  
  const [language, setLanguage] = useState<string>(() => {
    const savedLanguage = localStorage.getItem('app_language');
    return savedLanguage || 'en';
  });
  
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(() => {
    const savedOfflineMode = localStorage.getItem('offline_mode');
    return savedOfflineMode === 'true';
  });
  
  const [user, setUser] = useState<any>(null);
  
  // Reference to track if we need to regenerate a verse on language change
  const shouldRegenerateRef = useRef(false);
  
  // Check for auth status
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      
      // Subscribe to auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user || null);
          
          if (event === 'SIGNED_IN' && session?.user) {
            // Sync offline preferences with database
            await OfflineVerseService.syncUserLanguagePreferences(session.user.id);
          }
        }
      );
      
      return () => {
        authListener?.subscription.unsubscribe();
      };
    };
    
    checkUser();
  }, []);
  
  // Initialize language files when app starts
  useEffect(() => {
    XmlFileLoader.initializeXmlUrls();
  }, []);
  
  // Set language in the Bible service whenever it changes
  useEffect(() => {
    BibleVerseService.setLanguage(language);
    localStorage.setItem('app_language', language);
    
    // Skip regeneration on first render
    if (shouldRegenerateRef.current && currentVerse.reference) {
      // Try to get the same verse in the new language
      BibleVerseService.getVerseByReference(currentVerse.reference)
        .then((result) => {
          if (result) {
            setCurrentVerse({
              verse: result.text,
              reference: result.reference
            });
          } else {
            // If verse not found in new language, get a random verse
            return BibleVerseService.getRandomVerse();
          }
          return null;
        })
        .then((randomResult) => {
          if (randomResult) {
            setCurrentVerse({
              verse: randomResult.text,
              reference: randomResult.reference
            });
          }
        })
        .catch(console.error);
    }
    
    // Set flag to true after first render
    if (!shouldRegenerateRef.current) {
      shouldRegenerateRef.current = true;
    }
  }, [language]);
  
  // Save recent verses to localStorage when updated
  useEffect(() => {
    localStorage.setItem('recentVerses', JSON.stringify(recentVerses));
  }, [recentVerses]);
  
  // Save offline mode preference
  useEffect(() => {
    localStorage.setItem('offline_mode', isOfflineMode.toString());
  }, [isOfflineMode]);
  
  // Initialize offline cache if it's not valid
  useEffect(() => {
    const checkOfflineCache = async () => {
      if (isOfflineMode) {
        const downloadedLanguages = OfflineVerseService.getDownloadedLanguages();
        
        // If no languages are downloaded or current language not downloaded
        if (downloadedLanguages.length === 0 || 
            !downloadedLanguages.some(l => l.code === language)) {
          // Default to English if available
          if (downloadedLanguages.some(l => l.code === 'en')) {
            setLanguage('en');
          }
          // Otherwise, use the first available language
          else if (downloadedLanguages.length > 0) {
            setLanguage(downloadedLanguages[0].code);
          }
          // If no languages are downloaded at all, try to cache current language
          else {
            await OfflineVerseService.cacheVerses(100, language);
          }
        }
      }
    };
    
    checkOfflineCache();
  }, [isOfflineMode]);

  // Handle selecting a verse from the dropdown
  const handleSelectVerse = (verse: string, reference: string) => {
    setCurrentVerse({ verse, reference });
    
    // Update URL if needed
    const url = new URL(window.location.href);
    url.searchParams.set('bibleverse', reference);
    window.history.pushState({}, '', url);
  };

  // Add a verse to recent verses
  const addToRecentVerses = (verse: string, reference: string) => {
    setCurrentVerse({ verse, reference });
    
    const newVerse = {
      verse,
      reference,
      timestamp: Date.now()
    };
    
    setRecentVerses(prev => {
      // Check if verse already exists
      const exists = prev.some(item => item.reference === reference);
      if (exists) {
        // Update timestamp of existing verse
        return prev.map(item => 
          item.reference === reference ? { ...item, timestamp: Date.now() } : item
        ).sort((a, b) => b.timestamp - a.timestamp);
      } else {
        // Add new verse and limit to 10 most recent
        return [newVerse, ...prev].slice(0, 10);
      }
    });
  };
  
  // Handle language switch
  const handleLanguageChange = (newLanguage: string) => {
    // Verify if the language is available in offline mode
    if (isOfflineMode && !OfflineVerseService.isLanguageDownloaded(newLanguage)) {
      return; // Don't change language if not available offline
    }
    
    setLanguage(newLanguage);
    BibleVerseService.setLanguage(newLanguage);
  };
  
  // Toggle offline mode
  const toggleOfflineMode = () => {
    // When turning on offline mode, make sure current language is downloaded
    const newOfflineMode = !isOfflineMode;
    
    if (newOfflineMode && !OfflineVerseService.isLanguageDownloaded(language)) {
      // Switch to a downloaded language if available
      const downloadedLanguages = OfflineVerseService.getDownloadedLanguages();
      if (downloadedLanguages.length > 0) {
        // Prefer English if available
        const englishLang = downloadedLanguages.find(l => l.code === 'en');
        if (englishLang) {
          setLanguage('en');
        } else {
          // Otherwise use first available
          setLanguage(downloadedLanguages[0].code);
        }
      }
    }
    
    setIsOfflineMode(newOfflineMode);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
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
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Index 
                      addToRecentVerses={addToRecentVerses}
                      currentVerse={currentVerse}
                      language={language}
                      isOfflineMode={isOfflineMode}
                    />
                  } 
                />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </div>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
};

export default App;
