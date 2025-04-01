
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VerseItem {
  verse: string;
  reference: string;
  timestamp: number;
}

interface RecentVersesProps {
  verses: VerseItem[];
  onSelectVerse: (verse: string, reference: string) => void;
}

const RecentVerses: React.FC<RecentVersesProps> = ({ verses, onSelectVerse }) => {
  if (verses.length === 0) {
    return <p className="text-sm text-gray-500">No recently viewed verses</p>;
  }

  return (
    <ScrollArea className="h-36">
      <div className="space-y-2">
        {verses.map((item, index) => (
          <div 
            key={`${item.reference}-${index}`} 
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            onClick={() => onSelectVerse(item.verse, item.reference)}
          >
            <p className="font-medium text-sm truncate">{item.reference}</p>
            <p className="text-xs truncate text-gray-500 dark:text-gray-400">
              {item.verse.length > 80 ? `${item.verse.substring(0, 80)}...` : item.verse}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default RecentVerses;
