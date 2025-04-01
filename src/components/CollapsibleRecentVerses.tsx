
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecentVerses from './RecentVerses';

interface VerseItem {
  verse: string;
  reference: string;
  timestamp: number;
}

interface CollapsibleRecentVersesProps {
  verses: VerseItem[];
  onSelectVerse: (verse: string, reference: string) => void;
}

const CollapsibleRecentVerses: React.FC<CollapsibleRecentVersesProps> = ({ verses, onSelectVerse }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (verses.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4 w-full max-w-2xl mx-auto shadow-md dark:bg-gray-900">
      <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-medium">Recently Viewed Verses</h3>
        <Button variant="ghost" size="sm">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>
      </div>
      
      {isOpen && (
        <CardContent className="pt-0">
          <RecentVerses verses={verses} onSelectVerse={onSelectVerse} />
        </CardContent>
      )}
    </Card>
  );
};

export default CollapsibleRecentVerses;
