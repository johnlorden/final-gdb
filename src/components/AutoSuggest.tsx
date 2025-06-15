
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import LocalBibleService from '@/services/LocalBibleService';

interface SuggestionProps {
  text: string;
  reference: string;
  category?: string;
}

interface AutoSuggestProps {
  query: string;
  onSelect: (reference: string) => void;
}

const AutoSuggest: React.FC<AutoSuggestProps> = ({ query, onSelect }) => {
  const [suggestions, setSuggestions] = useState<SuggestionProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await LocalBibleService.searchVerses(query);
        setSuggestions(results.slice(0, 5).map(verse => ({
          text: verse.text,
          reference: verse.reference,
          category: verse.category
        })));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);
  
  if (suggestions.length === 0 && !isLoading) {
    return null;
  }
  
  return (
    <motion.div 
      className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {isLoading ? (
        <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
          Searching...
        </div>
      ) : (
        <ul className="py-1">
          {suggestions.map((suggestion, index) => (
            <motion.li 
              key={suggestion.reference}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => onSelect(suggestion.reference)}
            >
              <div className="font-medium text-sm">{suggestion.reference}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300 truncate">{suggestion.text.substring(0, 60)}...</div>
              {suggestion.category && (
                <div className="text-xs text-blue-500 mt-1">Category: {suggestion.category}</div>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default AutoSuggest;
