
import React, { forwardRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

interface BibleVerseCardProps {
  verse: string;
  reference: string;
}

// Array of gradient backgrounds
const gradients = [
  'bg-gradient-to-br from-blue-100 to-indigo-200',
  'bg-gradient-to-br from-green-100 to-emerald-200',
  'bg-gradient-to-br from-yellow-100 to-amber-200',
  'bg-gradient-to-br from-pink-100 to-rose-200',
  'bg-gradient-to-br from-purple-100 to-violet-200',
  'bg-gradient-to-br from-sky-100 to-cyan-200',
  'bg-gradient-to-br from-red-100 to-orange-200',
  'bg-gradient-to-br from-teal-100 to-emerald-200',
  'bg-gradient-to-br from-indigo-100 to-purple-200',
  'bg-gradient-to-br from-amber-100 to-yellow-200'
];

// Darker gradient versions for dark mode
const darkGradients = [
  'dark:bg-gradient-to-br dark:from-blue-900 dark:to-indigo-800',
  'dark:bg-gradient-to-br dark:from-green-900 dark:to-emerald-800',
  'dark:bg-gradient-to-br dark:from-yellow-900 dark:to-amber-800',
  'dark:bg-gradient-to-br dark:from-pink-900 dark:to-rose-800',
  'dark:bg-gradient-to-br dark:from-purple-900 dark:to-violet-800',
  'dark:bg-gradient-to-br dark:from-sky-900 dark:to-cyan-800',
  'dark:bg-gradient-to-br dark:from-red-900 dark:to-orange-800',
  'dark:bg-gradient-to-br dark:from-teal-900 dark:to-emerald-800',
  'dark:bg-gradient-to-br dark:from-indigo-900 dark:to-purple-800',
  'dark:bg-gradient-to-br dark:from-amber-900 dark:to-yellow-800'
];

const BibleVerseCard = forwardRef<HTMLDivElement, BibleVerseCardProps>(
  ({ verse, reference }, ref) => {
    const { toast } = useToast();
    const [gradientIndex, setGradientIndex] = useState(0);
    
    // Change gradient when verse or reference changes
    useEffect(() => {
      if (verse && reference) {
        // Create a consistent but pseudo-random index based on the verse reference
        const sum = reference.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        setGradientIndex(sum % gradients.length);
      }
    }, [verse, reference]);
    
    const handleSaveImage = async () => {
      // Check if ref exists and has a current property (it's a RefObject)
      if (!ref) return;
      
      // Create a local variable to hold the element
      let element: HTMLElement | null = null;
      
      // Check if ref is a RefObject (has .current) or a function
      if (typeof ref === 'function') {
        // We cannot directly access the DOM element with a callback ref
        toast({
          title: "Error",
          description: "Unable to save image with this ref type.",
          variant: "destructive",
          duration: 2000,
        });
        return;
      } else if (ref.current) {
        // It's a RefObject
        element = ref.current;
      }
      
      // Ensure we have an element to capture
      if (!element) return;
      
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: null,
          scale: 2 // Better quality
        });
        
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `bible-verse-${reference.replace(/\s+/g, '-').replace(/:/g, '-')}.png`;
        link.click();
        
        toast({
          title: "Image Saved",
          description: "Verse image has been downloaded.",
          duration: 2000,
        });
      } catch (error) {
        console.error('Error saving image:', error);
        toast({
          title: "Save Failed",
          description: "Could not save the image. Please try again.",
          variant: "destructive",
          duration: 2000,
        });
      }
    };

    if (!verse) return null;
    
    // Combine light and dark mode gradients
    const gradientClasses = `${gradients[gradientIndex]} ${darkGradients[gradientIndex]}`;
    
    return (
      <div className="relative w-full max-w-2xl">
        <div 
          ref={ref}
          className={`relative w-full max-w-2xl ${gradientClasses} dark:text-gray-100 rounded-xl shadow-md overflow-hidden border dark:border-gray-800`}
        >
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center">
              <p className="text-lg sm:text-xl leading-relaxed mb-4 font-serif">"{verse}"</p>
              <p className="text-sm sm:text-base font-medium">— {reference}</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-3 right-3">
          <Button 
            onClick={handleSaveImage}
            size="sm"
            variant="secondary"
            className="rounded-full shadow-sm opacity-80 hover:opacity-100"
          >
            <Download size={16} />
            <span className="sr-only">Save Image</span>
          </Button>
        </div>
      </div>
    );
  }
);

BibleVerseCard.displayName = 'BibleVerseCard';

export default BibleVerseCard;
