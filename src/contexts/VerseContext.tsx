
import React, { createContext, useContext, useState, useEffect } from 'react';
import LocalBibleService from '../services/LocalBibleService';

interface VerseItem {
  verse: string;
  reference: string;
  timestamp: number;
}

interface VerseContextType {
  recentVerses: VerseItem[];
  addToRecentVerses: (verse: string, reference: string) => void;
  clearRecentVerses: () => void;
}

const VerseContext = createContext<VerseContextType | undefined>(undefined);

export const useVerseContext = () => {
  const context = useContext(VerseContext);
  if (!context) {
    throw new Error('useVerseContext must be used within a VerseContextProvider');
  }
  return context;
};

export const VerseContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentVerses, setRecentVerses] = useState<VerseItem[]>([]);

  // Load recent verses from localStorage on component mount
  useEffect(() => {
    const savedVerses = localStorage.getItem('recentVerses');
    if (savedVerses) {
      try {
        const parsed = JSON.parse(savedVerses);
        setRecentVerses(parsed);
      } catch (error) {
        console.error('Error parsing recent verses from localStorage:', error);
      }
    }
  }, []);

  // Initialize the LocalBibleService
  useEffect(() => {
    LocalBibleService.initializeService();
  }, []);

  const addToRecentVerses = (verse: string, reference: string) => {
    const newVerse: VerseItem = {
      verse,
      reference,
      timestamp: Date.now()
    };
    
    setRecentVerses(prev => {
      // Remove duplicates and add new verse to the beginning
      const filtered = prev.filter(v => v.reference !== reference);
      const updated = [newVerse, ...filtered].slice(0, 10); // Keep only last 10
      
      // Save to localStorage
      localStorage.setItem('recentVerses', JSON.stringify(updated));
      
      return updated;
    });
  };

  const clearRecentVerses = () => {
    setRecentVerses([]);
    localStorage.removeItem('recentVerses');
  };

  const value = {
    recentVerses,
    addToRecentVerses,
    clearRecentVerses
  };

  return (
    <VerseContext.Provider value={value}>
      {children}
    </VerseContext.Provider>
  );
};
