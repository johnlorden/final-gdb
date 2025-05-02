
import React, { useState } from 'react';
import { ShareButtons } from './social/ShareButtons';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import BookmarkVerse from './BookmarkVerse';
import VerseQRCode from './VerseQRCode';
import { ShareTemplateSelector } from './ShareTemplateSelector';

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
  const [template, setTemplate] = useState<'default' | 'minimal' | 'elegant' | 'gradient' | 'custom'>('default');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        <ShareButtons 
          verse={verse} 
          reference={reference}
          // Remove category prop as it's not expected in ShareButtons component
          template={template}
          backgroundColor={backgroundColor}
          backgroundImage={backgroundImage}
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
          currentTemplate={template}
          onTemplateChange={setTemplate}
          currentBackgroundColor={backgroundColor}
          onBackgroundColorChange={setBackgroundColor}
          currentBackgroundImage={backgroundImage}
          onBackgroundImageChange={setBackgroundImage}
          // Remove verse prop as it's not expected in ShareTemplateSelector component
        />
      </div>
    </div>
  );
};

export default SocialShareBar;
