
import React, { forwardRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface BibleVerseCardProps {
  verse: string;
  reference: string;
  category?: string;
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
  ({ verse, reference, category }, ref) => {
    const { toast } = useToast();
    const [gradientIndex, setGradientIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [key, setKey] = useState(0);
    
    // Change gradient when verse or reference changes
    useEffect(() => {
      if (verse && reference) {
        setKey(prev => prev + 1); // Force re-animation
        // Create a consistent but pseudo-random index based on the verse reference
        const sum = reference.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        setGradientIndex(sum % gradients.length);
      }
    }, [verse, reference]);
    
    const handleSaveImage = async () => {
      if (!ref) return;
      
      // Check if ref is RefObject or function
      const element = typeof ref === 'function' ? null : ref.current;
      
      if (!element) {
        toast({
          title: "Error",
          description: "Unable to save image.",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Add padding for export only
        element.classList.add('export-padding');
        
        const canvas = await html2canvas(element, {
          backgroundColor: null,
          scale: 3, // Higher quality
          useCORS: true,
          allowTaint: true,
          logging: false
        });
        
        // Remove export padding
        element.classList.remove('export-padding');
        
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `bible-verse-${reference.replace(/\s+/g, '-').replace(/:/g, '-')}.png`;
        link.click();
        
        // Store in localStorage for sharing
        localStorage.setItem('verse_image', image);
        
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
      } finally {
        setIsLoading(false);
      }
    };

    if (!verse) return null;
    
    // Combine light and dark mode gradients
    const gradientClasses = `${gradients[gradientIndex]} ${darkGradients[gradientIndex]}`;
    
    return (
      <div className="relative w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
          >
            <motion.div 
              ref={ref}
              className={`relative w-full max-w-2xl ${gradientClasses} dark:text-gray-100 rounded-xl shadow-md overflow-hidden border dark:border-gray-800`}
              whileHover={{ scale: 1.01, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {category && category !== 'All' && (
                <div className="absolute top-3 left-3 bg-white/70 dark:bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  {category}
                </div>
              )}
              <div className="px-8 py-12 sm:p-12">
                <div className="text-center">
                  <motion.p 
                    className="text-lg sm:text-xl leading-relaxed mb-6 font-serif"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    "{verse}"
                  </motion.p>
                  <motion.p 
                    className="text-sm sm:text-base font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    — {reference}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        <motion.div 
          className="absolute bottom-3 right-3"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            onClick={handleSaveImage}
            size="sm"
            variant="secondary"
            className="rounded-full shadow-sm opacity-80 hover:opacity-100 transition-all duration-200"
            disabled={isLoading}
          >
            <Download size={16} className={isLoading ? "animate-pulse" : ""} />
            <span className="sr-only">Save Image</span>
          </Button>
        </motion.div>
      </div>
    );
  }
);

BibleVerseCard.displayName = 'BibleVerseCard';

export default BibleVerseCard;
