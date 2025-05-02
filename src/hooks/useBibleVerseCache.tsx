
import { useState, useEffect } from 'react';
import { VerseResult } from '@/services/types/BibleVerseTypes';

interface CacheEntry {
  verses: VerseResult[];
  timestamp: number;
}

type VerseCache = {
  [key: string]: CacheEntry;
};

export const useBibleVerseCache = (language: string) => {
  const [cache, setCache] = useState<VerseCache>({});
  const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours
  
  // Load cache from localStorage on mount
  useEffect(() => {
    try {
      const storedCache = localStorage.getItem(`bible_verse_cache_${language}`);
      if (storedCache) {
        const parsedCache = JSON.parse(storedCache) as VerseCache;
        // Filter out expired entries
        const now = Date.now();
        const validCache = Object.entries(parsedCache).reduce((acc, [key, entry]) => {
          if (now - entry.timestamp < CACHE_EXPIRY_TIME) {
            acc[key] = entry;
          }
          return acc;
        }, {} as VerseCache);
        
        setCache(validCache);
      }
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
      // Reset cache if there was an error
      localStorage.removeItem(`bible_verse_cache_${language}`);
    }
  }, [language]);
  
  // Save cache to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(`bible_verse_cache_${language}`, JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving cache to localStorage:', error);
    }
  }, [cache, language]);
  
  const getCachedVerses = (category: string): VerseResult[] | null => {
    const cacheKey = `${language}_${category}`;
    const entry = cache[cacheKey];
    
    if (entry && Date.now() - entry.timestamp < CACHE_EXPIRY_TIME) {
      return entry.verses;
    }
    
    return null;
  };
  
  const setCachedVerses = (category: string, verses: VerseResult[]): void => {
    const cacheKey = `${language}_${category}`;
    setCache(prevCache => ({
      ...prevCache,
      [cacheKey]: {
        verses,
        timestamp: Date.now()
      }
    }));
  };
  
  const clearCache = (): void => {
    setCache({});
    localStorage.removeItem(`bible_verse_cache_${language}`);
  };
  
  return {
    getCachedVerses,
    setCachedVerses,
    clearCache,
    hasCachedVerses: (category: string) => !!getCachedVerses(category)
  };
};
