
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

// Enhanced collection of gradient backgrounds for light mode
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
  'bg-gradient-to-br from-amber-100 to-yellow-200',
  'bg-gradient-to-br from-fuchsia-100 to-pink-200',
  'bg-gradient-to-br from-violet-100 to-indigo-200',
  'bg-gradient-to-br from-cyan-100 to-blue-200',
  'bg-gradient-to-br from-emerald-100 to-teal-200',
  'bg-gradient-to-br from-rose-100 to-red-200',
  'bg-gradient-to-br from-amber-100 to-orange-200',
  'bg-gradient-to-tl from-blue-100 to-purple-200',
  'bg-gradient-to-tr from-green-100 to-blue-200',
  'bg-gradient-to-bl from-pink-100 to-purple-200',
  'bg-gradient-to-r from-orange-100 to-rose-200',
  'bg-gradient-to-r from-slate-100 to-blue-100',
  'bg-gradient-to-br from-violet-50 to-pink-100',
  'bg-gradient-to-tr from-amber-50 to-yellow-100',
  'bg-gradient-to-tl from-lime-100 to-green-100',
  'bg-gradient-to-bl from-sky-100 to-indigo-100',
  'bg-gradient-to-r from-red-50 to-amber-50',
  'bg-gradient-to-tr from-gray-100 to-slate-200',
  'bg-gradient-to-br from-blue-50 to-sky-100',
  'bg-gradient-to-tl from-stone-100 to-amber-100',
  'bg-gradient-to-bl from-emerald-50 to-teal-100',
];

// Enhanced dark mode gradients with vibrant and pastel options
const darkGradients = [
  'dark:bg-gradient-to-br dark:from-blue-950 dark:to-indigo-900',
  'dark:bg-gradient-to-br dark:from-emerald-950 dark:to-green-900',
  'dark:bg-gradient-to-br dark:from-amber-950 dark:to-yellow-900',
  'dark:bg-gradient-to-br dark:from-rose-950 dark:to-pink-900',
  'dark:bg-gradient-to-br dark:from-violet-950 dark:to-purple-900',
  'dark:bg-gradient-to-br dark:from-cyan-950 dark:to-sky-900',
  'dark:bg-gradient-to-br dark:from-orange-950 dark:to-red-900',
  'dark:bg-gradient-to-br dark:from-emerald-950 dark:to-teal-900',
  'dark:bg-gradient-to-br dark:from-purple-950 dark:to-indigo-900',
  'dark:bg-gradient-to-br dark:from-yellow-950 dark:to-amber-900',
  'dark:bg-gradient-to-br dark:from-pink-900/90 dark:to-fuchsia-800/90',
  'dark:bg-gradient-to-br dark:from-indigo-900/90 dark:to-violet-800/90',
  'dark:bg-gradient-to-br dark:from-blue-900/90 dark:to-cyan-800/90',
  'dark:bg-gradient-to-br dark:from-teal-900/90 dark:to-emerald-800/90',
  'dark:bg-gradient-to-br dark:from-red-900/90 dark:to-rose-800/90',
  'dark:bg-gradient-to-br dark:from-orange-900/90 dark:to-amber-800/90',
  'dark:bg-gradient-to-tl dark:from-purple-900/90 dark:to-blue-800/90',
  'dark:bg-gradient-to-tr dark:from-blue-900/90 dark:to-green-800/90',
  'dark:bg-gradient-to-bl dark:from-purple-900/90 dark:to-pink-800/90',
  'dark:bg-gradient-to-r dark:from-rose-900/90 dark:to-orange-800/90',
  'dark:bg-gradient-to-r dark:from-gray-900 dark:to-slate-800',
  'dark:bg-gradient-to-br dark:from-slate-900 dark:to-zinc-800',
  'dark:bg-gradient-to-tr dark:from-stone-900 dark:to-neutral-800',
  'dark:bg-gradient-to-bl dark:from-zinc-900 dark:to-gray-800',
  'dark:bg-gradient-to-tl dark:from-sky-900 dark:to-blue-800',
  'dark:bg-gradient-to-r dark:from-emerald-900 dark:to-green-800',
  'dark:bg-gradient-to-br dark:from-amber-900 dark:to-yellow-800',
  'dark:bg-gradient-to-tr dark:from-fuchsia-900 dark:to-pink-800',
  'dark:bg-gradient-to-bl dark:from-indigo-900 dark:to-violet-800',
  'dark:bg-gradient-to-tl dark:from-red-900 dark:to-rose-800',
];

