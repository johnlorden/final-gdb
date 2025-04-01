
import React, { useEffect, useRef } from 'react';
import BibleVerseCard from '@/components/BibleVerseCard';
import SearchBar from '@/components/SearchBar';
import VerseCategories from '@/components/VerseCategories';
import DonateFooter from '@/components/DonateFooter';
import SocialShareBar from '@/components/SocialShareBar';
import { useSearchParams } from 'react-router-dom';
import BibleVerseService from '../services/BibleVerseService';

interface IndexProps {
  addToRecentVerses: (verse: string, reference: string) => void;
  currentVerse: {
    verse: string;
    reference: string;
  };
}

const Index: React.FC<IndexProps> = ({ addToRecentVerses, currentVerse }) => {
  const [searchParams] = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);
  const [verse, setVerse] = React.useState('');
  const [reference, setReference] = React.useState('');
  const [initialLoad, setInitialLoad] = React.useState(true);

  // Load verse from URL parameter on initial load
  useEffect(() => {
    const bibleVerse = searchParams.get('bibleverse');
    
    if (bibleVerse && initialLoad) {
      BibleVerseService.getVerseByReference(bibleVerse)
        .then((result) => {
          if (result) {
            setVerse(result.text);
            setReference(result.reference);
            addToRecentVerses(result.text, result.reference);
          }
        })
        .catch(error => console.error('Error loading verse from URL:', error))
        .finally(() => setInitialLoad(false));
    } else if (initialLoad) {
      setInitialLoad(false);
      // Load random verse if no URL parameter
      handleRandomVerse();
    }
  }, [searchParams, initialLoad]);

  // Handle changes from currentVerse prop
  useEffect(() => {
    if (currentVerse.verse && currentVerse.reference) {
      setVerse(currentVerse.verse);
      setReference(currentVerse.reference);
    }
  }, [currentVerse]);

  const handleSearch = (query: string) => {
    BibleVerseService.getVerseByReference(query)
      .then((result) => {
        if (result) {
          setVerse(result.text);
          setReference(result.reference);
          addToRecentVerses(result.text, result.reference);
          
          // Update URL when searching
          const url = new URL(window.location.href);
          url.searchParams.set('bibleverse', result.reference);
          window.history.pushState({}, '', url);
        }
      })
      .catch(error => console.error('Error searching for verse:', error));
  };

  const handleCategorySelect = (category: string) => {
    BibleVerseService.getVerseByCategory(category)
      .then((result) => {
        if (result) {
          setVerse(result.text);
          setReference(result.reference);
          addToRecentVerses(result.text, result.reference);
          
          // Update URL when selecting category
          const url = new URL(window.location.href);
          url.searchParams.set('bibleverse', result.reference);
          window.history.pushState({}, '', url);
        }
      })
      .catch(error => console.error('Error getting verse by category:', error));
  };

  const handleRandomVerse = () => {
    BibleVerseService.getRandomVerse()
      .then((result) => {
        if (result) {
          setVerse(result.text);
          setReference(result.reference);
          addToRecentVerses(result.text, result.reference);
          
          // Update URL when getting random verse
          const url = new URL(window.location.href);
          url.searchParams.set('bibleverse', result.reference);
          window.history.pushState({}, '', url);
        }
      })
      .catch(error => console.error('Error getting random verse:', error));
  };

  return (
    <div className="container px-4 pt-4 mx-auto max-w-4xl">
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-4">
          <SearchBar onSearch={handleSearch} />
          <VerseCategories onCategorySelect={handleCategorySelect} onRandomVerse={handleRandomVerse} />
        </section>
        
        <section className="flex flex-col items-center">
          <BibleVerseCard verse={verse} reference={reference} ref={cardRef} />
        </section>
        
        <section className="w-full max-w-2xl mx-auto">
          <SocialShareBar verse={verse} reference={reference} cardRef={cardRef} />
        </section>
        
        <DonateFooter />
      </div>
    </div>
  );
};

export default Index;
