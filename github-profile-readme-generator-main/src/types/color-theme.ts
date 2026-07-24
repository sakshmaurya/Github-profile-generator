export type ColorThemeType = 'default' | 'cyberpunk' | 'minimal' | 'vibrant' | 'ocean' | 'sunset' | 'forest';

export interface ColorTheme {
  id: ColorThemeType;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  badgeColors: {
    label: string;
    message: string;
    logo: string;
  };
}

export const colorThemes: Record<ColorThemeType, ColorTheme> = {
  default: {
    id: 'default',
    name: 'Default',
    description: 'Classic GitHub style',
    colors: {
      primary: '#0366d6',
      secondary: '#58a6ff',
      accent: '#2f81f7',
      background: '#ffffff',
      text: '#24292e',
      border: '#e1e4e8',
    },
    badgeColors: {
      label: '#555555',
      message: '#007ec6',
      logo: '#ffffff',
    },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon futuristic vibes',
    colors: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ff0080',
      background: '#0a0a0a',
      text: '#ffffff',
      border: '#ff00ff',
    },
    badgeColors: {
      label: '#2d2d2d',
      message: '#ff00ff',
      logo: '#00ffff',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple',
    colors: {
      primary: '#333333',
      secondary: '#666666',
      accent: '#999999',
      background: '#fafafa',
      text: '#1a1a1a',
      border: '#e0e0e0',
    },
    badgeColors: {
      label: '#888888',
      message: '#333333',
      logo: '#ffffff',
    },
  },
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold and colorful',
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      accent: '#ffe66d',
      background: '#f7fff7',
      text: '#2d3436',
      border: '#ff6b6b',
    },
    badgeColors: {
      label: '#ff6b6b',
      message: '#4ecdc4',
      logo: '#ffffff',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Calm blue tones',
    colors: {
      primary: '#0077b6',
      secondary: '#00b4d8',
      accent: '#90e0ef',
      background: '#caf0f8',
      text: '#03045e',
      border: '#0077b6',
    },
    badgeColors: {
      label: '#023e8a',
      message: '#0096c7',
      logo: '#ffffff',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange gradients',
    colors: {
      primary: '#ff7b00',
      secondary: '#ff8800',
      accent: '#ff9500',
      background: '#fff5eb',
      text: '#2d1b00',
      border: '#ff7b00',
    },
    badgeColors: {
      label: '#cc6200',
      message: '#ff7b00',
      logo: '#ffffff',
    },
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green tones',
    colors: {
      primary: '#2d6a4f',
      secondary: '#40916c',
      accent: '#52b788',
      background: '#d8f3dc',
      text: '#1b4332',
      border: '#2d6a4f',
    },
    badgeColors: {
      label: '#1b4332',
      message: '#40916c',
      logo: '#ffffff',
    },
  },
};
