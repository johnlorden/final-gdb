
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { AppLayout } from './components/AppLayout';

const App = () => {
  return (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <Toaster />
    </>
  );
};

export default App;
