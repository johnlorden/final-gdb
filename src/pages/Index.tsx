
import React from 'react';
import { motion } from 'framer-motion';
import SearchSection from '@/components/home/SearchSection';
import VerseSection from '@/components/home/VerseSection';
import ShareSection from '@/components/home/ShareSection';
import DonateFooter from '@/components/DonateFooter';
import { useVerseDisplay } from '@/hooks/useVerseDisplay';
import ErrorBoundary from '@/components/ErrorBoundary';

const Index: React.FC = () => {
  const { 
    verse,
    reference,
    verseCategory,
    currentCategory,
    isLoading,
    hasError,
    handleSearch,
    handleCategorySelect,
    handleRandomVerse
  } = useVerseDisplay();

  return (
    <motion.div 
      className="container px-4 pt-4 mx-auto max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-6">
        {/* Search and Categories Section */}
        <ErrorBoundary>
          <SearchSection 
            onSearch={handleSearch}
            onCategorySelect={handleCategorySelect}
            onRandomVerse={handleRandomVerse}
            currentCategory={currentCategory}
          />
        </ErrorBoundary>
        
        {/* Verse Display Section */}
        <ErrorBoundary>
          <VerseSection 
            verse={verse}
            reference={reference}
            verseCategory={verseCategory}
            currentCategory={currentCategory}
            isLoading={isLoading}
            hasError={hasError}
            handleRandomVerse={handleRandomVerse}
          />
        </ErrorBoundary>
        
        {/* Share Section - Only shown when there's a verse to share */}
        {verse && reference && (
          <ErrorBoundary>
            <ShareSection 
              verse={verse} 
              reference={reference} 
              category={verseCategory || currentCategory} 
            />
          </ErrorBoundary>
        )}
        
        {/* Donate Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <ErrorBoundary>
            <DonateFooter />
          </ErrorBoundary>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;
