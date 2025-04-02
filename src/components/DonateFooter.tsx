
import React from 'react';

const DonateFooter = () => {
  return (
    <footer className="mt-8 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
      <p>Made with Love by <a 
        href="https://itsme.johnlorden.online" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
      >
        John Lorden
      </a> from Victory Church</p>
    </footer>
  );
};

export default DonateFooter;
