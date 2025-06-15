
import React, { useRef, useEffect } from 'react';
import BibleVerseCard from '@/components/BibleVerseCard';
import SwipeVerseNavigation from '@/components/SwipeVerseNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface VerseDisplayProps {
  verse: string | null;
  reference: string | null;
  verseCategory: string | null;
  currentCategory: string;
  isLoading: boolean;
  hasError: boolean;
  handleRandomVerse: (category?: string) => void;
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({
  verse,
  reference,
  verseCategory,
  currentCategory,
  isLoading,
  hasError,
  handleRandomVerse
}) => {
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);

  // Load a verse if none is loaded initially
  useEffect(() => {
    if (!isLoading && !verse && !hasError) {
      console.log("No verse loaded on initialization, getting a random verse");
      handleRandomVerse('All');
    }
  }, [isLoading, verse, hasError, handleRandomVerse]);

  console.log("VerseDisplay render:", { verse: !!verse, reference, isLoading, hasError });

  return (
    <AnimatePresence mode="wait">
      <motion.section 
        key={reference || 'loading' || 'error' || 'empty'}
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {isLoading ? (
          <div className="w-full max-w-2xl">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Loading verse...
            </div>
          </div>
        ) : hasError ? (
          <div className="w-full max-w-2xl p-8 text-center bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Could not load Bible verse</h3>
            <p className="text-red-600 dark:text-red-400 mb-4">
              There was an error loading the verse. This could be due to the XML file not being available.
            </p>
            <Button 
              variant="outline" 
              className="bg-white dark:bg-gray-800" 
              onClick={() => handleRandomVerse('All')}
            >
              Try Again
            </Button>
          </div>
        ) : verse && reference ? (
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
              Click the button below to load a verse.
            </p>
            <Button onClick={() => handleRandomVerse('All')}>
              Get Random Verse
            </Button>
          </div>
        )}
      </motion.section>
    </AnimatePresence>
  );
};

export default VerseDisplay;
