
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bookmark, TrashIcon, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { formatVerseText } from '@/utils/verseUtils';

interface BookmarkedVerse {
  verse: string;
  reference: string;
  category?: string;
  timestamp: number;
}

const Bookmarks: React.FC = () => {
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<BookmarkedVerse[]>([]);
  
  useEffect(() => {
    const loadBookmarks = () => {
      const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedVerses') || '[]');
      // Sort by newest first
      savedBookmarks.sort((a: BookmarkedVerse, b: BookmarkedVerse) => b.timestamp - a.timestamp);
      setBookmarks(savedBookmarks);
    };
    
    loadBookmarks();
    
    // Listen for storage events (in case bookmarks are updated in another tab)
    window.addEventListener('storage', loadBookmarks);
    
    return () => {
      window.removeEventListener('storage', loadBookmarks);
    };
  }, []);
  
  const handleRemoveBookmark = (reference: string) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.reference !== reference);
    localStorage.setItem('bookmarkedVerses', JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
    
    toast({
      title: "Bookmark Removed",
      description: `${reference} has been removed from your bookmarks.`,
      duration: 2000,
    });
  };
  
  const handleShareBookmark = (verse: string, reference: string) => {
    const shareText = `"${verse}" — ${reference}`;
    const shareUrl = `${window.location.origin}/?bibleverse=${encodeURIComponent(reference)}`;
    
    try {
      if (navigator.share) {
        navigator.share({
          title: 'Bible Verse',
          text: shareText,
          url: shareUrl,
        });
      } else {
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast({
          title: "Copied to clipboard",
          description: "Verse has been copied to clipboard",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      toast({
        title: "Copied to clipboard",
        description: "Verse has been copied to clipboard",
        duration: 2000,
      });
    }
  };
  
  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bookmark className="h-6 w-6" />
          Your Bookmarked Verses
        </h1>
        <Link to="/">
          <Button variant="outline" size="sm">
            Back to Home
          </Button>
        </Link>
      </div>
      
      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-500">You don't have any bookmarked verses yet.</p>
          <p className="text-gray-400 mt-2">
            Bookmark your favorite verses to access them quickly later.
          </p>
          <Link to="/" className="mt-6 inline-block">
            <Button>Find Verses to Bookmark</Button>
          </Link>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 gap-4">
            {bookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.reference}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{bookmark.reference}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareBookmark(bookmark.verse, bookmark.reference)}
                          className="h-8 w-8 p-0"
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBookmark(bookmark.reference)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                    {bookmark.category && bookmark.category !== 'All' && (
                      <span className="text-xs bg-primary/10 px-2 py-1 rounded-full">
                        {bookmark.category}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {formatVerseText(bookmark.verse)}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <Link to={`/?bibleverse=${encodeURIComponent(bookmark.reference)}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Bookmarks;
