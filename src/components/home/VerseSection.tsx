
import React from 'react';
import VerseDisplay from '@/components/VerseDisplay';

interface VerseSectionProps {
  verse: string | null;
  reference: string | null;
  verseCategory: string | null;
  currentCategory: string;
  isLoading: boolean;
  hasError: boolean;
  handleRandomVerse: () => void;
}

const VerseSection: React.FC<VerseSectionProps> = ({
  verse,
  reference,
  verseCategory,
  currentCategory,
  isLoading,
  hasError,
  handleRandomVerse
}) => {
  return (
    <VerseDisplay 
      verse={verse}
      reference={reference}
      verseCategory={verseCategory}
      currentCategory={currentCategory}
      isLoading={isLoading}
      hasError={hasError}
      handleRandomVerse={handleRandomVerse}
    />
  );
};

export default VerseSection;