// Alternative texture-based dark mode backgrounds
const textureDarkBgs = [
  'dark:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] dark:from-gray-900 dark:via-purple-900 dark:to-violet-900',
  'dark:bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] dark:from-blue-900 dark:via-blue-950 dark:to-gray-900',
  'dark:bg-[linear-gradient(to_right_bottom,_var(--tw-gradient-stops))] dark:from-gray-900 dark:via-purple-900 dark:to-blue-900',
  'dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-gray-900 dark:to-gray-800',
  'dark:bg-[linear-gradient(to_left_bottom,_var(--tw-gradient-stops))] dark:from-indigo-900 dark:via-gray-900 dark:to-gray-800',
  'dark:bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] dark:from-purple-900 dark:via-blue-900 dark:to-gray-900',
  'dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-gray-900 dark:to-black',
  'dark:bg-[linear-gradient(to_top_right,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-purple-900 dark:to-slate-900',
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
    const [useTextureStyle, setUseTextureStyle] = useState(false);
    const [darkStyleIndex, setDarkStyleIndex] = useState(0);
    
    useEffect(() => {
      if (verse && reference) {
        setKey(prev => prev + 1);
        const sum = reference.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        setGradientIndex(sum % gradients.length);
        setDarkStyleIndex(sum % textureDarkBgs.length);
      }
    }, [verse, reference]);
    
    const handleSaveImage = async () => {
      if (!ref) return;
      
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
        const clonedElement = element.cloneNode(true) as HTMLElement;
        document.body.appendChild(clonedElement);
        
        clonedElement.style.padding = '30px';
        clonedElement.style.borderRadius = '0px';
        clonedElement.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        
        const canvas = await html2canvas(clonedElement, {
          backgroundColor: null,
          scale: 3,
          useCORS: true,
          allowTaint: true,
          logging: false
        });
        
        document.body.removeChild(clonedElement);
        
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `bible-verse-${reference.replace(/\s+/g, '-').replace(/:/g, '-')}.png`;
        link.click();
        
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
      setUseTextureStyle(false);
      setKey(prev => prev + 1);
    };

    const handleTextureChange = (index: number) => {
      setUseTextureStyle(true);
      setDarkStyleIndex(index);
      setKey(prev => prev + 1);
    };

    const handleFontChange = (font: string) => {
      setFontFamily(font);
      setKey(prev => prev + 1);
    };

    if (!verse || !reference) {
      return (
        <div className="w-full max-w-2xl p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400">No verse to display</p>
        </div>
      );
    }
    
    let backgroundClass;
    
    if (useTextureStyle) {
      backgroundClass = `${gradients[gradientIndex]} ${textureDarkBgs[darkStyleIndex]}`;
    } else {
      backgroundClass = `${gradients[gradientIndex]} ${darkGradients[gradientIndex]}`;
    }
    
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
              className={`relative w-full max-w-2xl ${backgroundClass} dark:text-gray-100 rounded-xl shadow-md overflow-hidden border dark:border-gray-800`}
              whileHover={{ scale: 1.01, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className="px-8 py-12 sm:p-12">
                <div className="text-center">
                  {category && category !== 'All' && (
                    <motion.p 
                      className="mb-2 text-sm italic opacity-80"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      — {category}
                    </motion.p>
                  )}
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
                      <h4 className="text-sm font-medium mb-2">Light Mode Style</h4>
                      <div className="grid grid-cols-5 gap-1">
                        {gradients.slice(0, 15).map((_, index) => (
                          <button
                            key={index}
                            className={`w-full aspect-square rounded-md ${gradients[index]} hover:scale-110 transition-transform ${
                              gradientIndex === index && !useTextureStyle ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => handleGradientChange(index)}
                            aria-label={`Gradient style ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Dark Mode Style</h4>
                      <div className="grid grid-cols-5 gap-1">
                        {textureDarkBgs.map((_, index) => (
                          <button
                            key={`texture-${index}`}
                            className={`w-full aspect-square rounded-md ${textureDarkBgs[index]} hover:scale-110 transition-transform ${
                              darkStyleIndex === index && useTextureStyle ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => handleTextureChange(index)}
                            aria-label={`Dark texture style ${index + 1}`}
                          />
                        ))}
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
