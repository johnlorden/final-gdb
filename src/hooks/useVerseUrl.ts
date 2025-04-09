
import { useCallback } from 'react';

export function useVerseUrl() {
  const updateUrlWithVerse = useCallback((verseReference: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('bibleverse', verseReference);
    window.history.pushState({}, '', url);
  }, []);

  return { updateUrlWithVerse };
}
