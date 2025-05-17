
import React, { memo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ShareButtonsSkeleton } from '@/components/LoadingSkeletons';

const SocialShareBar = lazy(() => import('@/components/SocialShareBar'));

interface ShareSectionProps {
  verse: string;
  reference: string;
  category: string;
}

const ShareSection: React.FC<ShareSectionProps> = memo((props) => {
  const { verse, reference, category } = props;
  
  if (!verse || !reference) {
    return null;
  }
  
  return (
    <motion.section 
      className="w-full max-w-2xl mx-auto"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    >
      <ErrorBoundary fallback={<div className="text-red-500">Failed to load sharing options</div>}>
        <Suspense fallback={<ShareButtonsSkeleton />}>
          <SocialShareBar verse={verse} reference={reference} category={category} />
        </Suspense>
      </ErrorBoundary>
    </motion.section>
  );
});

ShareSection.displayName = 'ShareSection';

export default ShareSection;
