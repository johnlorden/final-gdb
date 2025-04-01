
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Skeleton } from '@/components/ui/skeleton';
import SocialShare from './SocialShare';

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
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div 
      ref={cardRef}
      className={`relative w-full max-w-2xl p-8 md:p-12 rounded-lg shadow-lg flex flex-col items-center text-center ${isCapturing ? background : ''} dark:text-white transition-all duration-300`}
    >
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
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
            <p className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-200 italic mb-4">
              "{verse}"
            </p>
            <p className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
              — {reference}
            </p>
            
            {!isCapturing && <SocialShare verse={verse} reference={reference} />}
          </>
        )}
      </div>
      
      {!isCapturing && !loading && (
        <div className="flex space-x-4 mt-6">
          <Button 
            variant="outline" 
            onClick={handleDownload}
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white"
          >
            <Download size={18} />
            Save as Image
          </Button>
          
          <Button 
            onClick={handleRefresh}
            className={`bg-blue-600 hover:bg-blue-700 text-white ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={18} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            New Verse
          </Button>
        </div>
      )}
    </div>
  );
};

export default BibleVerseCard;
