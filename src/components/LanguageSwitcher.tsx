
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
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
import LanguageService from '@/services/LanguageService';

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
    { code: 'en', name: 'English', isLocal: true, isDisabled: false }
  ]);
  
  useEffect(() => {
    const checkLanguages = async () => {
      try {
        // Always start with English
        const initialLanguages = [
          { code: 'en', name: 'English', isLocal: true, isDisabled: false }
        ];
        
        // Only add Filipino if it's available
        try {
          const filAvailable = await BibleVerseService.isLanguageAvailable('fil');
          if (filAvailable) {
            initialLanguages.push({ code: 'fil', name: 'Filipino', isLocal: true, isDisabled: false });
          }
        } catch (error) {
          console.warn("Filipino language not available:", error);
        }
        
        const dbLanguages = await LanguageService.getActiveLanguages();
        
        const dbLangsFormatted = dbLanguages
          .filter(l => l.language_code !== 'en' && l.language_code !== 'fil' && l.is_active)
          .map(l => ({
            code: l.language_code,
            name: l.language_name,
            isLocal: false,
            isDisabled: !l.is_active || XmlManager.isLanguageDisabled(l.language_code)
          }));
        
        setAvailableLanguages([...initialLanguages, ...dbLangsFormatted]);
      } catch (error) {
        console.error('Error checking available languages:', error);
        // Ensure English is always available
        setAvailableLanguages([
          { code: 'en', name: 'English', isLocal: true, isDisabled: false }
        ]);
      }
    };
    
    checkLanguages();
    
    const handleLanguageDisabled = (event: CustomEvent) => {
      const disabledLang = event.detail;
      setAvailableLanguages(prev => 
        prev.map(lang => 
          lang.code === disabledLang 
            ? { ...lang, isDisabled: true }
            : lang
        ).filter(lang => lang.code === 'en' || !lang.isDisabled)  // Only keep English and enabled languages
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
      // If switching away from English, verify the target language is available
      if (language !== 'en') {
        const isAvailable = await BibleVerseService.isLanguageAvailable(language);
        if (!isAvailable) {
          toast({
            title: "Language Not Available",
            description: `Could not load the selected language. Using English instead.`,
            variant: "destructive"
          });
          onLanguageChange('en');
          return;
        }
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
        description: "Could not change language. Switching to English.",
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
        
        {/* Only show English and Filipino as local languages */}
        {availableLanguages
          .filter(lang => lang.isLocal && !lang.isDisabled)
          .map(lang => (
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
                <Badge variant="outline" className="ml-2 text-xs">Local</Badge>
              </div>
            </DropdownMenuItem>
          ))}
        
        {/* Only show active non-local languages */}
        {availableLanguages.filter(lang => !lang.isLocal && !lang.isDisabled).length > 0 && (
          <DropdownMenuSeparator />
        )}
        
        {availableLanguages
          .filter(lang => !lang.isLocal && !lang.isDisabled)
          .map(lang => (
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
