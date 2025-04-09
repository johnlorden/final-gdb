
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Check, AlertCircle, Loader2 } from 'lucide-react';
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
  
  const handleLanguageChange = async (language: string) => {
    if (language === currentLanguage) return;
    
    setIsChanging(true);
    
    try {
      // Check if the language is valid
      const isValid = await BibleVerseService.isLanguageAvailable(language);
      
      if (!isValid) {
        toast({
          title: "Language Not Available",
          description: `The selected language is not available.`,
          variant: "destructive"
        });
        setIsChanging(false);
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
  
  // Function to check if a language is available
  const isLanguageUnavailable = async (lang: string): Promise<boolean> => {
    if (!lang) return false;
    const available = await BibleVerseService.isLanguageAvailable(lang);
    return !available;
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
          disabled={isChanging}
        >
          <div className="flex items-center w-full justify-between">
            <span>English</span>
            {currentLanguage === 'en' && (
              <Check className="h-4 w-4 ml-2" />
            )}
            {BibleVerseService.getLanguage() === 'en' && !BibleVerseService.isLanguageAvailable('en') && (
              <AlertCircle className="h-4 w-4 ml-2 text-red-500" />
            )}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('fil')}
          className={currentLanguage === 'fil' ? 'bg-secondary' : ''}
          disabled={isChanging}
        >
          <div className="flex items-center w-full justify-between">
            <span>Filipino</span>
            {currentLanguage === 'fil' && (
              <Check className="h-4 w-4 ml-2" />
            )}
            {BibleVerseService.getLanguage() === 'fil' && !BibleVerseService.isLanguageAvailable('fil') && (
              <AlertCircle className="h-4 w-4 ml-2 text-red-500" />
            )}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
