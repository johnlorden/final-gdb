
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/ThemeProvider';
import { AppLayout } from './components/AppLayout';
import { useAppContext } from './components/AppContext';

// Export the context hook for use in other components
export function useVerseContext() {
  return useAppContext();
}

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
