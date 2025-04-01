import { DOMParser } from '@xmldom/xmldom';

export interface BibleVerse {
  verse: string;
  reference: string;
  category: string;
}

export const loadVerses = async (): Promise<BibleVerse[]> => {
  try {
    const response = await fetch('/data/bible-verses.xml');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const verseElements = xmlDoc.getElementsByTagName('verse');
    const verses: BibleVerse[] = [];
    
    for (let i = 0; i < verseElements.length; i++) {
      const verseElement = verseElements[i];
      const textElement = verseElement.getElementsByTagName('text')[0];
      const referenceElement = verseElement.getElementsByTagName('reference')[0];
      const categoryElement = verseElement.getElementsByTagName('category')[0];
      
      if (textElement && referenceElement) {
        verses.push({
          verse: textElement.textContent || '',
          reference: referenceElement.textContent || '',
          category: categoryElement ? categoryElement.textContent || 'General' : 'General'
        });
      }
    }
    
    return verses;
  } catch (error) {
    console.error('Error loading verses:', error);
    return [{
      verse: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
      reference: 'John 3:16',
      category: 'Faith'
    }];
  }
};

export const getRandomVerse = async (): Promise<BibleVerse> => {
  const verses = await loadVerses();
  const randomIndex = Math.floor(Math.random() * verses.length);
  return verses[randomIndex];
};

export const findVerseByReference = async (reference: string): Promise<BibleVerse | null> => {
  const verses = await loadVerses();
  const normalizedSearch = reference.toLowerCase().replace(/\s+/g, '');
  
  const foundVerse = verses.find(verse => {
    const normalizedRef = verse.reference.toLowerCase().replace(/\s+/g, '');
    return normalizedRef === normalizedSearch || normalizedRef.includes(normalizedSearch);
  });
  
  return foundVerse || null;
};

export const getVersesByCategory = async (category: string): Promise<BibleVerse[]> => {
  const verses = await loadVerses();
  if (category === 'All') {
    return verses;
  }
  return verses.filter(verse => verse.category === category);
};

export const searchVerses = async (term: string): Promise<BibleVerse[]> => {
  if (!term.trim()) {
    return loadVerses();
  }
  
  const verses = await loadVerses();
  const searchTerm = term.toLowerCase().trim();
  
  return verses.filter(
    verse => 
      verse.verse.toLowerCase().includes(searchTerm) || 
      verse.reference.toLowerCase().includes(searchTerm) ||
      verse.category.toLowerCase().includes(searchTerm)
  );
};

export const getCategories = async (): Promise<string[]> => {
  const verses = await loadVerses();
  const categoriesSet = new Set(verses.map(verse => verse.category));
  return Array.from(categoriesSet).sort();
};

export const getRandomBackground = (): string => {
  const backgrounds = [
    'bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-950',
    'bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900 dark:to-emerald-950',
    'bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900 dark:to-pink-950',
    'bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900 dark:to-yellow-950',
    'bg-gradient-to-br from-rose-100 to-red-200 dark:from-rose-900 dark:to-red-950',
    'bg-gradient-to-br from-sky-100 to-cyan-200 dark:from-sky-900 dark:to-cyan-950',
    'bg-gradient-to-br from-indigo-100 to-violet-200 dark:from-indigo-900 dark:to-violet-950',
    'bg-gradient-to-br from-fuchsia-100 to-pink-200 dark:from-fuchsia-900 dark:to-pink-950',
    'bg-gradient-to-br from-teal-100 to-emerald-200 dark:from-teal-900 dark:to-emerald-950',
    'bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900 dark:to-amber-950'
  ];
  
  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  return backgrounds[randomIndex];
};

export const storeRecentVerse = (verse: BibleVerse): void => {
  try {
    const recentVersesJSON = localStorage.getItem('recentVerses');
    const recentVerses = recentVersesJSON ? JSON.parse(recentVersesJSON) : [];
    
    const verseWithTimestamp = {
      ...verse,
      timestamp: Date.now()
    };
    
    const filteredVerses = recentVerses.filter(
      (item: any) => item.reference !== verse.reference
    );
    
    filteredVerses.unshift(verseWithTimestamp);
    
    const limitedVerses = filteredVerses.slice(0, 5);
    
    localStorage.setItem('recentVerses', JSON.stringify(limitedVerses));
  } catch (error) {
    console.error('Error storing recent verse:', error);
  }
};

export const getRecentVerses = (): any[] => {
  try {
    const recentVersesJSON = localStorage.getItem('recentVerses');
    return recentVersesJSON ? JSON.parse(recentVersesJSON) : [];
  } catch (error) {
    console.error('Error getting recent verses:', error);
    return [];
  }
};
