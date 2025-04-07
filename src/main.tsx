
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import About from './pages/About.tsx'
import NotFound from './pages/NotFound.tsx'
import Bookmarks from './pages/Bookmarks.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import Index from './pages/Index.tsx'
import Partners from './pages/Partners.tsx'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="bible-verse-theme">
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Index />} />
            <Route path="about" element={<About />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="partners" element={<Partners />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
