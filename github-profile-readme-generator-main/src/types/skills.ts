export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface CategorizedSkills {
  [key: string]: SkillCategory;
}

export interface SkillIcons {
  [key: string]: string;
}

export interface SkillWebsites {
  [key: string]: string;
}

export type SkillState = Record<string, boolean>;

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'expert';

export interface CustomSkill {
  name: string;
  iconUrl?: string;
  category?: string;
  proficiency?: ProficiencyLevel;
}

export type CustomSkills = Record<string, CustomSkill>;

export type SkillProficiency = Record<string, ProficiencyLevel>;
