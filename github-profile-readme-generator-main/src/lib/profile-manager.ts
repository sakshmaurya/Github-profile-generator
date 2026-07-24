import { ProfileFormData, LinksFormData, SocialFormData } from './validations';
import type { CustomSkill } from '@/types/skills';
import type { TemplateType } from '@/types/template';
import type { ProficiencyLevel } from '@/types/skills';
import type { SectionType } from '@/types/section-order';
import type { ColorThemeType } from '@/types/color-theme';

export interface SavedProfile {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  data: {
    profile: ProfileFormData;
    links: LinksFormData;
    social: SocialFormData;
    skills: Record<string, boolean>;
    customSkills: Record<string, CustomSkill>;
    template: TemplateType;
    skillProficiency: Record<string, ProficiencyLevel>;
    sectionOrder: SectionType[];
    colorTheme: ColorThemeType;
  };
}

const PROFILES_KEY = 'github-profile-generator-profiles';

export function getSavedProfiles(): SavedProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(PROFILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveProfile(profile: SavedProfile): void {
  const profiles = getSavedProfiles();
  const existingIndex = profiles.findIndex((p) => p.id === profile.id);
  
  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }
  
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function deleteProfile(id: string): void {
  const profiles = getSavedProfiles().filter((p) => p.id !== id);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function loadProfile(id: string): SavedProfile | null {
  return getSavedProfiles().find((p) => p.id === id) || null;
}

export function createProfile(
  name: string,
  data: SavedProfile['data']
): SavedProfile {
  return {
    id: `profile-${Date.now()}`,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data,
  };
}
