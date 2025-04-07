
import React from 'react';
import PartnersComponent from '@/components/Partners';

const PartnersPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Partners</h1>
      <p className="text-center mb-8 text-muted-foreground">
        We're grateful for the support of these amazing organizations
      </p>
      <PartnersComponent />
    </div>
  );
};

export default PartnersPage;
