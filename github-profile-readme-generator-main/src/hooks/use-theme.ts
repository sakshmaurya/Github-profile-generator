'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/store';
import type { ThemeMode } from '@/types/theme';

export function useTheme() {
  const { mode, resolvedTheme, setMode, setResolvedTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      const isDark = mode === 'dark' || (mode === 'system' && mediaQuery.matches);
      const newTheme = isDark ? 'dark' : 'light';

      if (resolvedTheme !== newTheme) {
        setResolvedTheme(newTheme);

        root.classList.add('theme-switching');

        requestAnimationFrame(() => {
          root.classList.remove('dark', 'light');

          root.classList.add(newTheme);

          setTimeout(() => {
            root.classList.remove('theme-switching');
          }, 25);
        });
      }
    };

    updateTheme();

    const listener = () => {
      if (mode === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [mode, resolvedTheme, setResolvedTheme]);

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  return {
    theme: mode,
    resolvedTheme,
    setTheme,
  };
}
