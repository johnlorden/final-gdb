
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
  
  // Set language in the Bible service whenever it changes
  useEffect(() => {
    BibleVerseService.setLanguage(language);
    localStorage.setItem('app_language', language);
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
      if (isOfflineMode && !OfflineVerseService.isCacheValid()) {
        await OfflineVerseService.cacheVerses(100);
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
    setLanguage(newLanguage);
    BibleVerseService.setLanguage(newLanguage);
  };
  
  // Toggle offline mode
  const toggleOfflineMode = () => {
    setIsOfflineMode(prev => !prev);
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
          <div className="flex-1 mt-16">
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
        </div>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
};

export default App;
