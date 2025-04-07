
import React, { useState } from 'react';
import BookmarkVerse from './BookmarkVerse';
import { ShareTemplate, ShareTemplateSelector } from './ShareTemplateSelector';
import TextToSpeech from './TextToSpeech';
import VerseQRCode from './VerseQRCode';
import AddToHomeScreen from './AddToHomeScreen';
import { ShareButtons } from './social/ShareButtons';
import { motion } from 'framer-motion';

interface SocialShareBarProps {
  verse: string;
  reference: string;
  cardRef?: React.RefObject<HTMLDivElement>;
  category?: string;
}

const SocialShareBar: React.FC<SocialShareBarProps> = ({ 
  verse, 
  reference, 
  cardRef, 
  category 
}) => {
  const [template, setTemplate] = useState<ShareTemplate>('default');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  if (!verse || !reference) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 my-4 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <ShareTemplateSelector 
          currentTemplate={template} 
          onTemplateChange={setTemplate}
          currentBackgroundColor={backgroundColor}
          onBackgroundColorChange={setBackgroundColor}
          currentBackgroundImage={backgroundImage}
          onBackgroundImageChange={setBackgroundImage}
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ShareButtons 
          verse={verse}
          reference={reference}
          cardRef={cardRef}
          template={template}
          backgroundColor={backgroundColor}
          backgroundImage={backgroundImage}
        />
      </motion.div>
      
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        <BookmarkVerse 
          verse={verse} 
          reference={reference} 
          category={category}
        />
        
        <TextToSpeech 
          text={verse} 
          reference={reference} 
        />
        
        <VerseQRCode 
          verse={verse} 
          reference={reference} 
        />
      </div>
      
      <div className="flex justify-center mt-2">
        <AddToHomeScreen />
      </div>
    </div>
  );
};

export default SocialShareBar;
