
import React, { memo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ShareButtonsSkeleton } from '@/components/LoadingSkeletons';

// Lazy load the SocialShareBar component
const SocialShareBar = lazy(() => import('@/components/SocialShareBar'));

interface ShareSectionProps {
  verse: string;
  reference: string;
  category: string;
}

// Using memo to prevent unnecessary re-renders
const ShareSection: React.FC<ShareSectionProps> = memo((props) => {
  return (
    <motion.section 
      className="w-full max-w-2xl mx-auto"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    >
      <ErrorBoundary>
        <Suspense fallback={<ShareButtonsSkeleton />}>
          <SocialShareBar {...props} />
        </Suspense>
      </ErrorBoundary>
    </motion.section>
  );
});

ShareSection.displayName = 'ShareSection';

export default ShareSection;
