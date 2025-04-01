
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Home, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full py-3 border-b dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm fixed top-0 z-10">
      <div className="container flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">God's Daily Bread</h1>
        </div>
        <div className="flex items-center space-x-2">
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
