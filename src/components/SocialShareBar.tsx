
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
  cardRef?: React.RefObject<HTMLDivElement>;
  template?: 'default' | 'minimal';
  backgroundColor?: string;
  backgroundImage?: string | null;
}

const SocialShareBar: React.FC<SocialShareBarProps> = ({
  verse,
  reference,
  category,
  cardRef,
  template = 'default',
  backgroundColor = '#ffffff',
  backgroundImage = null,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<'default' | 'minimal'>(template);
  const [selectedBackground, setSelectedBackground] = useState(backgroundColor);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        <ShareButtons 
          verse={verse} 
          reference={reference}
          cardRef={cardRef}
          template={selectedTemplate}
          backgroundColor={selectedBackground}
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
        
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Template:</span>
          <Select
            value={selectedTemplate}
            onValueChange={(value) => setSelectedTemplate(value as 'default' | 'minimal')}
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
