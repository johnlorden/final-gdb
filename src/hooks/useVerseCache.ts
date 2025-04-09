
import { useRef } from 'react';
import { VerseResult } from '@/services/types/BibleVerseTypes';

export function useVerseCache() {
  const verseCache = useRef<Map<string, VerseResult[]>>(new Map());
  
  const getCachedVerses = (category: string) => {
    return verseCache.current.get(category);
  };
  
  const setCachedVerses = (category: string, verses: VerseResult[]) => {
    verseCache.current.set(category, verses);
  };
  
  const hasCachedVerses = (category: string) => {
    return verseCache.current.has(category);
  };
  
  return {
    getCachedVerses,
    setCachedVerses,
    hasCachedVerses
  };
}
