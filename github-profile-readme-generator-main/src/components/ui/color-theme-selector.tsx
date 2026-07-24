'use client';

import { useState, useEffect } from 'react';
import { colorThemes, type ColorThemeType } from '@/types/color-theme';

interface ColorThemeSelectorProps {
  selectedTheme: ColorThemeType;
  onThemeChange: (theme: ColorThemeType) => void;
}

export function ColorThemeSelector({ selectedTheme, onThemeChange }: ColorThemeSelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Color Theme</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Object.values(colorThemes).map((theme) => (
            <div
              key={theme.id}
              className="relative overflow-hidden rounded-lg border-2 border-border p-3"
              style={{ backgroundColor: theme.colors.background }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: theme.colors.text }}
                >
                  {theme.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          Choose a color theme to customize your README appearance. The theme affects badges, borders, and accent colors.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Color Theme</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {Object.values(colorThemes).map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => onThemeChange(theme.id)}
            className={`relative overflow-hidden rounded-lg border-2 p-3 transition-all hover:scale-105 ${
              selectedTheme === theme.id
                ? 'border-primary ring-2 ring-primary ring-offset-2'
                : 'border-border hover:border-primary/50'
            }`}
            style={{
              backgroundColor: theme.colors.background,
              borderColor: selectedTheme === theme.id ? theme.colors.primary : undefined,
            }}
            title={theme.description}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: theme.colors.accent }}
                />
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: theme.colors.text }}
              >
                {theme.name}
              </span>
            </div>
            {selectedTheme === theme.id && (
              <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
      
      <p className="text-muted-foreground text-xs">
        Choose a color theme to customize your README appearance. The theme affects badges, borders, and accent colors.
      </p>
    </div>
  );
}
