export type TemplateType = 'minimal' | 'professional' | 'creative';

export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  icon: string;
  sections: {
    showTitle: boolean;
    showSubtitle: boolean;
    showVisitorBadge: boolean;
    showGitHubTrophy: boolean;
    showTwitterBadge: boolean;
    showAboutSections: boolean;
    showLinks: boolean;
    showSocial: boolean;
    showSkills: boolean;
    showSupport: boolean;
    showGitHubStats: boolean;
    showStreakStats: boolean;
  };
  styling: {
    emojiStyle: 'minimal' | 'standard' | 'colorful';
    sectionAlignment: 'left' | 'center';
    showSeparators: boolean;
  };
}

export const templates: Record<TemplateType, Template> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design with essential elements only',
    icon: '🎯',
    sections: {
      showTitle: true,
      showSubtitle: true,
      showVisitorBadge: false,
      showGitHubTrophy: false,
      showTwitterBadge: false,
      showAboutSections: true,
      showLinks: true,
      showSocial: true,
      showSkills: true,
      showSupport: false,
      showGitHubStats: false,
      showStreakStats: false,
    },
    styling: {
      emojiStyle: 'minimal',
      sectionAlignment: 'left',
      showSeparators: false,
    },
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Complete profile with all sections and stats',
    icon: '💼',
    sections: {
      showTitle: true,
      showSubtitle: true,
      showVisitorBadge: true,
      showGitHubTrophy: true,
      showTwitterBadge: true,
      showAboutSections: true,
      showLinks: true,
      showSocial: true,
      showSkills: true,
      showSupport: true,
      showGitHubStats: true,
      showStreakStats: true,
    },
    styling: {
      emojiStyle: 'standard',
      sectionAlignment: 'left',
      showSeparators: true,
    },
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Colorful and expressive with fun elements',
    icon: '🎨',
    sections: {
      showTitle: true,
      showSubtitle: true,
      showVisitorBadge: true,
      showGitHubTrophy: true,
      showTwitterBadge: true,
      showAboutSections: true,
      showLinks: true,
      showSocial: true,
      showSkills: true,
      showSupport: true,
      showGitHubStats: true,
      showStreakStats: true,
    },
    styling: {
      emojiStyle: 'colorful',
      sectionAlignment: 'center',
      showSeparators: true,
    },
  },
};
