
import React, { createContext, useContext, useState, useEffect } from 'react';
import { setLanguage, getCurrentLanguage } from '@/lib/i18n';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  language: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  updateLanguage: (language: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguageState] = useState(getCurrentLanguage());

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (newTheme === 'light') {
      root.classList.add('light');
    } else if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
    }
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const updateLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    setLanguageState(newLanguage);
    // Force re-render by updating a state value
    window.dispatchEvent(new Event('languageChange'));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('system');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, language, setTheme, updateLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};
