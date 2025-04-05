import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Palette, ChevronLeft, ChevronRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTheme } from "next-themes";

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

const GRADIENTS_PER_PAGE = 10;

const BibleVerseCard = forwardRef<HTMLDivElement, BibleVerseCardProps>(
  ({ verse, reference, category }, ref) => {
    const { toast } = useToast();
    const { theme } = useTheme();
    const [gradientIndex, setGradientIndex] = useState(0);
    const [fontFamily, setFontFamily] = useState(fontFamilies[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [key, setKey] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const [useTextureStyle, setUseTextureStyle] = useState(false);
    const [darkStyleIndex, setDarkStyleIndex] = useState(0);
    const [currentLightPage, setCurrentLightPage] = useState(1);
    const [currentDarkPage, setCurrentDarkPage] = useState(1);
    
    // Calculate total pages
    const totalLightPages = Math.ceil(gradients.length / GRADIENTS_PER_PAGE);
    const totalDarkPages = Math.ceil(darkGradients.length / GRADIENTS_PER_PAGE);
    const totalTexturePages = Math.ceil(textureDarkBgs.length / GRADIENTS_PER_PAGE);
    
    // Get current gradients for pagination
    const getCurrentLightGradients = useCallback(() => {
      const startIndex = (currentLightPage - 1) * GRADIENTS_PER_PAGE;
      return gradients.slice(startIndex, startIndex + GRADIENTS_PER_PAGE);
    }, [currentLightPage]);
    
    const getCurrentDarkGradients = useCallback(() => {
      const startIndex = (currentDarkPage - 1) * GRADIENTS_PER_PAGE;
      return darkGradients.slice(startIndex, startIndex + GRADIENTS_PER_PAGE);
    }, [currentDarkPage]);
    
    const getCurrentTextureGradients = useCallback(() => {
      const startIndex = (currentDarkPage - 1) * GRADIENTS_PER_PAGE;
      return textureDarkBgs.slice(startIndex, startIndex + GRADIENTS_PER_PAGE);
    }, [currentDarkPage]);
    
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
      const actualIndex = ((currentLightPage - 1) * GRADIENTS_PER_PAGE) + index;
      setGradientIndex(actualIndex);
      setUseTextureStyle(false);
      setKey(prev => prev + 1);
    };

    const handleDarkGradientChange = (index: number) => {
      const actualIndex = ((currentDarkPage - 1) * GRADIENTS_PER_PAGE) + index;
      setGradientIndex(actualIndex);
      setUseTextureStyle(false); 
      setKey(prev => prev + 1);
    };

    const handleTextureChange = (index: number) => {
      const actualIndex = ((currentDarkPage - 1) * GRADIENTS_PER_PAGE) + index;
      if (actualIndex < textureDarkBgs.length) {
        setDarkStyleIndex(actualIndex);
        setUseTextureStyle(true);
        setKey(prev => prev + 1);
      }
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
                <PopoverContent className="w-72 p-4" side="top">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Font Style</h4>
                      <Select value={fontFamily} onValueChange={handleFontChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a font" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontFamilies.map((font) => (
                            <SelectItem key={font} value={font}>
                              <span className={`${font}`}>
                                {font.replace('font-', '').charAt(0).toUpperCase() + font.replace('font-', '').slice(1)}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {theme !== "dark" && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Light Mode Style</h4>
                        <div className="grid grid-cols-5 gap-1">
                          {getCurrentLightGradients().map((_, index) => {
                            const actualIndex = ((currentLightPage - 1) * GRADIENTS_PER_PAGE) + index;
                            return (
                              <button
                                key={index}
                                className={`w-full aspect-square rounded-md ${gradients[actualIndex]} hover:scale-110 transition-transform ${
                                  gradientIndex === actualIndex && !useTextureStyle ? 'ring-2 ring-primary' : ''
                                }`}
                                onClick={() => handleGradientChange(index)}
                                aria-label={`Gradient style ${index + 1}`}
                              />
                            );
                          })}
                        </div>
                        
                        {totalLightPages > 1 && (
                          <Pagination className="mt-2">
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious 
                                  href="#" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (currentLightPage > 1) setCurrentLightPage(curr => curr - 1);
                                  }} 
                                  className={currentLightPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                              </PaginationItem>
                              
                              {Array.from({length: Math.min(3, totalLightPages)}).map((_, i) => {
                                const pageNum = currentLightPage <= 2 
                                  ? i + 1 
                                  : currentLightPage >= totalLightPages - 1
                                    ? totalLightPages - 2 + i
                                    : currentLightPage - 1 + i;
                                
                                if (pageNum > totalLightPages) return null;
                                
                                return (
                                  <PaginationItem key={pageNum}>
                                    <PaginationLink 
                                      href="#" 
                                      isActive={pageNum === currentLightPage}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentLightPage(pageNum);
                                      }}
                                    >
                                      {pageNum}
                                    </PaginationLink>
                                  </PaginationItem>
                                );
                              })}
                              
                              {totalLightPages > 3 && currentLightPage < totalLightPages - 1 && (
                                <PaginationItem>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              )}
                              
                              <PaginationItem>
                                <PaginationNext 
                                  href="#" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (currentLightPage < totalLightPages) setCurrentLightPage(curr => curr + 1);
                                  }}
                                  className={currentLightPage === totalLightPages ? "pointer-events-none opacity-50" : ""}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        )}
                      </div>
                    )}
                    
                    {theme === "dark" && (
                      <>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Dark Mode Style</h4>
                          <div className="grid grid-cols-5 gap-1">
                            {getCurrentDarkGradients().map((_, index) => {
                              const actualIndex = ((currentDarkPage - 1) * GRADIENTS_PER_PAGE) + index;
                              if (actualIndex >= darkGradients.length) return null;
                              return (
                                <button
                                  key={`dark-${index}`}
                                  className={`w-full aspect-square rounded-md ${darkGradients[actualIndex].replace('dark:', '')} hover:scale-110 transition-transform ${
                                    gradientIndex === actualIndex && !useTextureStyle ? 'ring-2 ring-primary' : ''
                                  }`}
                                  onClick={() => handleDarkGradientChange(index)}
                                  aria-label={`Dark gradient style ${index + 1}`}
                                />
                              );
                            })}
                          </div>
                          
                          {totalDarkPages > 1 && (
                            <Pagination className="mt-2">
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious 
                                    href="#" 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (currentDarkPage > 1) setCurrentDarkPage(curr => curr - 1);
                                    }}
                                    className={currentDarkPage === 1 ? "pointer-events-none opacity-50" : ""}
                                  />
                                </PaginationItem>
                                
                                {Array.from({length: Math.min(3, totalDarkPages)}).map((_, i) => {
                                  const pageNum = currentDarkPage <= 2 
                                    ? i + 1 
                                    : currentDarkPage >= totalDarkPages - 1
                                      ? totalDarkPages - 2 + i
                                      : currentDarkPage - 1 + i;
                                  
                                  if (pageNum > totalDarkPages) return null;
                                  
                                  return (
                                    <PaginationItem key={pageNum}>
                                      <PaginationLink 
                                        href="#" 
                                        isActive={pageNum === currentDarkPage}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setCurrentDarkPage(pageNum);
                                        }}
                                      >
                                        {pageNum}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                })}
                                
                                {totalDarkPages > 3 && currentDarkPage < totalDarkPages - 1 && (
                                  <PaginationItem>
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                )}
                                
                                <PaginationItem>
                                  <PaginationNext 
                                    href="#" 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (currentDarkPage < totalDarkPages) setCurrentDarkPage(curr => curr + 1);
                                    }}
                                    className={currentDarkPage === totalDarkPages ? "pointer-events-none opacity-50" : ""}
                                  />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Special Dark Textures</h4>
                          <div className="grid grid-cols-5 gap-1">
                            {getCurrentTextureGradients().map((_, index) => {
                              const actualIndex = ((currentDarkPage - 1) * GRADIENTS_PER_PAGE) + index;
                              if (actualIndex >= textureDarkBgs.length) return null;
                              return (
                                <button
                                  key={`texture-${index}`}
                                  className={`w-full aspect-square rounded-md ${textureDarkBgs[actualIndex].replace('dark:', '')} hover:scale-110 transition-transform ${
                                    darkStyleIndex === actualIndex && useTextureStyle ? 'ring-2 ring-primary' : ''
                                  }`}
                                  onClick={() => handleTextureChange(index)}
                                  aria-label={`Dark texture style ${index + 1}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
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
