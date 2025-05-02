
import React, { useState } from 'react';
import { ShareButtons } from './social/ShareButtons';
import BookmarkVerse from './BookmarkVerse';
import VerseQRCode from './VerseQRCode';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [template, setTemplate] = useState<'default' | 'minimal'>('default');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        <ShareButtons 
          verse={verse} 
          reference={reference}
          template={template}
          backgroundColor={backgroundColor}
          backgroundImage={null}
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
        
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Template:</span>
          <Select
            value={template}
            onValueChange={(value) => setTemplate(value as 'default' | 'minimal')}
          >
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SocialShareBar;
