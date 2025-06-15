
import React, { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import { SettingsContextProvider } from './contexts/SettingsContext.tsx'
import { VerseContextProvider } from './contexts/VerseContext.tsx'
import { AppLayout } from './components/AppLayout.tsx'

// Use lazy loading for pages
const Index = lazy(() => import('./pages/Index.tsx'))
const About = lazy(() => import('./pages/About.tsx'))
const Bookmarks = lazy(() => import('./pages/Bookmarks.tsx'))
const NotFound = lazy(() => import('./pages/NotFound.tsx'))

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center w-full h-[70vh]">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
      <p className="text-lg text-muted-foreground">Loading...</p>
    </div>
  </div>
)

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="bible-verse-theme">
      <SettingsContextProvider>
        <VerseContextProvider>
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/" element={<App />}>
                  <Route index element={
                    <Suspense fallback={<PageLoader />}>
                      <Index />
                    </Suspense>
                  } />
                  <Route path="about" element={
                    <Suspense fallback={<PageLoader />}>
                      <About />
                    </Suspense>
                  } />
                  <Route path="bookmarks" element={
                    <Suspense fallback={<PageLoader />}>
                      <Bookmarks />
                    </Suspense>
                  } />
                  <Route path="*" element={
                    <Suspense fallback={<PageLoader />}>
                      <NotFound />
                    </Suspense>
                  } />
                </Route>
              </Routes>
            </AppLayout>
          </Router>
        </VerseContextProvider>
      </SettingsContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
