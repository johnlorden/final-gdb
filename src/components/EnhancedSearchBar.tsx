
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AutoSuggest from '@/components/AutoSuggest';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const EnhancedSearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSuggestionSelect = (reference: string) => {
    onSearch(reference);
    setQuery(reference);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full relative" ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex items-center"
        >
          <div className="absolute left-3 text-gray-500 dark:text-gray-400">
            <Search size={18} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by reference, keyword, or topic..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length >= 2);
            }}
            onFocus={() => setShowSuggestions(query.length >= 2)}
            className="w-full pl-10 pr-12 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all dark:text-white"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-14 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={18} />
            </button>
          )}
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 rounded-full"
            disabled={!query.trim()}
          >
            Search
          </Button>
        </motion.div>
      </form>
      <AnimatePresence>
        {showSuggestions && query.length >= 2 && (
          <AutoSuggest query={query} onSelect={handleSuggestionSelect} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearchBar;
