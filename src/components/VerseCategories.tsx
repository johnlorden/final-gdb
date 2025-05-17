
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import BibleVerseService from '@/services/BibleVerseService';

interface CategoryProps {
  onCategorySelect: (category: string) => void;
  onRandomVerse: (category?: string) => void; 
  currentCategory: string;
}

const VerseCategories: React.FC<CategoryProps> = ({ 
  onCategorySelect,
  onRandomVerse,
  currentCategory
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  
  // Get categories from service
  const categories = ['All', ...BibleVerseService.getCategories()];
  
  // Update scroll buttons visibility based on scroll position
  useEffect(() => {
    const checkScrollPosition = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);
  
  const handleCategorySelect = (category: string) => {
    // Visual feedback - highlight the button temporarily
    setClickedButton(category);
    setTimeout(() => setClickedButton(null), 300);
    
    // Always generate a new verse when a category is clicked
    onCategorySelect(category);
  };

  const handleNewVerse = () => {
    // Pass the current category to generate a verse from that category
    onRandomVerse(currentCategory);
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Scroll to the selected category button
  useEffect(() => {
    const scrollToSelectedCategory = () => {
      if (scrollRef.current && scrollContainerRef.current) {
        const selectedButton = scrollRef.current.querySelector(`[data-category="${currentCategory}"]`) as HTMLElement;
        
        if (selectedButton) {
          // Calculate position to scroll the category to the center
          const scrollContainer = scrollContainerRef.current;
          const scrollContainerWidth = scrollContainer.offsetWidth;
          const buttonOffsetLeft = selectedButton.offsetLeft;
          const buttonWidth = selectedButton.offsetWidth;
          const centerPosition = buttonOffsetLeft - (scrollContainerWidth / 2) + (buttonWidth / 2);
          
          scrollContainer.scrollTo({ left: centerPosition, behavior: 'smooth' });
        }
      }
    };
    
    // Small delay to ensure DOM is ready
    const timerId = setTimeout(scrollToSelectedCategory, 100);
    return () => clearTimeout(timerId);
  }, [currentCategory]);

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
            onClick={handleNewVerse}
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
        {showLeftArrow && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={handleScrollLeft}
          >
            <ChevronLeft size={18} />
          </Button>
        )}
        <div 
          className="overflow-auto py-1 px-1 scrollbar-hide" 
          ref={scrollContainerRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div 
            className="flex space-x-2 pb-1"
            ref={scrollRef}
            style={{ minWidth: 'max-content' }}
          >
            {categories.map((category) => (
              <motion.div 
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={clickedButton === category ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={() => handleCategorySelect(category)}
                  variant={currentCategory === category ? "default" : "outline"}
                  size="sm"
                  data-category={category}
                  className={`rounded-full whitespace-nowrap transition-all duration-300 ${
                    currentCategory === category 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600' 
                      : ''
                  }`}
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
        {showRightArrow && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={handleScrollRight}
          >
            <ChevronRight size={18} />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default VerseCategories;
