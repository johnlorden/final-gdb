
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface SimpleLanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const SimpleLanguageSwitcher: React.FC<SimpleLanguageSwitcherProps> = ({ 
  currentLanguage, 
  onLanguageChange 
}) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fil', name: 'Filipino (Tagalog)' }
  ];
  
  const handleLanguageChange = (language: string) => {
    if (language === currentLanguage) return;
    onLanguageChange(language);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languages.find(l => l.code === currentLanguage)?.name || 'English'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        
        {languages.map(lang => (
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

export default SimpleLanguageSwitcher;
