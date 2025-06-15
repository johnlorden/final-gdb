
import React from 'react';
import { motion } from 'framer-motion';
import SearchSection from '@/components/home/SearchSection';
import VerseSection from '@/components/home/VerseSection';
import ShareSection from '@/components/home/ShareSection';
import { VerseCategories } from '@/components/VerseCategories';
import LocalBibleService from '@/services/LocalBibleService';
import { useSimpleVerseDisplay } from '@/hooks/useSimpleVerseDisplay';

const Index = () => {
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
  } = useSimpleVerseDisplay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col"
    >
      <div className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <SearchSection onSearch={handleSearch} />
        
        <VerseCategories
          categories={LocalBibleService.getCategories()}
          selectedCategory={currentCategory}
          onCategorySelect={handleCategorySelect}
        />
        
        <VerseSection
          verse={verse}
          reference={reference}
          verseCategory={verseCategory}
          currentCategory={currentCategory}
          isLoading={isLoading}
          hasError={hasError}
          handleRandomVerse={handleRandomVerse}
        />
        
        {verse && reference && (
          <ShareSection verse={verse} reference={reference} />
        )}
      </div>
    </motion.div>
  );
};

export default Index;
