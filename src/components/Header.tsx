
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Clock, Bookmark, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RecentVerses from './RecentVerses';
import SimpleLanguageSwitcher from './SimpleLanguageSwitcher';
import OfflineMode from './OfflineMode';
import MobileMenu from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';

interface VerseItem {
  verse: string;
  reference: string;
  timestamp: number;
}

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <header className="w-full py-3 border-b dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm fixed top-0 z-10">
      <div className="container px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isMobile ? (
            <MobileMenu />
          ) : (
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <h1 className="text-lg sm:text-xl font-bold truncate">God's Daily Bread</h1>
        </div>
        <div className="flex items-center space-x-2">
          {children}
          {!isMobile && (
            <>
              <Link to="/about">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">About</span>
                </Button>
              </Link>
              
              <Link to="/bookmarks">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Bookmarks</span>
                </Button>
              </Link>
              
              <a 
                href="https://www.bible.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Bible</span>
                </Button>
              </a>
              
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
