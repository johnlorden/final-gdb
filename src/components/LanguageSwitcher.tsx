
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Check, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import BibleVerseService from '@/services/BibleVerseService';
import { Badge } from '@/components/ui/badge';
import { XmlManager } from '@/services/utils/xml/XmlManager';

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
  const [availableLanguages, setAvailableLanguages] = useState<{code: string, name: string, isLocal: boolean, isDisabled: boolean}[]>([
    { code: 'en', name: 'English', isLocal: true, isDisabled: false },
    { code: 'fil', name: 'Filipino', isLocal: true, isDisabled: false }
  ]);
  
  // Check available languages on mount
  useEffect(() => {
    const checkLanguages = async () => {
      try {
        // Start with local languages
        const initialLanguages = [
          { code: 'en', name: 'English', isLocal: true, isDisabled: false },
          { code: 'fil', name: 'Filipino', isLocal: true, isDisabled: false }
        ];
        
        // Check if languages are available
        await Promise.all(initialLanguages.map(async (lang) => {
          const available = await BibleVerseService.isLanguageAvailable(lang.code);
          lang.isDisabled = !available;
        }));
        
        // Get additional languages from the database
        const dbLanguages = await LanguageService.getActiveLanguages();
        
        // Convert DB languages to our format and skip 'en' and 'fil' which are already included
        const dbLangsFormatted = dbLanguages
          .filter(l => l.language_code !== 'en' && l.language_code !== 'fil')
          .map(l => ({
            code: l.language_code,
            name: l.language_name,
            isLocal: false,
            isDisabled: !l.is_active || XmlManager.isLanguageDisabled(l.language_code)
          }));
        
        // Merge arrays with local languages first
        setAvailableLanguages([...initialLanguages, ...dbLangsFormatted]);
        
        // Preload languages in the background
        setTimeout(() => {
          dbLangsFormatted.forEach(lang => {
            if (!lang.isDisabled) {
              BibleVerseService.isLanguageAvailable(lang.code).catch(() => {
                // This will update the disabled status if it fails
              });
            }
          });
        }, 1000);
        
      } catch (error) {
        console.error('Error checking available languages:', error);
      }
    };
    
    checkLanguages();
    
    // Listen for language disabled events
    const handleLanguageDisabled = (event: CustomEvent) => {
      const disabledLang = event.detail;
      setAvailableLanguages(prev => 
        prev.map(lang => 
          lang.code === disabledLang 
            ? { ...lang, isDisabled: true }
            : lang
        )
      );
    };
    
    window.addEventListener('language-disabled', handleLanguageDisabled as EventListener);
    return () => {
      window.removeEventListener('language-disabled', handleLanguageDisabled as EventListener);
    };
  }, []);
  
  const handleLanguageChange = async (language: string) => {
    if (language === currentLanguage) return;
    
    setIsChanging(true);
    
    try {
      // Find the language info
      const langInfo = availableLanguages.find(l => l.code === language);
      if (!langInfo) {
        toast({
          title: "Language Not Available",
          description: `The selected language is not available.`,
          variant: "destructive"
        });
        return;
      }
      
      // Double check if the language is disabled
      if (langInfo.isDisabled) {
        toast({
          title: "Language Not Available",
          description: `The selected language is disabled due to errors.`,
          variant: "destructive"
        });
        return;
      }
      
      // Check if the language is available (for non-local languages)
      if (!langInfo.isLocal) {
        const isAvailable = await BibleVerseService.isLanguageAvailable(language);
        if (!isAvailable) {
          setAvailableLanguages(prev => 
            prev.map(lang => 
              lang.code === language 
                ? { ...lang, isDisabled: true }
                : lang
            )
          );
          
          toast({
            title: "Language Not Available",
            description: `Could not load the selected language. The language has been disabled.`,
            variant: "destructive"
          });
          return;
        }
      }
      
      onLanguageChange(language);
      
      toast({
        title: "Language Changed",
        description: `Switched to ${langInfo.name}`,
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
            {availableLanguages.find(l => l.code === currentLanguage)?.name || 
             (currentLanguage === 'en' ? 'English' : currentLanguage === 'fil' ? 'Filipino' : currentLanguage)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        
        {/* Local Languages First */}
        {availableLanguages
          .filter(lang => lang.isLocal)
          .map(lang => (
            <DropdownMenuItem 
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={currentLanguage === lang.code ? 'bg-secondary' : ''}
              disabled={isChanging || lang.isDisabled}
            >
              <div className="flex items-center w-full justify-between">
                <span>{lang.name}</span>
                {currentLanguage === lang.code && (
                  <Check className="h-4 w-4 ml-2" />
                )}
                {lang.isLocal && (
                  <Badge variant="outline" className="ml-2 text-xs">Local</Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        
        <DropdownMenuSeparator />
        
        {/* Remote Languages */}
        {availableLanguages
          .filter(lang => !lang.isLocal)
          .map(lang => (
            <DropdownMenuItem 
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`${currentLanguage === lang.code ? 'bg-secondary' : ''} ${lang.isDisabled ? 'opacity-50' : ''}`}
              disabled={isChanging || lang.isDisabled}
            >
              <div className="flex items-center w-full justify-between">
                <span>{lang.name}</span>
                {currentLanguage === lang.code && (
                  <Check className="h-4 w-4 ml-2" />
                )}
                {lang.isDisabled && (
                  <Badge variant="outline" className="ml-2 text-xs bg-red-100 text-red-800">Disabled</Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;

// Import needed for the component
import LanguageService from '@/services/LanguageService';
