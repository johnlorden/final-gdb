
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Skeleton } from '@/components/ui/skeleton';

interface BibleVerseCardProps {
  verse: string;
  reference: string;
  onRefresh: () => void;
  background: string;
  loading?: boolean;
}

const BibleVerseCard: React.FC<BibleVerseCardProps> = ({ 
  verse, 
  reference, 
  onRefresh,
  background,
  loading = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        setIsCapturing(true);
        
        // Wait a brief moment for the UI to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
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
        
        setIsCapturing(false);
      } catch (error) {
        console.error('Error generating image:', error);
        setIsCapturing(false);
      }
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`relative w-full max-w-2xl p-8 md:p-12 rounded-lg shadow-lg flex flex-col items-center text-center ${isCapturing ? background : ''}`}
    >
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        God's Daily Bread
      </h1>
      
      <div className="my-8 w-full">
        {loading ? (
          <>
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-5/6 mx-auto mb-2" />
            <Skeleton className="h-6 w-4/6 mx-auto mb-4" />
            <Skeleton className="h-4 w-1/3 mx-auto" />
          </>
        ) : (
          <>
            <p className="text-xl md:text-2xl font-medium text-gray-700 italic mb-4">
              "{verse}"
            </p>
            <p className="text-lg md:text-xl font-semibold text-gray-800">
              — {reference}
            </p>
          </>
        )}
      </div>
      
      {!isCapturing && !loading && (
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
      )}
    </div>
  );
};

export default BibleVerseCard;
