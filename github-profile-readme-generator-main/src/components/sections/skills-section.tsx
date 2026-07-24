'use client';

import { useState, useMemo, useEffect } from 'react';
import { Info, Plus, Trash2 } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';
import { FormCheckbox } from '@/components/forms/form-checkbox';
import { FormInput } from '@/components/forms/form-input';
import { Select } from '@/components/ui/select';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { categorizedSkills, categories } from '@/constants/skills';
import { getSkillIconUrl } from '@/lib/markdown-generator';
import type { ProfileFormData } from '@/lib/validations';
import type { CustomSkill, ProficiencyLevel } from '@/types/skills';

interface SkillsSectionProps {
  selectedSkills: Record<string, boolean>;
  onSkillChange: (skill: string, checked: boolean) => void;
  registerProfile: UseFormRegister<ProfileFormData>;
  customSkills?: Record<string, CustomSkill>;
  onCustomSkillAdd?: (skill: CustomSkill) => void;
  onCustomSkillRemove?: (skillName: string) => void;
  skillProficiency?: Record<string, ProficiencyLevel>;
  onProficiencyChange?: (skill: string, level: ProficiencyLevel) => void;
}

export function SkillsSection({
  selectedSkills,
  onSkillChange,
  registerProfile,
  customSkills = {},
  onCustomSkillAdd,
  onCustomSkillRemove,
  skillProficiency = {},
  onProficiencyChange,
}: SkillsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showCustomSkillForm, setShowCustomSkillForm] = useState(false);
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillIcon, setCustomSkillIcon] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState('other');
  const [showProficiencySelector, setShowProficiencySelector] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const selectedCount = useMemo(() => {
    return Object.values(selectedSkills).filter(Boolean).length;
  }, [selectedSkills]);

  const filteredCategories = useMemo(() => {
    if (selectedCategory !== 'all') {
      return [selectedCategory];
    }
    return categories;
  }, [selectedCategory]);

  const filterSkills = (skills: string[]) => {
    if (!searchQuery) return skills;
    return skills.filter((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((category) => ({
      value: category,
      label: categorizedSkills[category].title,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="border-border border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Skills & Technologies</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Select the skills you want to showcase ({selectedCount} selected)
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter - Stack on mobile */}
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
        <FormInput
          id="skill-search"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Select
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categoryOptions}
          placeholder="Select category"
        />
      </div>

      {/* Add Custom Skill Button */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowCustomSkillForm(!showCustomSkillForm)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Custom Skill
        </button>
        {selectedCount > 0 && (
          <button
            type="button"
            onClick={() => setShowProficiencySelector(!showProficiencySelector)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <span>📊</span>
            Set Proficiency
          </button>
        )}
      </div>

      {/* Custom Skill Form */}
      {showCustomSkillForm && (
        <div className="border-border bg-muted/50 rounded-lg border p-4 space-y-4">
          <h3 className="font-semibold">Add Custom Skill</h3>
          <div className="space-y-3">
            <div>
              <label className="text-muted-foreground mb-1 block text-sm">Skill Name *</label>
              <FormInput
                id="custom-skill-name"
                placeholder="e.g., My Custom Framework"
                value={customSkillName}
                onChange={(e) => setCustomSkillName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-sm">Icon URL (optional)</label>
              <FormInput
                id="custom-skill-icon"
                placeholder="e.g., https://example.com/icon.png"
                value={customSkillIcon}
                onChange={(e) => setCustomSkillIcon(e.target.value)}
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Leave empty to use a generic icon
              </p>
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-sm">Category</label>
              <Select
                value={customSkillCategory}
                onChange={setCustomSkillCategory}
                options={categoryOptions.filter(opt => opt.value !== 'all')}
                placeholder="Select category"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (customSkillName.trim()) {
                    const newSkill: CustomSkill = {
                      name: customSkillName.trim(),
                      iconUrl: customSkillIcon.trim() || undefined,
                      category: customSkillCategory,
                    };
                    onCustomSkillAdd?.(newSkill);
                    onSkillChange(customSkillName.trim(), true);
                    setCustomSkillName('');
                    setCustomSkillIcon('');
                    setShowCustomSkillForm(false);
                  }
                }}
                disabled={!customSkillName.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add Skill
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomSkillForm(false);
                  setCustomSkillName('');
                  setCustomSkillIcon('');
                }}
                className="border-border hover:bg-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Skills Display */}
      {Object.keys(customSkills).length > 0 && (
        <div className="border-border bg-muted/30 rounded-lg border p-4 space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <span>✨</span>
            <span>Custom Skills ({Object.keys(customSkills).length})</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Object.entries(customSkills).map(([skillName, skill]) => (
              <div
                key={skillName}
                className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-2 transition-all ${
                  selectedSkills[skillName]
                    ? 'border-primary bg-primary/10'
                    : 'border-border'
                }`}
              >
                <img
                  src={skill.iconUrl || 'https://via.placeholder.com/40'}
                  alt={skill.name}
                  className="h-8 w-8 object-contain"
                />
                <span className="text-center text-xs leading-tight">{skill.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    onCustomSkillRemove?.(skillName);
                    onSkillChange(skillName, false);
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute top-1 right-1 h-5 w-5 rounded-full p-0.5 transition-colors"
                  title="Remove custom skill"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onSkillChange(skillName, !selectedSkills[skillName])}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 absolute bottom-1 right-1 h-5 w-5 rounded-full p-0.5 transition-colors"
                  title={selectedSkills[skillName] ? 'Deselect' : 'Select'}
                >
                  {selectedSkills[skillName] ? '✓' : '+'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proficiency Selector */}
      {showProficiencySelector && (
        <div className="border-border bg-muted/50 rounded-lg border p-4 space-y-4">
          <h3 className="font-semibold">Set Skill Proficiency Levels</h3>
          <p className="text-muted-foreground text-sm">Mark your selected skills with proficiency levels</p>
          <div className="space-y-3">
            {Object.entries(selectedSkills)
              .filter(([_, selected]) => selected)
              .map(([skill]) => (
                <div key={skill} className="flex items-center justify-between gap-4">
                  <span className="text-sm capitalize">{skill.replace(/_/g, ' ')}</span>
                  <Select
                    value={skillProficiency[skill] || 'intermediate'}
                    onChange={(level) => onProficiencyChange?.(skill, level as ProficiencyLevel)}
                    options={[
                      { value: 'beginner', label: '🌱 Beginner' },
                      { value: 'intermediate', label: '🌿 Intermediate' },
                      { value: 'expert', label: '🌳 Expert' },
                    ]}
                    placeholder="Select level"
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Skills Grid - Responsive layout */}
      <div className="space-y-6">
        {filteredCategories.map((category) => {
          const { title, skills } = categorizedSkills[category];
          const filtered = filterSkills(skills);

          if (filtered.length === 0) return null;

          const skillsGrid = (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((skill) => {
                const iconUrl = getSkillIconUrl(skill);
                const isSelected = selectedSkills[skill] || false;

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => onSkillChange(skill, !isSelected)}
                    className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-2 transition-all hover:scale-105 sm:p-3 ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <img
                      src={iconUrl}
                      alt={skill}
                      className="h-8 w-8 object-contain sm:h-10 sm:w-10"
                      loading="eager"
                    />
                    <span className="text-center text-xs leading-tight capitalize">
                      {skill.replace(/_/g, ' ')}
                    </span>
                    {isSelected && (
                      <div className="bg-primary absolute top-1 right-1 h-2 w-2 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          );

          if (mounted && isMobile && selectedCategory === 'all') {
            return (
              <CollapsibleSection
                key={category}
                title={title}
                description={`${filtered.length} skills available`}
                icon="🛠️"
                defaultOpen={filtered.some((skill) => selectedSkills[skill])}
              >
                {skillsGrid}
              </CollapsibleSection>
            );
          }

          // Desktop layout or when a specific category is selected
          return (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              {skillsGrid}
            </div>
          );
        })}
      </div>

      {searchQuery &&
        filteredCategories.every(
          (cat) => filterSkills(categorizedSkills[cat].skills).length === 0
        ) && (
          <div className="text-muted-foreground py-8 text-center">
            <p>No skills found matching "{searchQuery}"</p>
          </div>
        )}

      {/* GitHub Stats & Badges - Mobile-friendly layout */}
      <div className="border-border mt-8 border-t pt-6">
        <div
          className={`space-y-4 rounded-lg p-4 transition-all sm:p-6 ${selectedCount > 0 ? 'bg-accent/50' : 'bg-muted/30'}`}
        >
          <div>
            <h4 className="mb-1 flex items-center gap-2 text-base font-semibold sm:text-lg">
              <span>📈</span>
              <span>GitHub Profile Enhancements</span>
            </h4>
            <p className="text-muted-foreground text-sm">
              Add visual statistics and achievements to your profile
            </p>
            {selectedCount === 0 && (
              <p className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
                <Info className="h-3 w-3" />
                Select at least one skill above to enable these enhancements
              </p>
            )}
          </div>

          {/* Mobile: Use collapsible section, Desktop: Show grid */}
          {isMobile ? (
            <CollapsibleSection
              title="Enhancement Options"
              description={`${selectedCount > 0 ? 'Available' : 'Disabled'} - Select skills first`}
              icon="⚙️"
              defaultOpen={selectedCount > 0}
            >
              <div
                className={`space-y-3 ${selectedCount === 0 ? 'pointer-events-none opacity-50' : ''}`}
              >
                <FormCheckbox
                  {...registerProfile('githubStats')}
                  id="githubStats"
                  label="GitHub Stats Card"
                  disabled={selectedCount === 0}
                />
                <FormCheckbox
                  {...registerProfile('topLanguages')}
                  id="topLanguages"
                  label="Top Languages Card"
                  disabled={selectedCount === 0}
                />
                <FormCheckbox
                  {...registerProfile('streakStats')}
                  id="streakStats"
                  label="GitHub Streak Stats"
                  disabled={selectedCount === 0}
                />
                <FormCheckbox
                  {...registerProfile('githubProfileTrophy')}
                  id="githubProfileTrophy"
                  label="GitHub Profile Trophy"
                  disabled={selectedCount === 0}
                />
              </div>
            </CollapsibleSection>
          ) : (
            <div
              className={`grid gap-3 sm:grid-cols-2 ${selectedCount === 0 ? 'pointer-events-none opacity-50' : ''}`}
            >
              <FormCheckbox
                {...registerProfile('githubStats')}
                id="githubStats"
                label="GitHub Stats Card"
                disabled={selectedCount === 0}
              />
              <FormCheckbox
                {...registerProfile('topLanguages')}
                id="topLanguages"
                label="Top Languages Card"
                disabled={selectedCount === 0}
              />
              <FormCheckbox
                {...registerProfile('streakStats')}
                id="streakStats"
                label="GitHub Streak Stats"
                disabled={selectedCount === 0}
              />
              <FormCheckbox
                {...registerProfile('githubProfileTrophy')}
                id="githubProfileTrophy"
                label="GitHub Profile Trophy"
                disabled={selectedCount === 0}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
