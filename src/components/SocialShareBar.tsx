
import React from 'react';
import ShareButtons from './social/ShareButtons';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import BookmarkVerse from './BookmarkVerse';
import VerseQRCode from './VerseQRCode';
import ShareTemplateSelector from './ShareTemplateSelector';

interface SocialShareBarProps {
  verse: string;
  reference: string;
  category: string;
}

const SocialShareBar: React.FC<SocialShareBarProps> = ({
  verse,
  reference,
  category,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        <ShareButtons 
          verse={verse} 
          reference={reference} 
          category={category} 
        />
        
        <BookmarkVerse 
          verse={verse} 
          reference={reference} 
          category={category}
        />
        
        <VerseQRCode 
          verse={verse} 
          reference={reference} 
        />
        
        <ShareTemplateSelector 
          verse={verse} 
          reference={reference} 
        />
      </div>
    </div>
  );
};

export default SocialShareBar;
