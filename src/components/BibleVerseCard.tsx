
import React, { forwardRef } from 'react';

interface BibleVerseCardProps {
  verse: string;
  reference: string;
}

const BibleVerseCard = forwardRef<HTMLDivElement, BibleVerseCardProps>(
  ({ verse, reference }, ref) => {
    if (!verse) return null;
    
    return (
      <div 
        ref={ref}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border dark:border-gray-800"
      >
        <div className="px-6 py-8 sm:p-10">
          <div className="text-center">
            <p className="text-lg sm:text-xl leading-relaxed mb-4 font-serif">"{verse}"</p>
            <p className="text-sm sm:text-base font-medium">— {reference}</p>
          </div>
        </div>
      </div>
    );
  }
);

BibleVerseCard.displayName = 'BibleVerseCard';

export default BibleVerseCard;
