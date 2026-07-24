'use client';

import { previewThemes, type PreviewThemeType } from '@/types/preview-theme';

interface PreviewThemeSelectorProps {
  selectedTheme: PreviewThemeType;
  onThemeChange: (theme: PreviewThemeType) => void;
}

export function PreviewThemeSelector({ selectedTheme, onThemeChange }: PreviewThemeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Preview Theme:</label>
      <div className="flex gap-2">
        {Object.values(previewThemes).map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => onThemeChange(theme.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              selectedTheme === theme.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
            title={theme.description}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
}
