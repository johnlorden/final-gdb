
import React from 'react';
import { motion } from 'framer-motion';
import SearchSection from '@/components/home/SearchSection';
import VerseSection from '@/components/home/VerseSection';
import ShareSection from '@/components/home/ShareSection';
import DonateFooter from '@/components/DonateFooter';
import { useVerseDisplay } from '@/hooks/useVerseDisplay';

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
        <SearchSection 
          onSearch={handleSearch}
          onCategorySelect={handleCategorySelect}
          onRandomVerse={handleRandomVerse}
          currentCategory={currentCategory}
        />
        
        {/* Verse Display Section */}
        <VerseSection 
          verse={verse}
          reference={reference}
          verseCategory={verseCategory}
          currentCategory={currentCategory}
          isLoading={isLoading}
          hasError={hasError}
          handleRandomVerse={handleRandomVerse}
        />
        
        {/* Share Section - Only shown when there's a verse to share */}
        {verse && reference && (
          <ShareSection 
            verse={verse} 
            reference={reference} 
            category={verseCategory || currentCategory} 
          />
        )}
        
        {/* Donate Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <DonateFooter />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;
