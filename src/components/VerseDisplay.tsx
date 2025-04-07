
import React, { useRef } from 'react';
import BibleVerseCard from '@/components/BibleVerseCard';
import SwipeVerseNavigation from '@/components/SwipeVerseNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface VerseDisplayProps {
  verse: string;
  reference: string;
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

  return (
    <AnimatePresence mode="wait">
      <motion.section 
        key={reference || 'loading' || 'error'}
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
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
  );
};

export default VerseDisplay;
