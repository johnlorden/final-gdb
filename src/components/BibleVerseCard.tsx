
import React, { forwardRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Palette } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BibleVerseCardProps {
  verse: string;
  reference: string;
  category?: string;
}

// Enhanced collection of gradient backgrounds
const gradients = [
  // Original gradients
  'bg-gradient-to-br from-blue-100 to-indigo-200',
  'bg-gradient-to-br from-green-100 to-emerald-200',
  'bg-gradient-to-br from-yellow-100 to-amber-200',
  'bg-gradient-to-br from-pink-100 to-rose-200',
  'bg-gradient-to-br from-purple-100 to-violet-200',
  'bg-gradient-to-br from-sky-100 to-cyan-200',
  'bg-gradient-to-br from-red-100 to-orange-200',
  'bg-gradient-to-br from-teal-100 to-emerald-200',
  'bg-gradient-to-br from-indigo-100 to-purple-200',
  'bg-gradient-to-br from-amber-100 to-yellow-200',
  // New enhanced gradients
  'bg-gradient-to-br from-fuchsia-100 to-pink-200',
  'bg-gradient-to-br from-violet-100 to-indigo-200',
  'bg-gradient-to-br from-cyan-100 to-blue-200',
  'bg-gradient-to-br from-emerald-100 to-teal-200',
  'bg-gradient-to-br from-rose-100 to-red-200',
  'bg-gradient-to-br from-amber-100 to-orange-200',
  'bg-gradient-to-tl from-blue-100 to-purple-200', // Direction variants
  'bg-gradient-to-tr from-green-100 to-blue-200',
  'bg-gradient-to-bl from-pink-100 to-purple-200',
  'bg-gradient-to-r from-orange-100 to-rose-200',
];

// Darker gradient versions for dark mode
const darkGradients = [
  // Original dark gradients
  'dark:bg-gradient-to-br dark:from-blue-900 dark:to-indigo-800',
  'dark:bg-gradient-to-br dark:from-green-900 dark:to-emerald-800',
  'dark:bg-gradient-to-br dark:from-yellow-900 dark:to-amber-800',
  'dark:bg-gradient-to-br dark:from-pink-900 dark:to-rose-800',
  'dark:bg-gradient-to-br dark:from-purple-900 dark:to-violet-800',
  'dark:bg-gradient-to-br dark:from-sky-900 dark:to-cyan-800',
  'dark:bg-gradient-to-br dark:from-red-900 dark:to-orange-800',
  'dark:bg-gradient-to-br dark:from-teal-900 dark:to-emerald-800',
  'dark:bg-gradient-to-br dark:from-indigo-900 dark:to-purple-800',
  'dark:bg-gradient-to-br dark:from-amber-900 dark:to-yellow-800',
  // New enhanced dark gradients
  'dark:bg-gradient-to-br dark:from-fuchsia-900 dark:to-pink-800',
  'dark:bg-gradient-to-br dark:from-violet-900 dark:to-indigo-800',
  'dark:bg-gradient-to-br dark:from-cyan-900 dark:to-blue-800',
  'dark:bg-gradient-to-br dark:from-emerald-900 dark:to-teal-800',
  'dark:bg-gradient-to-br dark:from-rose-900 dark:to-red-800',
  'dark:bg-gradient-to-br dark:from-amber-900 dark:to-orange-800',
  'dark:bg-gradient-to-tl dark:from-blue-900 dark:to-purple-800', // Direction variants
  'dark:bg-gradient-to-tr dark:from-green-900 dark:to-blue-800',
  'dark:bg-gradient-to-bl dark:from-pink-900 dark:to-purple-800',
  'dark:bg-gradient-to-r dark:from-orange-900 dark:to-rose-800',
];

// Font family options for verse text
const fontFamilies = [
  'font-serif',
  'font-playfair',
  'font-lora',
  'font-merriweather',
  'font-noto-serif',
  'font-sans',
];

