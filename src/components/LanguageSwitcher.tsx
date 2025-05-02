
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Check, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['en']);
  
  // Check available languages on mount
  useEffect(() => {
    const checkLanguages = async () => {
      try {
        const enAvailable = await BibleVerseService.isLanguageAvailable('en');
        const filAvailable = await BibleVerseService.isLanguageAvailable('fil');
        
        const available = [];
        if (enAvailable) available.push('en');
        if (filAvailable) available.push('fil');
        
        setAvailableLanguages(available);
      } catch (error) {
        console.error('Error checking available languages:', error);
      }
    };
    
    checkLanguages();
  }, []);
  
  const handleLanguageChange = async (language: string) => {
    if (language === currentLanguage) return;
    
    setIsChanging(true);
    
    try {
      // Check if the language is available
      if (!availableLanguages.includes(language)) {
        toast({
          title: "Language Not Available",
          description: `The selected language is not available.`,
          variant: "destructive"
        });
        return;
      }
      
      onLanguageChange(language);
      
      toast({
        title: "Language Changed",
        description: language === 'en' ? "Switched to English" : "Switched to Filipino",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error changing language:', error);
      toast({
        title: "Error",
        description: "Could not change language. Please try again.",
        variant: "destructive"
      });
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
          {isChanging ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {currentLanguage === 'en' ? 'English' : 'Filipino'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={currentLanguage === 'en' ? 'bg-secondary' : ''}
          disabled={isChanging || !availableLanguages.includes('en')}
        >
          <div className="flex items-center w-full justify-between">
            <span>English</span>
            {currentLanguage === 'en' && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('fil')}
          className={currentLanguage === 'fil' ? 'bg-secondary' : ''}
          disabled={isChanging || !availableLanguages.includes('fil')}
        >
          <div className="flex items-center w-full justify-between">
            <span>Filipino</span>
            {currentLanguage === 'fil' && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
