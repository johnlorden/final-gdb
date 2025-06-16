
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import LocalBibleService from '@/services/LocalBibleService';
import { useVerseContext } from '@/contexts/VerseContext';
import { useSimpleSettingsContext } from '@/contexts/SimpleSettingsContext';
import { VerseResult } from '@/services/types/BibleVerseTypes';

export const useSimpleVerseDisplay = () => {
  const { addToRecentVerses } = useVerseContext();
  const { language } = useSimpleSettingsContext();
  const [searchParams] = useSearchParams();
  
  const [verse, setVerse] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [verseCategory, setVerseCategory] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  // Handle URL params for verse references
  useEffect(() => {
    const bibleVerse = searchParams.get('bibleverse');
    
    if (bibleVerse && initialLoad) {
      setIsLoading(true);
      setHasError(false);
      LocalBibleService.getVerseByReference(bibleVerse, language)
        .then((result) => {
          if (result) {
            setVerse(result.text);
            setReference(result.reference);
            addToRecentVerses(result.text, result.reference);
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
          handleRandomVerse();
        })
        .finally(() => {
          setIsLoading(false);
          setInitialLoad(false);
        });
    } else if (initialLoad) {
      setInitialLoad(false);
      handleRandomVerse('All');
    }
  }, [searchParams, initialLoad, addToRecentVerses, language]);

  // Listen for language changes to refresh verse
  useEffect(() => {
    const handleLanguageVerseRefresh = (event: CustomEvent) => {
      const newLanguage = event.detail.language;
      console.log(`Language verse refresh triggered for: ${newLanguage}`);
      
      // Generate a new verse in the current category with the new language
      if (!initialLoad) {
        handleRandomVerse(currentCategory);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('language-verse-refresh', handleLanguageVerseRefresh as EventListener);
      
      return () => {
        window.removeEventListener('language-verse-refresh', handleLanguageVerseRefresh as EventListener);
      };
    }
  }, [currentCategory, initialLoad]);

  const displayVerse = useCallback((result: VerseResult) => {
    setVerse(result.text);
    setReference(result.reference);
    addToRecentVerses(result.text, result.reference);
    
    if (result.categories && result.categories.length > 0) {
      setCurrentCategory(result.categories[0]);
      setVerseCategory(result.categories[0]);
    } else if (result.category) {
      setVerseCategory(result.category);
    }
  }, [addToRecentVerses]);

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setHasError(false);
    
    LocalBibleService.getVerseByReference(query, language)
      .then((result) => {
        if (result) {
          displayVerse(result);
        } else {
          return LocalBibleService.searchVerses(query, language);
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
          });
        }
      })
      .catch(error => {
        console.error('Error searching for verse:', error);
        setHasError(true);
        toast({
          title: "Search error",
          description: `Error searching for verses in ${language === 'fil' ? 'Filipino' : 'English'}. Please try again.`,
          variant: "destructive",
        });
      })
      .finally(() => setIsLoading(false));
  }, [displayVerse, toast, language]);

  const handleCategorySelect = useCallback((category: string) => {
    setIsLoading(true);
    setCurrentCategory(category);
    setHasError(false);
    
    LocalBibleService.getVerseByCategory(category, language)
      .then((result) => {
        if (result) {
          setVerse(result.text);
          setReference(result.reference);
          addToRecentVerses(result.text, result.reference);
          setVerseCategory(result.category || category);
        } else {
          throw new Error('No verse found');
        }
      })
      .catch(error => {
        console.error('Error getting verse by category:', error);
        setHasError(true);
        toast({
          title: "Loading error",
          description: `Error loading verse in ${language === 'fil' ? 'Filipino' : 'English'}. Please try again.`,
          variant: "destructive",
        });
      })
      .finally(() => setIsLoading(false));
  }, [addToRecentVerses, language, toast]);

  const handleRandomVerse = useCallback((category?: string) => {
    setIsLoading(true);
    setHasError(false);
    
    const categoryToUse = category || currentCategory;
    
    LocalBibleService.getVerseByCategory(categoryToUse, language)
      .then((result) => {
        if (result) {
          setVerse(result.text);
          setReference(result.reference);
          addToRecentVerses(result.text, result.reference);
          setVerseCategory(result.category || categoryToUse);
        } else {
          throw new Error('No verse found');
        }
      })
      .catch(error => {
        console.error('Error getting random verse:', error);
        setHasError(true);
        toast({
          title: "Loading error",
          description: `Error loading verse in ${language === 'fil' ? 'Filipino' : 'English'}. Please try again.`,
          variant: "destructive",
        });
      })
      .finally(() => setIsLoading(false));
      
    return Promise.resolve();
  }, [currentCategory, addToRecentVerses, language, toast]);

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
