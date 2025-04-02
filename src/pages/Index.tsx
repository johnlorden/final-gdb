
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

  // Preload verses for faster display
  const verseCache = useRef<Map<string, { text: string, reference: string }[]>>(new Map());

  // Load verse from URL parameter on initial load
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
      // Load random verse if no URL parameter
      handleRandomVerse();
    }
  }, [searchParams, initialLoad]);

  // Handle changes from currentVerse prop
  useEffect(() => {
    if (currentVerse.verse && currentVerse.reference) {
      setVerse(currentVerse.verse);
      setReference(currentVerse.reference);
    }
  }, [currentVerse]);

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

  // Add padding class for image export
  useEffect(() => {
    const addExportStyles = () => {
      // Add CSS for export styling
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .export-padding {
          padding: 40px !important;
        }
      `;
      document.head.appendChild(styleElement);
      return () => document.head.removeChild(styleElement);
    };
    
    return addExportStyles();
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
          
          // Update URL when searching
          const url = new URL(window.location.href);
          url.searchParams.set('bibleverse', result.reference);
          window.history.pushState({}, '', url);
        }
      })
      .catch(error => console.error('Error searching for verse:', error))
      .finally(() => setIsLoading(false));
  };

  const handleCategorySelect = (category: string) => {
    setIsLoading(true);
    setCurrentCategory(category);
    
    // Always get a new verse when selecting a category
    if (category !== 'All' && verseCache.current.has(category)) {
      const cachedVerses = verseCache.current.get(category)!;
      
      // Find a verse that's different from the current one
      const filteredVerses = cachedVerses.filter(v => v.reference !== previousVerse);
      
      if (filteredVerses.length > 0) {
        // Get a random verse from filtered list
        const randomIndex = Math.floor(Math.random() * filteredVerses.length);
        const newVerse = filteredVerses[randomIndex];
        
        setVerse(newVerse.text);
        setReference(newVerse.reference);
        addToRecentVerses(newVerse.text, newVerse.reference);
        setPreviousVerse(newVerse.reference);
        
        // Update URL
        const url = new URL(window.location.href);
        url.searchParams.set('bibleverse', newVerse.reference);
        window.history.pushState({}, '', url);
        
        setIsLoading(false);
        return;
      }
    }
    
    // If cache miss or "All" category, fetch from service
    BibleVerseService.getVerseByCategory(category)
      .then((result) => {
        if (result) {
          setVerse(result.text);
          setReference(result.reference);
          addToRecentVerses(result.text, result.reference);
          setPreviousVerse(result.reference);
          
          // Update URL when selecting category
          const url = new URL(window.location.href);
          url.searchParams.set('bibleverse', result.reference);
          window.history.pushState({}, '', url);
        }
      })
      .catch(error => console.error('Error getting verse by category:', error))
      .finally(() => setIsLoading(false));
  };

  const handleRandomVerse = () => {
    setIsLoading(true);
    // Reset category when getting a random verse
    setCurrentCategory('All');
    
    BibleVerseService.getRandomVerse()
      .then((result) => {
        if (result) {
          setVerse(result.text);
          setReference(result.reference);
          addToRecentVerses(result.text, result.reference);
          setPreviousVerse(result.reference);
          
          // Update URL when getting random verse
          const url = new URL(window.location.href);
          url.searchParams.set('bibleverse', result.reference);
          window.history.pushState({}, '', url);
        }
      })
      .catch(error => console.error('Error getting random verse:', error))
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
              category={currentCategory} 
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
