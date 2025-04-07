
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import SocialShareBar from '@/components/SocialShareBar';

interface ShareSectionProps {
  verse: string;
  reference: string;
  category: string;
}

const ShareSection: React.FC<ShareSectionProps> = ({ verse, reference, category }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  return (
    <motion.section 
      className="w-full max-w-2xl mx-auto"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    >
      <SocialShareBar 
        verse={verse} 
        reference={reference} 
        cardRef={cardRef} 
        category={category}
      />
    </motion.section>
  );
};

export default ShareSection;
