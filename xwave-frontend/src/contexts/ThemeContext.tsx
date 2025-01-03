// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext<any>(null);

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
