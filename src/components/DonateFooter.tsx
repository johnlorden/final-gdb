
import React from 'react';
import { Heart } from 'lucide-react';

const DonateFooter: React.FC = () => {
  return (
    <div className="w-full py-4 px-6 flex items-center justify-center border-t border-gray-200 dark:border-gray-800">
      <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
        Made with <Heart size={16} className="text-red-500" /> by John Lorden from the Victory Church
      </p>
    </div>
  );
};

export default DonateFooter;
