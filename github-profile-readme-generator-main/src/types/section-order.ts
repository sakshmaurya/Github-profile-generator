export type SectionType = 
  | 'title'
  | 'badges'
  | 'about'
  | 'links'
  | 'social'
  | 'skills'
  | 'support'
  | 'stats';

export interface SectionOrder {
  sections: SectionType[];
}

export const defaultSectionOrder: SectionType[] = [
  'title',
  'badges',
  'about',
  'links',
  'social',
  'skills',
  'support',
  'stats',
];

export const sectionLabels: Record<SectionType, string> = {
  title: 'Title & Subtitle',
  badges: 'Badges (Visitor, Trophy, Twitter)',
  about: 'About Sections',
  links: 'Links (Portfolio, Blog, Resume)',
  social: 'Social Links',
  skills: 'Skills',
  support: 'Support',
  stats: 'GitHub Stats',
};
