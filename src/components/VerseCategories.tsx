
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw } from 'lucide-react';

interface CategoryProps {
  onCategorySelect: (category: string) => void;
  onRandomVerse: () => void;
}

const VerseCategories: React.FC<CategoryProps> = ({ 
  onCategorySelect,
  onRandomVerse
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
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

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Categories</h2>
        <Button
          onClick={onRandomVerse}
          variant="outline"
          size="sm"
          className="rounded-full flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
        >
          <RefreshCw size={14} />
          New Verse
        </Button>
      </div>
      <ScrollArea className="w-full pb-2">
        <div className="flex space-x-2 pb-1">
          <Button
            onClick={() => handleCategorySelect('All')}
            variant={selectedCategory === 'All' ? "default" : "outline"}
            size="sm"
            className="rounded-full"
          >
            All
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategorySelect(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="rounded-full whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
          
          <Button
            onClick={onRandomVerse}
            variant="outline"
            size="sm"
            className="rounded-full whitespace-nowrap bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          >
            Random Verse
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};

export default VerseCategories;
