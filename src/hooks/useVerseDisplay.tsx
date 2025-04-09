
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import BibleVerseService from '@/services/BibleVerseService';
import { useVerseContext } from '@/App';
import { useVerseCache } from './useVerseCache';
import { useVerseUrl } from './useVerseUrl';
import { VerseResult } from '@/services/types/BibleVerseTypes';

export const useVerseDisplay = () => {
  const { addToRecentVerses, currentVerse, language, isOfflineMode } = useVerseContext();
  const [searchParams] = useSearchParams();
  const { getCachedVerses, setCachedVerses, hasCachedVerses } = useVerseCache();
  const { updateUrlWithVerse } = useVerseUrl();
  
  const [verse, setVerse] = useState('');
  const [reference, setReference] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [previousVerse, setPreviousVerse] = useState('');
  const [verseCategory, setVerseCategory] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    BibleVerseService.setLanguage(language);
  }, [language]);
  
  // Listen for language changes and reload verse
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail;
      console.log(`Language changed to ${newLanguage}, regenerating verse`);
      handleRandomVerse(currentCategory);
    };
    
    window.addEventListener('language-changed', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('language-changed', handleLanguageChange as EventListener);
    };
  }, [currentCategory]);

  useEffect(() => {
    const bibleVerse = searchParams.get('bibleverse');
    
    if (bibleVerse && initialLoad) {
      setIsLoading(true);
      setHasError(false);
      BibleVerseService.getVerseByReference(bibleVerse)
        .then((result) => {
          if (result) {
            setVerse(result.text);
            setReference(result.reference);
            addToRecentVerses(result.text, result.reference);
            setPreviousVerse(result.reference);
            if (result.category) {
              setVerseCategory(result.category);
            }
          } else {
            throw new Error(`Verse not found: ${bibleVerse}`);
          }
        })
        .catch(error => {
          console.error('Error loading verse from URL:', error);
          setHasError(true);
          toast({
            title: "Error loading verse",
            description: "Could not load the requested verse. Trying a random verse instead.",
            variant: "destructive",
            duration: 3000,
          });
          handleRandomVerse();
        })
        .finally(() => {
          setIsLoading(false);
          setInitialLoad(false);
        });
    } else if (initialLoad) {
      setInitialLoad(false);
      handleRandomVerse();
    }
  }, [searchParams, initialLoad]);

  useEffect(() => {
    if (currentVerse.verse && currentVerse.reference) {
      setVerse(currentVerse.verse);
      setReference(currentVerse.reference);
    }
  }, [currentVerse]);

  // Preload verses for each category to improve performance
  useEffect(() => {
    const preloadCategoryVerses = async () => {
      const categories = BibleVerseService.getCategories();
      
      // Use Promise.all for parallel loading
      await Promise.all(categories.map(async (category) => {
        if (!hasCachedVerses(category)) {
          try {
            const verses = await BibleVerseService.getVersesByCategory(category, 10);
            if (verses && verses.length) {
              setCachedVerses(category, verses);
            }
          } catch (error) {
            console.error(`Error preloading verses for category ${category}:`, error);
          }
        }
      }));
    };
    
    if (!isOfflineMode) {
      preloadCategoryVerses();
    }
  }, [language, isOfflineMode]);

  const displayVerse = useCallback((result: VerseResult) => {
    setVerse(result.text);
    setReference(result.reference);
    addToRecentVerses(result.text, result.reference);
    setPreviousVerse(result.reference);
    
    updateUrlWithVerse(result.reference);
    
    if (result.categories && result.categories.length > 0) {
      setCurrentCategory(result.categories[0]);
      setVerseCategory(result.categories[0]);
    } else if (result.category) {
      setVerseCategory(result.category);
    }
  }, [addToRecentVerses, updateUrlWithVerse]);

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setHasError(false);
    BibleVerseService.getVerseByReference(query)
      .then((result) => {
        if (result) {
          displayVerse(result);
          return null;
        } else {
          return BibleVerseService.searchVerses(query);
        }
      })
      .then((results) => {
        if (results && results.length > 0) {
          displayVerse(results[0]);
        } else if (results && results.length === 0) {
          toast({
            title: "No verses found",
            description: `No verses match "${query}". Try a different search.`,
            variant: "destructive",
            duration: 3000,
          });
        }
      })
      .catch(error => {
        console.error('Error searching for verse:', error);
        setHasError(true);
        toast({
          title: "Search error",
          description: "An error occurred while searching. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      })
      .finally(() => setIsLoading(false));
  }, [displayVerse, toast]);

  const handleCategorySelect = useCallback((category: string) => {
    setIsLoading(true);
    setCurrentCategory(category);
    setHasError(false);
    
    getVerseFromCategory(category);
  }, []);

  const handleRandomVerse = useCallback((category?: string) => {
    setIsLoading(true);
    setHasError(false);
    
    const categoryToUse = category || currentCategory;
    
    getVerseFromCategory(categoryToUse);
    return Promise.resolve();
  }, [currentCategory]);

  const getVerseFromCategory = useCallback((category: string) => {
    const cachedVerses = getCachedVerses(category);
    
    if (category !== 'All' && cachedVerses) {
      const filteredVerses = cachedVerses.filter(v => v.reference !== reference);
      
      if (filteredVerses.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredVerses.length);
        const newVerse = filteredVerses[randomIndex];
        
        setVerse(newVerse.text);
        setReference(newVerse.reference);
        setVerseCategory(newVerse.category || category);
        addToRecentVerses(newVerse.text, newVerse.reference);
        setPreviousVerse(newVerse.reference);
        
        updateUrlWithVerse(newVerse.reference);
        setIsLoading(false);
        return;
      }
    }
    
    BibleVerseService.getVerseByCategory(category)
      .then((result) => {
        if (result) {
          setVerse(result.text);
          setReference(result.reference);
          addToRecentVerses(result.text, result.reference);
          setPreviousVerse(result.reference);
          
          if (category === 'All' && result.category) {
            setVerseCategory(result.category);
          } else if (result.categories && result.categories.length > 0) {
            setVerseCategory(result.categories[0]);
          } else {
            setVerseCategory(category);
          }
          
          updateUrlWithVerse(result.reference);
          return null;
        } else {
          return BibleVerseService.getRandomVerse();
        }
      })
      .then((randomResult) => {
        if (randomResult) {
          setVerse(randomResult.text);
          setReference(randomResult.reference);
          addToRecentVerses(randomResult.text, randomResult.reference);
          setPreviousVerse(randomResult.reference);
          
          if (randomResult.category) {
            setVerseCategory(randomResult.category);
          }
          
          updateUrlWithVerse(randomResult.reference);
        }
      })
      .catch(error => {
        console.error('Error getting verse by category:', error);
        setHasError(true);
        toast({
          title: "Error loading verse",
          description: "Could not load a verse from the selected category. Trying a random verse instead.",
          variant: "destructive",
          duration: 3000,
        });
        
        BibleVerseService.getRandomVerse()
          .then((result) => {
            if (result) {
              setVerse(result.text);
              setReference(result.reference);
              addToRecentVerses(result.text, result.reference);
              setPreviousVerse(result.reference);
              if (result.category) {
                setVerseCategory(result.category);
              }
              updateUrlWithVerse(result.reference);
            }
          })
          .catch(() => {
            // Already showing error toast, no need for another
          });
      })
      .finally(() => setIsLoading(false));
  }, [reference, addToRecentVerses, updateUrlWithVerse, toast, getCachedVerses]);

  return {
    verse,
    reference,
    verseCategory,
    currentCategory,
    isLoading,
    hasError,
    handleSearch,
    handleCategorySelect,
    handleRandomVerse
  };
};
