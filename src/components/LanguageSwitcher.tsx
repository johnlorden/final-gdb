
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import BibleVerseService from '@/services/BibleVerseService';

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  currentLanguage, 
  onLanguageChange 
}) => {
  const { toast } = useToast();
  const [isChanging, setIsChanging] = useState(false);
  const [availableLanguages] = useState([
    { code: 'en', name: 'English' },
    { code: 'fil', name: 'Filipino (Tagalog)' }
  ]);
  
  const handleLanguageChange = async (language: string) => {
    if (language === currentLanguage) return;
    
    setIsChanging(true);
    
    try {
      const isAvailable = await BibleVerseService.isLanguageAvailable(language);
      
      if (!isAvailable && language !== 'en') {
        toast({
          title: "Language Not Available",
          description: `Could not load ${language} verses. Using English instead.`,
          variant: "destructive"
        });
        onLanguageChange('en');
        return;
      }
      
      onLanguageChange(language);
      
      const langInfo = availableLanguages.find(l => l.code === language);
      toast({
        title: "Language Changed",
        description: `Switched to ${langInfo ? langInfo.name : language}`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error changing language:', error);
      toast({
        title: "Error",
        description: "Could not change language. Using English.",
        variant: "destructive"
      });
      onLanguageChange('en');
    } finally {
      setIsChanging(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1" 
          disabled={isChanging}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {availableLanguages.find(l => l.code === currentLanguage)?.name || 'English'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        
        {availableLanguages.map(lang => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLanguage === lang.code ? 'bg-secondary' : ''}
          >
            <div className="flex items-center w-full justify-between">
              <span>{lang.name}</span>
              {currentLanguage === lang.code && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
