
import React, { memo } from 'react';
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

// Using memo to prevent unnecessary re-renders
const VerseSection: React.FC<VerseSectionProps> = memo((props) => {
  return <VerseDisplay {...props} />;
});

VerseSection.displayName = 'VerseSection';

export default VerseSection;
