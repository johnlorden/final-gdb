
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';

interface VerseItem {
  verse: string;
  reference: string;
  timestamp: number;
}

const App = () => {
  const [recentVerses, setRecentVerses] = useState<VerseItem[]>(() => {
    const saved = localStorage.getItem('recentVerses');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentVerse, setCurrentVerse] = useState({
    verse: '',
    reference: ''
  });

  // Save recent verses to localStorage when updated
  useEffect(() => {
    localStorage.setItem('recentVerses', JSON.stringify(recentVerses));
  }, [recentVerses]);

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

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header 
            recentVerses={recentVerses} 
            onSelectVerse={handleSelectVerse} 
          />
          <div className="flex-1 mt-16">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Index 
                    addToRecentVerses={addToRecentVerses}
                    currentVerse={currentVerse}
                  />
                } 
              />
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
