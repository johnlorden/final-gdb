
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import About from './pages/About.tsx'
import NotFound from './pages/NotFound.tsx'
import Bookmarks from './pages/Bookmarks.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="bible-verse-theme">
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
