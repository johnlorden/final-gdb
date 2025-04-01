
import React from 'react';
import { Heart } from 'lucide-react';

const DonateFooter: React.FC = () => {
  return (
    <div className="w-full py-4 px-6 flex items-center justify-center border-t border-gray-200">
      <p className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
        Made with <Heart size={16} className="text-red-500" /> by <a 
          href="https://johnlorden.online" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-green-600 hover:text-white-800 transition-colors"
        >John Lorden</a> from the Victory Church
      </p>
    </div>
  );
};

export default DonateFooter;
