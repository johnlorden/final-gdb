
import React, { memo, lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the VerseDisplay component
const VerseDisplay = lazy(() => import('@/components/VerseDisplay'));

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
  return (
    <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-xl" />}>
      <VerseDisplay {...props} />
    </Suspense>
  );
});

VerseSection.displayName = 'VerseSection';

export default VerseSection;
