
import React, { useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface SwipeVerseNavigationProps {
  onNextVerse: () => void;
  onPreviousVerse: () => void;
  children: React.ReactNode;
}

const SwipeVerseNavigation: React.FC<SwipeVerseNavigationProps> = ({
  onNextVerse,
  onPreviousVerse,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Minimum swipe distance to trigger navigation (in px)
  const SWIPE_THRESHOLD = 50;
  // Maximum time for a swipe to be considered valid (in ms)
  const SWIPE_TIMEOUT = 300;
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    let startX: number;
    let startY: number;
    let startTime: number;
    let isSwiping = false;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      isSwiping = true;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping) return;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwiping) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = Math.abs(endY - startY);
      const elapsedTime = Date.now() - startTime;
      
      // Only process horizontal swipes (ignore if vertical movement is dominant)
      if (deltaY < Math.abs(deltaX) && elapsedTime < SWIPE_TIMEOUT) {
        if (deltaX > SWIPE_THRESHOLD) {
          // Swiped right -> previous verse
          onPreviousVerse();
          
          // Visual feedback
          toast({
            title: "Previous Verse",
            description: "Swiped to previous verse",
            duration: 1000,
          });
        } else if (deltaX < -SWIPE_THRESHOLD) {
          // Swiped left -> next verse
          onNextVerse();
          
          // Visual feedback
          toast({
            title: "Next Verse",
            description: "Swiped to next verse",
            duration: 1000,
          });
        }
      }
      
      isSwiping = false;
    };
    
    const element = containerRef.current;
    
    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      // Clean up event listeners
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onNextVerse, onPreviousVerse]);
  
  return (
    <div ref={containerRef} className="relative w-full">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 p-2 bg-black/5 dark:bg-white/5 rounded-r-lg opacity-50">
        <ArrowLeft className="h-6 w-6 text-muted-foreground" />
      </div>
      
      <div className="absolute top-1/2 right-0 -translate-y-1/2 p-2 bg-black/5 dark:bg-white/5 rounded-l-lg opacity-50">
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
      </div>
      
      {children}
    </div>
  );
};

export default SwipeVerseNavigation;
