
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Clock, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RecentVerses from './RecentVerses';
import LanguageSwitcher from './LanguageSwitcher';
import OfflineMode from './OfflineMode';

interface VerseItem {
  verse: string;
  reference: string;
  timestamp: number;
}

interface HeaderProps {
  recentVerses: VerseItem[];
  onSelectVerse: (verse: string, reference: string) => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  recentVerses, 
  onSelectVerse, 
  currentLanguage, 
  onLanguageChange,
  isOfflineMode,
  toggleOfflineMode
}) => {
  return (
    <header className="w-full py-3 border-b dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm fixed top-0 z-10">
      <div className="container px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold truncate">God's Daily Bread</h1>
        </div>
        <div className="flex items-center space-x-2">
          <OfflineMode 
            isOffline={isOfflineMode}
            toggleOfflineMode={toggleOfflineMode}
          />
          
          <Link to="/bookmarks">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Bookmarks</span>
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Recent</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px] bg-background">
              <div className="p-2">
                <h3 className="font-medium mb-2 px-2">Recently Viewed Verses</h3>
                <RecentVerses verses={recentVerses} onSelectVerse={onSelectVerse} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <LanguageSwitcher 
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />
          
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
        </div>
      </div>
    </header>
  );
};

export default Header;
