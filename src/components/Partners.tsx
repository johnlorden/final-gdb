
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Partner } from '@/types/PartnerTypes';
import { Skeleton } from './ui/skeleton';

const Partners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true);
        // Using a type assertion to handle the type mismatch
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .order('name');
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Cast the data to Partner[] type
        setPartners((data || []) as Partner[]);
      } catch (err: any) {
        console.error('Error fetching partners:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full aspect-video rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">Failed to load partners: {error}</p>
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No partner organizations available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
      {partners.map((partner) => (
        <a 
          key={partner.id} 
          href={partner.website_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block transition-transform hover:scale-105"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video relative">
              <img 
                src={partner.logo_url} 
                alt={`${partner.name} logo`} 
                className="w-full h-full object-contain p-2"
                loading="lazy"
              />
            </div>
            <div className="p-2 text-center">
              <p className="text-sm font-medium truncate">{partner.name}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default Partners;
