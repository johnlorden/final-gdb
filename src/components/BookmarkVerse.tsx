
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface BookmarkVerseProps {
  verse: string;
  reference: string;
  category?: string;
}

interface BookmarkItem {
  verse: string;
  reference: string;
  category?: string;
  collections?: string[];
  notes?: string;
  timestamp: number;
}

const BookmarkVerse: React.FC<BookmarkVerseProps> = ({ verse, reference, category }) => {
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [collections, setCollections] = useState<string[]>([]);
  const [newCollection, setNewCollection] = useState('');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  
  // Load all collections
  useEffect(() => {
    const bookmarkedVerses: BookmarkItem[] = JSON.parse(localStorage.getItem('bookmarkedVerses') || '[]');
    const allCollections = new Set<string>();
    
    bookmarkedVerses.forEach(bookmark => {
      if (bookmark.collections && bookmark.collections.length > 0) {
        bookmark.collections.forEach(collection => allCollections.add(collection));
      }
    });
    
    setCollections(Array.from(allCollections).sort());
  }, [isBookmarked]);
  
  // On mount, check if this verse is bookmarked
  useEffect(() => {
    if (!reference) return;
    
    // Get bookmarked verses from localStorage
    const bookmarkedVerses: BookmarkItem[] = JSON.parse(localStorage.getItem('bookmarkedVerses') || '[]');
    const currentBookmark = bookmarkedVerses.find(
      (bookmark) => bookmark.reference === reference
    );
    
    if (currentBookmark) {
      setIsBookmarked(true);
      setSelectedCollections(currentBookmark.collections || []);
      setNotes(currentBookmark.notes || '');
    } else {
      setIsBookmarked(false);
      setSelectedCollections([]);
      setNotes('');
    }
  }, [reference]);
  
  const toggleBookmark = () => {
    if (!verse || !reference) return;
    
    // Get current bookmarks
    const bookmarkedVerses: BookmarkItem[] = JSON.parse(localStorage.getItem('bookmarkedVerses') || '[]');
    
    if (isBookmarked) {
      // Remove bookmark
      const updatedBookmarks = bookmarkedVerses.filter(
        (bookmark) => bookmark.reference !== reference
      );
      localStorage.setItem('bookmarkedVerses', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      
      toast({
        title: "Bookmark Removed",
        description: `${reference} has been removed from your bookmarks.`,
        duration: 2000,
      });
    } else {
      // Open dialog for adding a bookmark with collections
      setShowDialog(true);
    }
  };
  
  const handleAddBookmark = () => {
    if (!verse || !reference) return;
    
    // Get current bookmarks
    const bookmarkedVerses: BookmarkItem[] = JSON.parse(localStorage.getItem('bookmarkedVerses') || '[]');
    
    // Add bookmark with collections
    const newBookmark: BookmarkItem = {
      verse,
      reference,
      category,
      collections: selectedCollections.length > 0 ? selectedCollections : undefined,
      notes: notes.trim() ? notes : undefined,
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
    
    setShowDialog(false);
  };
  
  const updateBookmark = () => {
    if (!verse || !reference) return;
    
    // Get current bookmarks
    const bookmarkedVerses: BookmarkItem[] = JSON.parse(localStorage.getItem('bookmarkedVerses') || '[]');
    
    // Update existing bookmark
    const updatedBookmarks = bookmarkedVerses.map(bookmark => {
      if (bookmark.reference === reference) {
        return {
          ...bookmark,
          collections: selectedCollections.length > 0 ? selectedCollections : undefined,
          notes: notes.trim() ? notes : undefined,
        };
      }
      return bookmark;
    });
    
    localStorage.setItem('bookmarkedVerses', JSON.stringify(updatedBookmarks));
    
    toast({
      title: "Bookmark Updated",
      description: `${reference} has been updated.`,
      duration: 2000,
    });
    
    setShowDialog(false);
  };
  
  const handleCollectionToggle = (collection: string) => {
    setSelectedCollections(prev => {
      if (prev.includes(collection)) {
        return prev.filter(c => c !== collection);
      } else {
        return [...prev, collection];
      }
    });
  };
  
  const handleAddNewCollection = () => {
    if (!newCollection.trim()) return;
    
    const trimmedCollection = newCollection.trim();
    
    if (collections.includes(trimmedCollection)) {
      // Just select it if it already exists
      if (!selectedCollections.includes(trimmedCollection)) {
        setSelectedCollections(prev => [...prev, trimmedCollection]);
      }
    } else {
      // Add new collection and select it
      setCollections(prev => [...prev, trimmedCollection].sort());
      setSelectedCollections(prev => [...prev, trimmedCollection]);
    }
    
    setNewCollection('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNewCollection();
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            title={isBookmarked ? "Manage bookmark" : "Add bookmark"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
            <span className="sr-only">{isBookmarked ? "Manage bookmark" : "Add bookmark"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{isBookmarked ? "Bookmark Options" : "Add Bookmark"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {isBookmarked ? (
            <>
              <DropdownMenuItem onClick={() => setShowDialog(true)}>
                Edit Collections & Notes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleBookmark}>
                Remove Bookmark
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => setShowDialog(true)}>
                Add with Collections
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleBookmark}>
                Quick Bookmark
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isBookmarked ? "Edit Bookmark" : "Add Bookmark"}</DialogTitle>
            <DialogDescription>
              {isBookmarked 
                ? "Update collections and notes for this verse" 
                : "Add this verse to your bookmarks with collections"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Reference</h4>
              <p className="text-sm">{reference}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Collections</h4>
              <div className="flex flex-wrap gap-2">
                {collections.map(collection => (
                  <Button
                    key={collection}
                    variant={selectedCollections.includes(collection) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCollectionToggle(collection)}
                    className="text-xs h-7"
                  >
                    {collection}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="New collection..."
                  value={newCollection}
                  onChange={(e) => setNewCollection(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8 text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={handleAddNewCollection}
                  disabled={!newCollection.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Notes (optional)</h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[80px] p-2 text-sm border rounded-md"
                placeholder="Add your personal notes about this verse..."
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={isBookmarked ? updateBookmark : handleAddBookmark}
            >
              {isBookmarked ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookmarkVerse;
