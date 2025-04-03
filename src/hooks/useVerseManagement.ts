
import { useState, useEffect, useRef } from 'react';
import BibleVerseService from '@/services/BibleVerseService';

interface VerseResult {
  text: string;
  reference: string;
  categories?: string[];
  category?: string;
}

interface UseVerseManagementProps {
  addToRecentVerses: (verse: string, reference: string) => void;
  initialReference?: string;
}

export function useVerseManagement({ addToRecentVerses, initialReference }: UseVerseManagementProps) {
  const [verse, setVerse] = useState('');
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [verseCategory, setVerseCategory] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const verseCache = useRef<Map<string, VerseResult[]>>(new Map());

  // Initial load handling
  useEffect(() => {
    if (!initialLoad) return;
    
    if (initialReference) {
      setIsLoading(true);
      BibleVerseService.getVerseByReference(initialReference)
        .then((result) => {
          if (result) {
            displayVerse(result);
          } else {
            return handleRandomVerse();
          }
        })
        .catch(error => {
          console.error('Error loading verse from URL:', error);
          return handleRandomVerse();
        })
        .finally(() => {
          setIsLoading(false);
          setInitialLoad(false);
        });
    } else {
      handleRandomVerse().finally(() => setInitialLoad(false));
    }
  }, [initialReference, initialLoad]);

  // Preload verses for categories
  useEffect(() => {
    async function preloadCategoryVerses() {
      const categories = BibleVerseService.getCategories();
      for (const category of categories) {
        if (!verseCache.current.has(category)) {
          try {
            const verses = await BibleVerseService.getVersesByCategory(category, 10);
            if (verses && verses.length) {
              verseCache.current.set(category, verses);
            }
          } catch (error) {
            console.error(`Error preloading verses for category ${category}:`, error);
          }
        }
      }
    }
    
    preloadCategoryVerses();
  }, []);

  const displayVerse = (result: VerseResult) => {
    setVerse(result.text);
    setReference(result.reference);
    addToRecentVerses(result.text, result.reference);
    
    updateUrlWithVerse(result.reference);
    
    if (result.categories && result.categories.length > 0) {
      setCurrentCategory(result.categories[0]);
      setVerseCategory(result.categories[0]);
    } else if (result.category) {
      setVerseCategory(result.category);
    }
  };

  const updateUrlWithVerse = (verseReference: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('bibleverse', verseReference);
    window.history.pushState({}, '', url);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await BibleVerseService.getVerseByReference(query);
      
      if (result) {
        displayVerse(result);
      } else {
        // If no exact reference match, try keyword search
        const results = await BibleVerseService.searchVerses(query);
        if (results && results.length > 0) {
          displayVerse(results[0]);
        }
      }
    } catch (error) {
      console.error('Error searching for verse:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setIsLoading(true);
    setCurrentCategory(category);
    
    getVerseFromCategory(category);
  };

  const handleRandomVerse = async (category?: string) => {
    setIsLoading(true);
    
    const categoryToUse = category || currentCategory;
    
    await getVerseFromCategory(categoryToUse);
    return Promise.resolve();
  };

  const getVerseFromCategory = async (category: string) => {
    try {
      if (category !== 'All' && verseCache.current.has(category)) {
        const cachedVerses = verseCache.current.get(category)!;
        
        const filteredVerses = cachedVerses.filter(v => v.reference !== reference);
        
        if (filteredVerses.length > 0) {
          const randomIndex = Math.floor(Math.random() * filteredVerses.length);
          const newVerse = filteredVerses[randomIndex];
          
          setVerse(newVerse.text);
          setReference(newVerse.reference);
          setVerseCategory(newVerse.category || category);
          addToRecentVerses(newVerse.text, newVerse.reference);
          
          updateUrlWithVerse(newVerse.reference);
          setIsLoading(false);
          return;
        }
      }
      
      const result = await BibleVerseService.getVerseByCategory(category);
      if (result) {
        setVerse(result.text);
        setReference(result.reference);
        addToRecentVerses(result.text, result.reference);
        
        if (category === 'All' && result.category) {
          setVerseCategory(result.category);
        } else if (result.categories && result.categories.length > 0) {
          setVerseCategory(result.categories[0]);
        } else {
          setVerseCategory(category);
        }
        
        updateUrlWithVerse(result.reference);
      }
    } catch (error) {
      console.error('Error getting verse by category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verse,
    reference,
    isLoading,
    currentCategory,
    verseCategory,
    handleSearch,
    handleCategorySelect,
    handleRandomVerse,
    setVerse,
    setReference
  };
}
