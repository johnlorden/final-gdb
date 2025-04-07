
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

const VerseSection: React.FC<VerseSectionProps> = (props) => {
  // Directly pass all props to VerseDisplay for cleaner code
  return <VerseDisplay {...props} />;
};

export default VerseSection;
