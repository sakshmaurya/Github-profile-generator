'use client';

import { useState, useEffect } from 'react';
import { Save, Trash2, FolderOpen, Plus } from 'lucide-react';
import { getSavedProfiles, saveProfile, deleteProfile, loadProfile, createProfile, type SavedProfile } from '@/lib/profile-manager';
import type { ProfileFormData, LinksFormData, SocialFormData } from '@/lib/validations';
import type { CustomSkill } from '@/types/skills';
import type { TemplateType } from '@/types/template';
import type { ProficiencyLevel } from '@/types/skills';
import type { SectionType } from '@/types/section-order';
import type { ColorThemeType } from '@/types/color-theme';

interface ProfileManagerProps {
  currentData: {
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
  onLoadProfile: (data: SavedProfile['data']) => void;
}

export function ProfileManager({ currentData, onLoadProfile }: ProfileManagerProps) {
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfiles(getSavedProfiles());
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Saved Profiles</h3>
          <button
            type="button"
            disabled
            className="bg-primary text-primary-foreground flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium opacity-50"
          >
            <Plus className="h-4 w-4" />
            Save Current
          </button>
        </div>
        <div className="border-border bg-muted/30 rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Loading profiles...</p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    if (!profileName.trim()) return;
    
    const newProfile = createProfile(profileName, currentData);
    saveProfile(newProfile);
    setProfiles(getSavedProfiles());
    setProfileName('');
    setShowSaveDialog(false);
  };

  const handleLoadProfile = (id: string) => {
    const profile = loadProfile(id);
    if (profile) {
      onLoadProfile(profile.data);
    }
  };

  const handleDeleteProfile = (id: string) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      deleteProfile(id);
      setProfiles(getSavedProfiles());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Saved Profiles</h3>
        <button
          type="button"
          onClick={() => setShowSaveDialog(!showSaveDialog)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Save Current
        </button>
      </div>

      {showSaveDialog && (
        <div className="border-border bg-muted/50 rounded-lg border p-4 space-y-3">
          <input
            type="text"
            placeholder="Profile name (e.g., My Professional Profile)"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={!profileName.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSaveDialog(false);
                setProfileName('');
              }}
              className="border-border hover:bg-accent rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {profiles.length === 0 ? (
        <p className="text-muted-foreground text-sm">No saved profiles yet. Save your current profile to get started.</p>
      ) : (
        <div className="space-y-2">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="border-border bg-card rounded-lg border p-3 flex items-center justify-between hover:border-primary/50 transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{profile.name}</div>
                <div className="text-muted-foreground text-xs">
                  Last updated: {new Date(profile.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadProfile(profile.id)}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors"
                  title="Load profile"
                >
                  <FolderOpen className="h-3 w-3" />
                  Load
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProfile(profile.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors"
                  title="Delete profile"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
