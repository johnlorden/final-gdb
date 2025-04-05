
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Bookmark, X } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import OfflineMode from './OfflineMode';
import LanguageSwitcher from './LanguageSwitcher';

interface MobileMenuProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  currentLanguage,
  onLanguageChange,
  isOfflineMode,
  toggleOfflineMode
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-6">
        <DrawerHeader className="flex justify-between items-center pt-4 pb-2 border-b">
          <h2 className="font-semibold text-lg">Menu</h2>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex flex-col space-y-4 pt-4">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-secondary menu-item-appear delay-1">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/bookmarks" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-secondary menu-item-appear delay-2">
              <Bookmark className="h-5 w-5" />
              <span>Bookmarks</span>
            </Link>
            <a 
              href="https://www.bible.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-secondary menu-item-appear delay-3"
            >
              <BookOpen className="h-5 w-5" />
              <span>Bible</span>
            </a>
          </div>
          
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center px-4 menu-item-appear delay-4">
              <span className="font-medium">Dark Mode</span>
              <ThemeToggle />
            </div>
            <div className="flex justify-between items-center px-4 menu-item-appear delay-5">
              <span className="font-medium">Language</span>
              <LanguageSwitcher 
                currentLanguage={currentLanguage}
                onLanguageChange={onLanguageChange}
              />
            </div>
            <div className="flex justify-between items-center px-4 menu-item-appear delay-5">
              <span className="font-medium">Offline Mode</span>
              <OfflineMode 
                isOffline={isOfflineMode}
                toggleOfflineMode={toggleOfflineMode}
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
