
import React, { useState, useEffect } from 'react';
import BibleVerseCard from '@/components/BibleVerseCard';
import DonateFooter from '@/components/DonateFooter';
import { getRandomVerse, getRandomBackground } from '@/services/BibleVerseService';
import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [verse, setVerse] = useState('');
  const [reference, setReference] = useState('');
  const [background, setBackground] = useState('');
  const { toast } = useToast();

  const loadNewVerse = () => {
    const { verse, reference } = getRandomVerse();
    const newBackground = getRandomBackground();
    
    setVerse(verse);
    setReference(reference);
    setBackground(newBackground);
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
    <div className={`min-h-screen flex flex-col items-center justify-between ${background} transition-colors duration-500`}>
      <div className="flex-grow w-full flex items-center justify-center p-4">
        <BibleVerseCard 
          verse={verse} 
          reference={reference} 
          onRefresh={handleRefresh} 
        />
      </div>
      <DonateFooter />
    </div>
  );
};

export default Index;
