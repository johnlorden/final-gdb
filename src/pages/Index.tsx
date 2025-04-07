
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import EnhancedSearchBar from '@/components/EnhancedSearchBar';
import VerseCategories from '@/components/VerseCategories';
import DonateFooter from '@/components/DonateFooter';
import SocialShareBar from '@/components/SocialShareBar';
import VerseDisplay from '@/components/VerseDisplay';
import { useVerseDisplay } from '@/hooks/useVerseDisplay';

const Index: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
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
        <motion.section 
          className="flex flex-col gap-4"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <EnhancedSearchBar onSearch={handleSearch} />
          <VerseCategories 
            onCategorySelect={handleCategorySelect} 
            onRandomVerse={handleRandomVerse}
            currentCategory={currentCategory}
          />
        </motion.section>
        
        <VerseDisplay 
          verse={verse}
          reference={reference}
          verseCategory={verseCategory}
          currentCategory={currentCategory}
          isLoading={isLoading}
          hasError={hasError}
          handleRandomVerse={handleRandomVerse}
        />
        
        {verse && reference && (
          <motion.section 
            className="w-full max-w-2xl mx-auto"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
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
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <DonateFooter />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;
