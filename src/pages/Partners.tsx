
import React from 'react';
import { motion } from 'framer-motion';
import PartnersComponent from '@/components/Partners';

const PartnersPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-4 text-center">Our Partners</h1>
        <p className="text-center mb-8 text-muted-foreground max-w-2xl mx-auto">
          We're grateful for the support of these amazing organizations who help us bring God's word to people around the world.
        </p>
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl mb-10">
          <PartnersComponent />
        </div>
      </motion.div>
    </div>
  );
};

export default PartnersPage;
