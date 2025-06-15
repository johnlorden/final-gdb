
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import LocalBibleService from '@/services/LocalBibleService';
import { VerseResult } from '@/services/types/BibleVerseTypes';

export const useVerseManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = useCallback(async (query: string): Promise<VerseResult | null> => {
    if (!query.trim()) return null;
    
    setIsLoading(true);
    try {
      // Try to find by reference first
      let result = await LocalBibleService.getVerseByReference(query);
      
      if (!result) {
        // If not found by reference, search in text
        const searchResults = await LocalBibleService.searchVerses(query);
        result = searchResults.length > 0 ? searchResults[0] : null;
      }
      
      if (!result) {
        toast({
          title: "No verses found",
          description: `No verses match "${query}". Try a different search.`,
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error searching for verse:', error);
      toast({
        title: "Search error",
        description: "There was an error searching for verses.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getRandomVerse = useCallback(async (category?: string): Promise<VerseResult | null> => {
    setIsLoading(true);
    try {
      const result = category 
        ? await LocalBibleService.getVerseByCategory(category)
        : await LocalBibleService.getRandomVerse();
      
      if (!result) {
        toast({
          title: "No verse found",
          description: "Could not load a verse at this time.",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error getting random verse:', error);
      toast({
        title: "Loading error",
        description: "There was an error loading the verse.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    handleSearch,
    getRandomVerse,
    isLoading
  };
};
