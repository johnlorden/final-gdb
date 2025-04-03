
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import BibleVerseService from '@/services/BibleVerseService';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{ text: string; reference: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Search by reference and by text content
        const results = await BibleVerseService.searchVerses(searchTerm);
        setSuggestions(results.slice(0, 5)); // Limit to top 5 matches
      } catch (error) {
        console.error('Error getting suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      getSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    setOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    onSearch('');
  };

  const handleSelectSuggestion = (reference: string) => {
    setSearchTerm(reference);
    onSearch(reference);
    setOpen(false);
  };

  return (
    <form onSubmit={handleSearch} className="relative mb-4 w-full">
      <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by reference or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 rounded-full font-playfair"
              onFocus={() => setOpen(true)}
            />
            {searchTerm && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>
                {isLoading ? 'Searching...' : 'No results found'}
              </CommandEmpty>
              <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSelectSuggestion(suggestion.reference)}
                    className="flex flex-col items-start gap-1 cursor-pointer"
                  >
                    <div className="font-medium">{suggestion.reference}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-full">
                      {suggestion.text.length > 60 
                        ? `${suggestion.text.substring(0, 60)}...` 
                        : suggestion.text}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </form>
  );
};

export default SearchBar;
