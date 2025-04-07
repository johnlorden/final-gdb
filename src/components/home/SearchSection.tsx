
import React from 'react';
import { motion } from 'framer-motion';
import EnhancedSearchBar from '@/components/EnhancedSearchBar';
import VerseCategories from '@/components/VerseCategories';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onCategorySelect: (category: string) => void;
  onRandomVerse: () => void;
  currentCategory: string;
}

const SearchSection: React.FC<SearchSectionProps> = ({ 
  onSearch, 
  onCategorySelect, 
  onRandomVerse, 
  currentCategory 
}) => {
  return (
    <motion.section 
      className="flex flex-col gap-4"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <EnhancedSearchBar onSearch={onSearch} />
      <VerseCategories 
        onCategorySelect={onCategorySelect} 
        onRandomVerse={onRandomVerse}
        currentCategory={currentCategory}
      />
    </motion.section>
  );
};

export default SearchSection;
