import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('theme-preference');
    if (saved) return saved;
    
    // Default to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme-preference', currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return {
    currentTheme,
    toggleTheme
  };
};