
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import SocialShareBar from '@/components/SocialShareBar';

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
      <SocialShareBar {...props} />
    </motion.section>
  );
});

ShareSection.displayName = 'ShareSection';

export default ShareSection;
