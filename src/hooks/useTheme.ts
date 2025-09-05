import { createContext } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Theme } from '../types';

const ThemeContext = createContext<Theme | undefined>(undefined);

export function useTheme(): Theme {
  const [isDark, setIsDark] = useLocalStorage('devnotes-dark-mode', false);

  const toggle = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize theme on first load
  if (isDark && !document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.add('dark');
  }

  return { isDark, toggle };
}

export const ThemeProvider = ThemeContext.Provider;