
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryProps {
  onCategorySelect: (category: string) => void;
  onRandomVerse: () => void;
}

const VerseCategories: React.FC<CategoryProps> = ({ 
  onCategorySelect,
  onRandomVerse
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Define a list of categories
  const categories = [
    'Encouragement', 
    'Faith', 
    'Hope', 
    'Love', 
    'Peace', 
    'Wisdom', 
    'Strength',
    'Forgiveness',
    'Gratitude',
    'Prayer'
  ];
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  const handleScrollLeft = () => {
    if (scrollPosition > 0) {
      setScrollPosition(scrollPosition - 200);
    }
  };

  const handleScrollRight = () => {
    setScrollPosition(scrollPosition + 200);
  };

  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-2">
        <motion.h2 
          className="text-lg font-semibold text-gray-700 dark:text-gray-300"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          Categories
        </motion.h2>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onRandomVerse}
            variant="outline"
            size="sm"
            className="rounded-full flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
          >
            <RefreshCw size={14} className="mr-1 animate-spin-slow" />
            New Verse
          </Button>
        </motion.div>
      </div>
      <div className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
          onClick={handleScrollLeft}
        >
          <ChevronLeft size={18} />
        </Button>
        <ScrollArea className="w-full pb-2 px-8">
          <div 
            className="flex space-x-2 pb-1 transition-transform duration-300" 
            style={{ transform: `translateX(-${scrollPosition}px)` }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleCategorySelect('All')}
                variant={selectedCategory === 'All' ? "default" : "outline"}
                size="sm"
                className="rounded-full transition-all duration-300"
              >
                All
              </Button>
            </motion.div>
            
            {categories.map((category) => (
              <motion.div 
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleCategorySelect(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="rounded-full whitespace-nowrap transition-all duration-300"
                >
                  {category}
                </Button>
              </motion.div>
            ))}
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onRandomVerse}
                variant="outline"
                size="sm"
                className="rounded-full whitespace-nowrap bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                Random Verse
              </Button>
            </motion.div>
          </div>
        </ScrollArea>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
          onClick={handleScrollRight}
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </motion.div>
  );
};

export default VerseCategories;
