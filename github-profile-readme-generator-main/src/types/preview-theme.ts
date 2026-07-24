export type PreviewThemeType = 'light' | 'dark' | 'dimmed' | 'auto';

export interface PreviewTheme {
  id: PreviewThemeType;
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  codeBackgroundColor: string;
  borderColor: string;
}

export const previewThemes: Record<PreviewThemeType, PreviewTheme> = {
  light: {
    id: 'light',
    name: 'Light',
    description: 'GitHub Light theme',
    backgroundColor: '#ffffff',
    textColor: '#24292e',
    codeBackgroundColor: '#f6f8fa',
    borderColor: '#e1e4e8',
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'GitHub Dark theme',
    backgroundColor: '#0d1117',
    textColor: '#c9d1d9',
    codeBackgroundColor: '#161b22',
    borderColor: '#30363d',
  },
  dimmed: {
    id: 'dimmed',
    name: 'Dimmed',
    description: 'GitHub Dimmed theme',
    backgroundColor: '#1c2128',
    textColor: '#c9d1d9',
    codeBackgroundColor: '#161b22',
    borderColor: '#30363d',
  },
  auto: {
    id: 'auto',
    name: 'Auto',
    description: 'Match system preference',
    backgroundColor: '#ffffff',
    textColor: '#24292e',
    codeBackgroundColor: '#f6f8fa',
    borderColor: '#e1e4e8',
  },
};
