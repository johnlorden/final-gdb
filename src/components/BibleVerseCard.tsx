
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface BibleVerseCardProps {
  verse: string;
  reference: string;
  onRefresh: () => void;
}

const BibleVerseCard: React.FC<BibleVerseCardProps> = ({ 
  verse, 
  reference, 
  onRefresh 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          scale: 2,
          backgroundColor: null,
          logging: false
        });
        
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `bible-verse-${reference.replace(/[:\s]/g, '-')}.png`;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  return (
    <div 
      ref={cardRef}
      className="relative w-full max-w-2xl p-8 md:p-12 rounded-lg shadow-lg flex flex-col items-center text-center"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        God's Daily Bread by{" "}
        <a 
          href="https://johnlorden.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          John Lorden
        </a>
      </h1>
      
      <div className="my-8">
        <p className="text-xl md:text-2xl font-medium text-gray-700 italic mb-4">
          "{verse}"
        </p>
        <p className="text-lg md:text-xl font-semibold text-gray-800">
          — {reference}
        </p>
      </div>
      
      <div className="flex space-x-4 mt-6">
        <Button 
          variant="outline" 
          onClick={handleDownload}
          className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
        >
          <Download size={18} />
          Save as Image
        </Button>
        
        <Button 
          onClick={onRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          New Verse
        </Button>
      </div>
    </div>
  );
};

export default BibleVerseCard;