const BibleVerseCard = forwardRef<HTMLDivElement, BibleVerseCardProps>(
  ({ verse, reference, category }, ref) => {
    const { toast } = useToast();
    const [gradientIndex, setGradientIndex] = useState(0);
    const [fontFamily, setFontFamily] = useState(fontFamilies[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [key, setKey] = useState(0);
    const [showControls, setShowControls] = useState(false);
    
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
        // Create a clone of the element for export to avoid modifying the original
        const clonedElement = element.cloneNode(true) as HTMLElement;
        document.body.appendChild(clonedElement);
        
        // Apply export styles to the clone
        clonedElement.style.padding = '30px'; // Reduced padding
        clonedElement.style.borderRadius = '0px'; // Remove rounded corners for export
        clonedElement.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        
        // Find and style the category badge for the export if it exists
        const categoryBadge = clonedElement.querySelector('.category-badge') as HTMLElement;
        if (categoryBadge) {
          categoryBadge.style.position = 'absolute';
          categoryBadge.style.top = '15px';
          categoryBadge.style.left = '15px';
          categoryBadge.style.zIndex = '10';
        }
        
        const canvas = await html2canvas(clonedElement, {
          backgroundColor: null,
          scale: 3, // Higher quality
          useCORS: true,
          allowTaint: true,
          logging: false
        });
        
        // Remove the clone
        document.body.removeChild(clonedElement);
        
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

    const handleGradientChange = (index: number) => {
      setGradientIndex(index);
      setKey(prev => prev + 1); // Force re-animation
    };

    const handleFontChange = (font: string) => {
      setFontFamily(font);
      setKey(prev => prev + 1); // Force re-animation
    };

    if (!verse) return null;
    
    // Combine light and dark mode gradients
    const gradientClasses = `${gradients[gradientIndex]} ${darkGradients[gradientIndex]}`;
    
    return (
      <div className="relative w-full max-w-2xl" onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
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
                <div className="category-badge absolute top-3 left-3 bg-white/70 dark:bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium z-10">
                  {category}
                </div>
              )}
              <div className="px-8 py-12 sm:p-12">
                <div className="text-center">
                  <motion.p 
                    className={`text-lg sm:text-xl leading-relaxed mb-6 ${fontFamily}`}
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
        
        <AnimatePresence>
          {showControls && (
            <motion.div 
              className="absolute bottom-3 right-3 flex space-x-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full shadow-sm opacity-80 hover:opacity-100 transition-all duration-200"
                  >
                    <Palette size={16} />
                    <span className="sr-only">Customize</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" side="top">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Background Style</h4>
                      <div className="grid grid-cols-5 gap-1">
                        {gradients.slice(0, 10).map((_, index) => (
                          <button
                            key={index}
                            className={`w-full aspect-square rounded-md ${gradients[index]} hover:scale-110 transition-transform ${
                              gradientIndex === index ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => handleGradientChange(index)}
                            aria-label={`Gradient style ${index + 1}`}
                          />
                        ))}
                      </div>
                      <div className="grid grid-cols-5 gap-1 mt-1">
                        {gradients.slice(10, 20).map((_, index) => {
                          const actualIndex = index + 10;
                          return (
                            <button
                              key={actualIndex}
                              className={`w-full aspect-square rounded-md ${gradients[actualIndex]} hover:scale-110 transition-transform ${
                                gradientIndex === actualIndex ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => handleGradientChange(actualIndex)}
                              aria-label={`Gradient style ${actualIndex + 1}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Font Style</h4>
                      <div className="flex flex-col space-y-1">
                        {fontFamilies.map((font) => (
                          <button
                            key={font}
                            className={`px-2 py-1 text-left rounded-md text-sm ${font} hover:bg-secondary transition-colors ${
                              fontFamily === font ? 'bg-secondary' : ''
                            }`}
                            onClick={() => handleFontChange(font)}
                          >
                            <span className="text-current">Aa</span> {font.replace('font-', '')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
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
          )}
        </AnimatePresence>
      </div>
    );
  }
);

BibleVerseCard.displayName = 'BibleVerseCard';

export default BibleVerseCard;
