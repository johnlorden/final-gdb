
import React from 'react';
import { Heart } from 'lucide-react';

const DonateFooter: React.FC = () => {
  return (
    <div className="w-full py-4 px-6 flex items-center justify-center border-t border-gray-200">
      <a 
        href="https://johnlorden.com/donate" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors text-sm md:text-base"
      >
        <Heart size={16} className="text-red-500" />
        <span>Support this ministry with a donation</span>
      </a>
    </div>
  );
};

export default DonateFooter;
