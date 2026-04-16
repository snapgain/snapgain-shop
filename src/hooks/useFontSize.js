import { useState, useEffect } from 'react';

export const useFontSize = () => {
  const [currentSize, setCurrentSize] = useState(() => {
    const saved = localStorage.getItem('font-size-preference');
    return saved || 'medium';
  });

  useEffect(() => {
    localStorage.setItem('font-size-preference', currentSize);
  }, [currentSize]);

  const getFontSizeClass = () => {
    return `font-size-${currentSize}`;
  };

  return {
    currentSize,
    setSize: setCurrentSize,
    getFontSizeClass
  };
};