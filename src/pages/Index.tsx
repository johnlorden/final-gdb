
import React, { useState, useEffect } from 'react';
import BibleVerseCard from '@/components/BibleVerseCard';
import DonateFooter from '@/components/DonateFooter';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import VerseCategories from '@/components/VerseCategories';
import RecentVerses from '@/components/RecentVerses';
import { 
  getRandomVerse, 
  getRandomBackground, 
  getCategories, 
  getVersesByCategory,
  searchVerses,
  storeRecentVerse,
  getRecentVerses
} from '@/services/BibleVerseService';
import { useToast } from '@/hooks/use-toast';
import { applySecurityHeaders } from '@/utils/security';
import { BibleVerse } from '@/services/BibleVerseService';

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
      
      <main className="flex-grow w-full flex flex-col items-center justify-center p-4 pt-20 pb-16">
        <div className="container max-w-4xl mx-auto">
          <SearchBar onSearch={handleSearch} />
          
          <VerseCategories 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategorySelect} 
          />
          
          <BibleVerseCard 
            verse={verse} 
            reference={reference} 
            onRefresh={handleRefresh}
            background={background}
            loading={loading}
          />
          
          <RecentVerses 
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
