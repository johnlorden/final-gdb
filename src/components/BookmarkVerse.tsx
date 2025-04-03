
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookmarkVerseProps {
  verse: string;
  reference: string;
  category?: string;
}

const BookmarkVerse: React.FC<BookmarkVerseProps> = ({ verse, reference, category }) => {
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  
  // On mount, check if this verse is bookmarked
  React.useEffect(() => {
    if (!reference) return;
    
    // Get bookmarked verses from localStorage
    const bookmarkedVerses = JSON.parse(localStorage.getItem('bookmarkedVerses') || '[]');
    const isCurrentVerseBookmarked = bookmarkedVerses.some(
      (bookmark: any) => bookmark.reference === reference
    );
    
    setIsBookmarked(isCurrentVerseBookmarked);
  }, [reference]);
  
  const toggleBookmark = () => {
    if (!verse || !reference) return;
    
    // Get current bookmarks
    const bookmarkedVerses = JSON.parse(localStorage.getItem('bookmarkedVerses') || '[]');
    
    if (isBookmarked) {
      // Remove bookmark
      const updatedBookmarks = bookmarkedVerses.filter(
        (bookmark: any) => bookmark.reference !== reference
      );
      localStorage.setItem('bookmarkedVerses', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      
      toast({
        title: "Bookmark Removed",
        description: `${reference} has been removed from your bookmarks.`,
        duration: 2000,
      });
    } else {
      // Add bookmark
      const newBookmark = {
        verse,
        reference,
        category,
        timestamp: Date.now(),
      };
      
      const updatedBookmarks = [...bookmarkedVerses, newBookmark];
      localStorage.setItem('bookmarkedVerses', JSON.stringify(updatedBookmarks));
      setIsBookmarked(true);
      
      toast({
        title: "Bookmark Added",
        description: `${reference} has been added to your bookmarks.`,
        duration: 2000,
      });
    }
  };
  
  return (
    <Button
      onClick={toggleBookmark}
      variant="ghost"
      size="sm"
      className="rounded-full"
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-5 w-5 text-primary" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
      <span className="sr-only">{isBookmarked ? "Remove bookmark" : "Add bookmark"}</span>
    </Button>
  );
};

export default BookmarkVerse;
