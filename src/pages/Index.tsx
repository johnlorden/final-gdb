import React, { useEffect, useRef, useState } from 'react';
import BibleVerseCard from '@/components/BibleVerseCard';
import SearchBar from '@/components/SearchBar';
import VerseCategories from '@/components/VerseCategories';
import DonateFooter from '@/components/DonateFooter';
import SocialShareBar from '@/components/SocialShareBar';
import { useSearchParams } from 'react-router-dom';
import BibleVerseService from '../services/BibleVerseService';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface IndexProps {
  addToRecentVerses: (verse: string, reference: string) => void;
  currentVerse: {
    verse: string;
    reference: string;
  };
}

const Index: React.FC<IndexProps> = ({ addToRecentVerses, currentVerse }) => {
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

  const verseCache = useRef<Map<string, { text: string, reference: string, category: string }[]>>(new Map());

  useEffect(() => {
    const bibleVerse = searchParams.get('bibleverse');
    
    if (bibleVerse && initialLoad) {
      setIsLoading(true);
      BibleVerseService.getVerseByReference(bibleVerse)
        .then((result) => {
          if (result) {
            setVerse(result.text);
            setReference(result.reference);
            addToRecentVerses(result.text, result.reference);
            setPreviousVerse(result.reference);
          }
        })
        .catch(error => console.error('Error loading verse from URL:', error))
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

  const handleSearch = (query: string) => {
    setIsLoading(true);
    BibleVerseService.getVerseByReference(query)
      .then((result) => {
        if (result) {
          setVerse(result.text);
          setReference(result.reference);
          addToRecentVerses(result.text, result.reference);
          setPreviousVerse(result.reference);
          
          // Update URL
          updateUrlWithVerse(result.reference);
          
          // Update category based on the verse's category if possible
          if (result.categories && result.categories.length > 0) {
            setCurrentCategory(result.categories[0]);
            setVerseCategory(result.categories[0]);
          } else if (result.category) {
            setVerseCategory(result.category);
          }
        }
      })
      .catch(error => console.error('Error searching for verse:', error))
      .finally(() => setIsLoading(false));
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
    
    // Always get a new verse when selecting a category
    getVerseFromCategory(category);
  };

  const handleRandomVerse = (category?: string) => {
    setIsLoading(true);
    
    // If category is provided, use it; otherwise, use current category
    const categoryToUse = category || currentCategory;
    
    // Get a verse from the specified category (or random if 'All')
    getVerseFromCategory(categoryToUse);
  };
  
  const getVerseFromCategory = (category: string) => {
    if (category !== 'All' && verseCache.current.has(category)) {
      const cachedVerses = verseCache.current.get(category)!;
      
      // Filter out the current verse to ensure we get a different one
      const filteredVerses = cachedVerses.filter(v => v.reference !== reference);
      
      if (filteredVerses.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredVerses.length);
        const newVerse = filteredVerses[randomIndex];
        
        setVerse(newVerse.text);
        setReference(newVerse.reference);
        setVerseCategory(newVerse.category);
        addToRecentVerses(newVerse.text, newVerse.reference);
        setPreviousVerse(newVerse.reference);
        
        updateUrlWithVerse(newVerse.reference);
        setIsLoading(false);
        return;
      }
    }
    
    // If cache doesn't have the verse or it's "All" category, get a new verse from the service
    BibleVerseService.getVerseByCategory(category)
      .then((result) => {
        if (result) {
          setVerse(result.text);
          setReference(result.reference);
          addToRecentVerses(result.text, result.reference);
          setPreviousVerse(result.reference);
          
          // If we are in "All" category, display the verse's original category
          if (category === 'All' && result.category) {
            setVerseCategory(result.category);
          } else if (result.categories && result.categories.length > 0) {
            setVerseCategory(result.categories[0]);
          } else {
            setVerseCategory(category);
          }
          
          updateUrlWithVerse(result.reference);
        }
      })
      .catch(error => console.error('Error getting verse by category:', error))
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
          <SearchBar onSearch={handleSearch} />
          <VerseCategories 
            onCategorySelect={handleCategorySelect} 
            onRandomVerse={handleRandomVerse}
            currentCategory={currentCategory}
          />
        </motion.section>
        
        <motion.section 
          className="flex flex-col items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {isLoading ? (
            <div className="w-full max-w-2xl">
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
          ) : (
            <BibleVerseCard 
              verse={verse} 
              reference={reference} 
              category={verseCategory || currentCategory} 
              ref={cardRef} 
            />
          )}
        </motion.section>
        
        <motion.section 
          className="w-full max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <SocialShareBar verse={verse} reference={reference} cardRef={cardRef} />
        </motion.section>
        
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
