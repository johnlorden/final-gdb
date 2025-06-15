import React from 'react';
import { Menu, X, Home, Bookmark, Info, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import SimpleLanguageSwitcher from './SimpleLanguageSwitcher';
import { useSimpleSettingsContext } from '@/contexts/SimpleSettingsContext';

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, handleLanguageChange } = useSimpleSettingsContext();

  const closeMenu = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-8">
          <Link to="/" onClick={closeMenu}>
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          
          <Link to="/about" onClick={closeMenu}>
            <Button variant="ghost" className="w-full justify-start">
              <Info className="mr-2 h-4 w-4" />
              About
            </Button>
          </Link>
          
          <Link to="/bookmarks" onClick={closeMenu}>
            <Button variant="ghost" className="w-full justify-start">
              <Bookmark className="mr-2 h-4 w-4" />
              Bookmarks
            </Button>
          </Link>
          
          <a 
            href="https://www.bible.com" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            <Button variant="ghost" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Read Bible
            </Button>
          </a>
          
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Language</span>
              <SimpleLanguageSwitcher 
                currentLanguage={language} 
                onLanguageChange={handleLanguageChange} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
