
import React, { useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Minimum swipe distance to trigger navigation (in px)
  const SWIPE_THRESHOLD = 50;
  // Maximum time for a swipe to be considered valid (in ms)
  const SWIPE_TIMEOUT = 300;
  
  // Use refs to track touch state to avoid stale closures
  const touchStateRef = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    isSwiping: false
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStateRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        isSwiping: true
      };
    }
  }, []);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Just prevent default scroll behavior if needed
    if (touchStateRef.current.isSwiping) {
      // Don't prevent default to allow normal scrolling
    }
  }, []);
  
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const touchState = touchStateRef.current;
    if (!touchState.isSwiping) return;
    
    const touch = e.changedTouches[0];
    if (!touch) {
      touchState.isSwiping = false;
      return;
    }
    
    const endX = touch.clientX;
    const endY = touch.clientY;
    const deltaX = endX - touchState.startX;
    const deltaY = Math.abs(endY - touchState.startY);
    const elapsedTime = Date.now() - touchState.startTime;
    
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
    
    touchState.isSwiping = false;
  }, [onNextVerse, onPreviousVerse, toast]);
  
  useEffect(() => {
    if (!isMobile) return;
    
    const element = containerRef.current;
    if (!element) return;
    
    // Add touch event listeners with proper options
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      // Ensure cleanup only happens if element still exists
      if (element && element.parentNode) {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      }
      // Reset touch state
      touchStateRef.current.isSwiping = false;
    };
  }, [isMobile, handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  return (
    <div ref={containerRef} className="relative w-full">
      {isMobile && (
        <>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 p-2 bg-black/5 dark:bg-white/5 rounded-r-lg opacity-50 pointer-events-none">
            <ArrowLeft className="h-6 w-6 text-muted-foreground" />
          </div>
          
          <div className="absolute top-1/2 right-0 -translate-y-1/2 p-2 bg-black/5 dark:bg-white/5 rounded-l-lg opacity-50 pointer-events-none">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>
        </>
      )}
      
      {children}
    </div>
  );
};

export default SwipeVerseNavigation;
