import React, { useEffect, useRef, useState } from 'react';
import BibleVerseCard from '@/components/BibleVerseCard';
import EnhancedSearchBar from '@/components/EnhancedSearchBar';
import VerseCategories from '@/components/VerseCategories';
import DonateFooter from '@/components/DonateFooter';
import SocialShareBar from '@/components/SocialShareBar';
import { useSearchParams } from 'react-router-dom';
import BibleVerseService from '../services/BibleVerseService';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import SwipeVerseNavigation from '@/components/SwipeVerseNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface IndexProps {
  addToRecentVerses: (verse: string, reference: string) => void;
  currentVerse: {
    verse: string;
    reference: string;
  };
  language?: string;
  isOfflineMode?: boolean;
}

interface VerseResult {
  text: string;
  reference: string;
  categories?: string[];
  category?: string;
}

const Index: React.FC<IndexProps> = ({ addToRecentVerses, currentVerse, language = 'en', isOfflineMode = false }) => {
  const [searchParams] = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);
  const [verse, setVerse] = useState('');
  const [reference, setReference] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [previousVerse, setPreviousVerse] = useState('');
  const [lastClickedCategory, setLastClickedCategory] = useState<string | null>(null);
  const [verseCategory, setVerseCategory] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const verseCache = useRef<Map<string, VerseResult[]>>(new Map());

  useEffect(() => {
    BibleVerseService.setLanguage(language);
  }, [language]);

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
  }, [searchParams, initialLoad, language]);

  useEffect(() => {
    if (currentVerse.verse && currentVerse.reference) {
      setVerse(currentVerse.verse);
      setReference(currentVerse.reference);
    }
  }, [currentVerse]);

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
  }, [language]);

  const handleSearch = (query: string) => {
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
  };

  const displayVerse = (result: VerseResult) => {
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
  };

  const updateUrlWithVerse = (verseReference: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('bibleverse', verseReference);
    window.history.pushState({}, '', url);
  };

  const handleCategorySelect = (category: string) => {
    setIsLoading(true);
    setCurrentCategory(category);
    setLastClickedCategory(category);
    setHasError(false);
    
    getVerseFromCategory(category);
  };

  const handleRandomVerse = (category?: string) => {
    setIsLoading(true);
    setHasError(false);
    
    const categoryToUse = category || currentCategory;
    
    BibleVerseService.getVerseByCategory(categoryToUse)
      .then((result) => {
        if (result) {
          setVerse(result.text);
          setReference(result.reference);
          addToRecentVerses(result.text, result.reference);
          setPreviousVerse(result.reference);
          
          if (categoryToUse === 'All' && result.category) {
            setVerseCategory(result.category);
          } else if (result.categories && result.categories.length > 0) {
            setVerseCategory(result.categories[0]);
          } else {
            setVerseCategory(categoryToUse);
          }
          
          updateUrlWithVerse(result.reference);
        } else {
          return BibleVerseService.getRandomVerse();
        }
        return null;
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
        console.error('Error getting verse:', error);
        setHasError(true);
        toast({
          title: "Error loading verse",
          description: "Could not load a Bible verse. Please check your connection and try again.",
          variant: "destructive",
          duration: 3000,
        });
      })
      .finally(() => setIsLoading(false));
  };

  const getVerseFromCategory = (category: string) => {
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
        } else {
          return BibleVerseService.getRandomVerse();
        }
        return null;
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
          });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <motion.div 
      className="container px-4 pt-4 mx-auto max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-6">
        <motion.section 
          className="flex flex-col gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <EnhancedSearchBar onSearch={handleSearch} />
          <VerseCategories 
            onCategorySelect={handleCategorySelect} 
            onRandomVerse={handleRandomVerse}
            currentCategory={currentCategory}
          />
        </motion.section>
        
        <AnimatePresence mode="wait">
          <motion.section 
            key={reference || 'loading' || 'error'}
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {isLoading ? (
              <div className="w-full max-w-2xl">
                <Skeleton className="h-[200px] w-full rounded-xl" />
              </div>
            ) : hasError ? (
              <div className="w-full max-w-2xl p-8 text-center bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Could not load Bible verse</h3>
                <p className="text-red-600 dark:text-red-400 mb-4">
                  There was an error loading the verse. This could be due to network issues or the language file not being available.
                </p>
                <Button 
                  variant="outline" 
                  className="bg-white dark:bg-gray-800" 
                  onClick={() => handleRandomVerse('All')}
                >
                  Try Again
                </Button>
              </div>
            ) : verse ? (
              <div className="flex justify-center w-full">
                {isMobile ? (
                  <SwipeVerseNavigation
                    onNextVerse={() => handleRandomVerse(currentCategory)}
                    onPreviousVerse={() => handleRandomVerse(currentCategory)}
                  >
                    <BibleVerseCard 
                      verse={verse} 
                      reference={reference} 
                      category={verseCategory || currentCategory} 
                      ref={cardRef} 
                    />
                  </SwipeVerseNavigation>
                ) : (
                  <BibleVerseCard 
                    verse={verse} 
                    reference={reference} 
                    category={verseCategory || currentCategory} 
                    ref={cardRef} 
                  />
                )}
              </div>
            ) : (
              <div className="w-full max-w-2xl p-8 text-center bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900">
                <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-2">No verse loaded</h3>
                <p className="text-amber-600 dark:text-amber-400 mb-4">
                  We couldn't find a verse to display. Please try searching or selecting a category.
                </p>
                <Button onClick={() => handleRandomVerse('All')}>
                  Get Random Verse
                </Button>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
        
        {verse && reference && (
          <motion.section 
            className="w-full max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <SocialShareBar 
              verse={verse} 
              reference={reference} 
              cardRef={cardRef} 
              category={verseCategory || currentCategory}
            />
          </motion.section>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <DonateFooter />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;
