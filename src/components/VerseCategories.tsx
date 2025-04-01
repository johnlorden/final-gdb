
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const VerseCategories: React.FC<CategoryProps> = ({ 
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Categories</h2>
      <ScrollArea className="w-full pb-2">
        <div className="flex space-x-2 pb-1">
          <Button
            onClick={() => onSelectCategory('All')}
            variant={selectedCategory === 'All' ? "default" : "outline"}
            size="sm"
            className="rounded-full"
          >
            All
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => onSelectCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="rounded-full whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VerseCategories;
