import React, { useState, useEffect } from 'react';
import BibleVerseCard from '@/components/BibleVerseCard';
import DonateFooter from '@/components/DonateFooter';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import VerseCategories from '@/components/VerseCategories';
import SocialShareBar from '@/components/SocialShareBar';
import CollapsibleRecentVerses from '@/components/CollapsibleRecentVerses';
import { 
  getRandomVerse, 
  getRandomBackground, 
  getCategories, 
  getVersesByCategory,
  searchVerses,
  storeRecentVerse,
  getRecentVerses,
  findVerseByReference
} from '@/services/BibleVerseService';
import { useToast } from '@/hooks/use-toast';
import { applySecurityHeaders } from '@/utils/security';

const Index = () => {
  const [verse, setVerse] = useState('');
  const [reference, setReference] = useState('');
  const [category, setCategory] = useState('');
  const [background, setBackground] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [recentVerses, setRecentVerses] = useState<any[]>([]);
  const { toast } = useToast();

  // Apply security headers on initial load
  useEffect(() => {
    applySecurityHeaders();
  }, []);

  // Check for verse parameter in URL
  useEffect(() => {
    const checkUrlParams = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const verseParam = urlParams.get('bibleverse');
      
      if (verseParam) {
        try {
          setLoading(true);
          const foundVerse = await findVerseByReference(verseParam);
          
          if (foundVerse) {
            setVerse(foundVerse.verse);
            setReference(foundVerse.reference);
            setCategory(foundVerse.category);
            setBackground(getRandomBackground());
            storeRecentVerse(foundVerse);
            setRecentVerses(getRecentVerses());
          } else {
            // If verse not found, load random verse
            loadNewVerse();
          }
        } catch (error) {
          console.error('Error loading verse from URL:', error);
          loadNewVerse();
        } finally {
          setLoading(false);
        }
      } else {
        // No verse parameter, load random verse
        loadNewVerse();
      }
    };
    
    checkUrlParams();
  }, []);

  // Load categories on initial render
  useEffect(() => {
    const loadCategoriesData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategoriesData();
    setRecentVerses(getRecentVerses());
  }, []);

  const loadNewVerse = async () => {
    setLoading(true);
    try {
      const { verse, reference, category } = await getRandomVerse();
      const newBackground = getRandomBackground();
      
      setVerse(verse);
      setReference(reference);
      setCategory(category);
      setBackground(newBackground);

      // Store verse in recent verses
      storeRecentVerse({ verse, reference, category });
      // Update recent verses
      setRecentVerses(getRecentVerses());
      
      // Update URL without page reload
      const url = new URL(window.location.href);
      url.search = `?bibleverse=${encodeURIComponent(reference)}`;
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      console.error('Error loading verse:', error);
      toast({
        title: "Error loading verse",
        description: "Please try again later",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    
    try {
      const verses = await getVersesByCategory(category);
      if (verses.length > 0) {
        const randomIndex = Math.floor(Math.random() * verses.length);
        const selectedVerse = verses[randomIndex];
        const newBackground = getRandomBackground();
        
        setVerse(selectedVerse.verse);
        setReference(selectedVerse.reference);
        setCategory(selectedVerse.category);
        setBackground(newBackground);
        
        // Store verse in recent verses
        storeRecentVerse(selectedVerse);
        // Update recent verses
        setRecentVerses(getRecentVerses());
      }
    } catch (error) {
      console.error('Error loading verse by category:', error);
      toast({
        title: "Error loading verse",
        description: "Please try again later",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      loadNewVerse();
      return;
    }
    
    setLoading(true);
    try {
      const searchResults = await searchVerses(searchTerm);
      
      if (searchResults.length > 0) {
        const randomIndex = Math.floor(Math.random() * searchResults.length);
        const selectedVerse = searchResults[randomIndex];
        const newBackground = getRandomBackground();
        
        setVerse(selectedVerse.verse);
        setReference(selectedVerse.reference);
        setCategory(selectedVerse.category);
        setBackground(newBackground);
        
        // Store verse in recent verses
        storeRecentVerse(selectedVerse);
        // Update recent verses
        setRecentVerses(getRecentVerses());
        
        toast({
          title: "Verse found",
          description: `Found ${searchResults.length} verses matching "${searchTerm}"`,
          duration: 2000,
        });
      } else {
        toast({
          title: "No verses found",
          description: `No verses matching "${searchTerm}" were found`,
          variant: "destructive",
          duration: 3000,
        });
        
        // Load a random verse instead
        await loadNewVerse();
      }
    } catch (error) {
      console.error('Error searching verses:', error);
      toast({
        title: "Error searching verses",
        description: "Please try again later",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectRecentVerse = (verseText: string, verseReference: string) => {
    setVerse(verseText);
    setReference(verseReference);
    const newBackground = getRandomBackground();
    setBackground(newBackground);
    
    // Update URL when selecting recent verse
    const url = new URL(window.location.href);
    url.search = `?bibleverse=${encodeURIComponent(verseReference)}`;
    window.history.replaceState({}, '', url.toString());
    
    toast({
      title: "Verse selected",
      description: `Showing ${verseReference}`,
      duration: 2000,
    });
  };

  useEffect(() => {
    loadNewVerse();
  }, []);

  const handleRefresh = () => {
    loadNewVerse();
    toast({
      title: "New verse loaded",
      description: "God's wisdom for your day",
      duration: 3000,
    });
  };

  return (
    <div className={`min-h-screen flex flex-col ${background} dark:text-white transition-colors duration-500`}>
      <Header />
      
      <main className="flex-grow w-full flex flex-col items-center justify-center px-4 pt-20 pb-16">
        <div className="container max-w-3xl mx-auto flex flex-col items-center">
          <div className="w-full max-w-lg mb-4">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="w-full max-w-xl mb-5">
            <VerseCategories 
              categories={categories} 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategorySelect} 
            />
          </div>
          
          <BibleVerseCard 
            verse={verse} 
            reference={reference} 
            onRefresh={handleRefresh}
            background={background}
            loading={loading}
          />
          
          {!loading && verse && (
            <SocialShareBar verse={verse} reference={reference} />
          )}
          
          <CollapsibleRecentVerses 
            verses={recentVerses} 
            onSelectVerse={handleSelectRecentVerse} 
          />
        </div>
      </main>
      
      <DonateFooter />
    </div>
  );
};

export default Index;
