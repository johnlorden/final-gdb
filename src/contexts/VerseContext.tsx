
import React, { createContext, useState, useEffect, useContext } from 'react';
import { XmlFileLoader } from '../services/utils/XmlFileLoader';

interface VerseItem {
  verse: string;
  reference: string;
  timestamp: number;
}

interface VerseContextType {
  recentVerses: VerseItem[];
  currentVerse: {
    verse: string;
    reference: string;
  };
  addToRecentVerses: (verse: string, reference: string) => void;
  handleSelectVerse: (verse: string, reference: string) => void;
}

const VerseContext = createContext<VerseContextType | undefined>(undefined);

export const useVerseContext = () => {
  const context = useContext(VerseContext);
  if (!context) {
    throw new Error("useVerseContext must be used within a VerseContextProvider");
  }
  return context;
};

export const VerseContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // State management for verses
  const [recentVerses, setRecentVerses] = useState<VerseItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentVerses');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [currentVerse, setCurrentVerse] = useState({
    verse: '',
    reference: ''
  });
  
  // Initialize language files when app starts
  useEffect(() => {
    XmlFileLoader.initializeXmlUrls().catch(err => 
      console.error("Failed to initialize XML URLs in VerseContext:", err)
    );
  }, []);
  
  // Save recent verses to localStorage when updated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentVerses', JSON.stringify(recentVerses));
    }
  }, [recentVerses]);

  // Handle selecting a verse from the dropdown
  const handleSelectVerse = (verse: string, reference: string) => {
    setCurrentVerse({ verse, reference });
    
    // Update URL if needed
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('bibleverse', reference);
      window.history.pushState({}, '', url);
    }
  };

  // Add a verse to recent verses
  const addToRecentVerses = (verse: string, reference: string) => {
    if (!verse || !reference) return;
    
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

  const value = {
    recentVerses,
    currentVerse,
    addToRecentVerses,
    handleSelectVerse,
  };

  return <VerseContext.Provider value={value}>{children}</VerseContext.Provider>;
};

export default VerseContextProvider;
