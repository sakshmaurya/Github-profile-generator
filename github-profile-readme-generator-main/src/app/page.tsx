'use client';

import { useState, useEffect, useMemo, lazy, Suspense, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { profileSchema, linksSchema, socialSchema } from '@/lib/validations';
import { DEFAULT_DATA, DEFAULT_LINK, DEFAULT_SOCIAL } from '@/constants/defaults';
import { initialSkillState } from '@/constants/skills';
import { BasicInfoSection } from '@/components/sections/basic-info-section';
import { LinksSection } from '@/components/sections/links-section';
import { SocialSection } from '@/components/sections/social-section';
import { generateMarkdown } from '@/lib/markdown-generator';
import { saveFormData, loadFormData, clearFormData } from '@/lib/storage';
import type { ProfileFormData, LinksFormData, SocialFormData } from '@/lib/validations';
import { DEFAULT_SUPPORT } from '@/constants/defaults';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useErrorToast, useSuccessToast } from '@/components/ui/toast';
import { trackReadmeGenerated, trackFileExported } from '@/lib/analytics';
import { useConfirmDialog } from '@/components/ui/confirm-dialog';
import type { CustomSkill } from '@/types/skills';
import type { TemplateType } from '@/types/template';
import type { ProficiencyLevel } from '@/types/skills';
import type { SectionType } from '@/types/section-order';
import type { ColorThemeType } from '@/types/color-theme';
import type { PreviewThemeType } from '@/types/preview-theme';
import { defaultSectionOrder } from '@/types/section-order';

// Lazy load heavy components
const SkillsSection = lazy(() =>
  import('@/components/sections/skills-section').then((module) => ({
    default: module.SkillsSection,
  }))
);
const MarkdownPreview = lazy(() =>
  import('@/components/ui/markdown-preview').then((module) => ({ default: module.MarkdownPreview }))
);

type Step = 'basic' | 'links' | 'social' | 'skills' | 'preview';

const steps: { id: Step; title: string; description: string }[] = [
  { id: 'basic', title: 'Basic Info', description: 'Tell us about yourself' },
  { id: 'links', title: 'Links', description: 'Portfolio, blog, resume' },
  { id: 'social', title: 'Social', description: 'Social media profiles' },
  { id: 'skills', title: 'Skills', description: 'Technologies you know' },
  { id: 'preview', title: 'Preview', description: 'Review and generate' },
];

export default function GeneratorPage() {
  const showError = useErrorToast();
  const showSuccess = useSuccessToast();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();
  const savedData = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const data = loadFormData();
    console.log('🎯 Initial load - Saved data:', data);
    return data;
  }, []);

  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [skills, setSkills] = useState(() => {
    const initialSkills = savedData?.skills || initialSkillState;
    console.log(
      '🎯 Initial skills state:',
      Object.values(initialSkills).filter(Boolean).length,
      'selected'
    );
    return initialSkills;
  });
  const [customSkills, setCustomSkills] = useState<Record<string, CustomSkill>>(() => {
    return savedData?.customSkills || {};
  });
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(() => {
    return savedData?.template || 'professional';
  });
  const [skillProficiency, setSkillProficiency] = useState<Record<string, ProficiencyLevel>>(() => {
    return savedData?.skillProficiency || {};
  });
  const [sectionOrder, setSectionOrder] = useState<SectionType[]>(() => {
    return savedData?.sectionOrder || defaultSectionOrder;
  });
  const [colorTheme, setColorTheme] = useState<ColorThemeType>(() => {
    return savedData?.colorTheme || 'default';
  });
  const [previewTheme, setPreviewTheme] = useState<PreviewThemeType>(() => {
    return 'auto';
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(() => {
    if (savedData?.lastSaved) {
      return new Date(savedData.lastSaved);
    }
    return null;
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [hasInitialized, setHasInitialized] = useState(false);

  const {
    register: registerProfile,
    formState: { errors: profileErrors },
    watch: watchProfile,
    reset: resetProfile,
    trigger: triggerProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: savedData?.profile ? { ...DEFAULT_DATA, ...savedData.profile } : DEFAULT_DATA,
    mode: 'onChange',
  });

  const {
    register: registerLinks,
    formState: { errors: linksErrors },
    watch: watchLinks,
    reset: resetLinks,
    trigger: triggerLinks,
  } = useForm<LinksFormData>({
    resolver: zodResolver(linksSchema),
    defaultValues: savedData?.links ? { ...DEFAULT_LINK, ...savedData.links } : DEFAULT_LINK,
    mode: 'onChange',
  });

  const {
    register: registerSocial,
    formState: { errors: socialErrors },
    watch: watchSocial,
    reset: resetSocial,
    trigger: triggerSocial,
  } = useForm<SocialFormData>({
    resolver: zodResolver(socialSchema),
    defaultValues: savedData?.social ? { ...DEFAULT_SOCIAL, ...savedData.social } : DEFAULT_SOCIAL,
    mode: 'onChange',
  });

  // Watch all form values for live preview
  const profileData = watchProfile();
  const linksData = watchLinks();
  const socialData = watchSocial();

  // Generate markdown with useMemo to prevent unnecessary recalculations
  const markdown = useMemo(() => {
    return generateMarkdown({
      profile: profileData,
      links: linksData,
      social: socialData,
      support: DEFAULT_SUPPORT,
      skills,
      customSkills,
      template: selectedTemplate,
      skillProficiency,
      sectionOrder,
      colorTheme,
    });
  }, [profileData, linksData, socialData, skills, customSkills, selectedTemplate, skillProficiency, sectionOrder, colorTheme]);

  useEffect(() => {
    console.log('🔍 Mount - Data already loaded in initialization');
    if (savedData) {
      console.log('✅ Mount - Restored from localStorage automatically');
    } else {
      console.log('🆕 Mount - Starting fresh (no saved data)');
    }

    const timer = setTimeout(() => {
      console.log('🎬 Initialization complete - Auto-save now enabled');
      setHasInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [savedData]);

  useEffect(() => {
    if (!hasInitialized) {
      console.log('⏭️ Auto-save - Waiting for initialization to complete');
      return;
    }

    console.log('💾 Auto-save - Starting...');
    console.log('📊 Auto-save - Profile data:', profileData);
    console.log('📊 Auto-save - Links data:', linksData);
    console.log('📊 Auto-save - Social data:', socialData);
    console.log('📊 Auto-save - Skills selected:', Object.values(skills).filter(Boolean).length);

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      const now = new Date();
      const dataToSave = {
        profile: profileData,
        links: linksData,
        social: socialData,
        support: DEFAULT_SUPPORT,
        skills,
        customSkills,
        template: selectedTemplate,
        skillProficiency,
        sectionOrder,
        colorTheme,
        lastSaved: now.toISOString(),
      };

      console.log('💾 Auto-save - Saving to localStorage:', dataToSave);
      saveFormData(dataToSave);

      const savedDataCheck = localStorage.getItem('github-profile-generator');
      console.log('✅ Auto-save - Verified in localStorage:', savedDataCheck ? 'YES' : 'NO');
      console.log('📏 Auto-save - Data size:', savedDataCheck?.length || 0, 'bytes');

      setLastSaved(now);
      setSaveStatus('saved');

      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasInitialized,
    JSON.stringify(profileData),
    JSON.stringify(linksData),
    JSON.stringify(socialData),
    JSON.stringify(skills),
    JSON.stringify(customSkills),
    selectedTemplate,
    JSON.stringify(skillProficiency),
    JSON.stringify(sectionOrder),
    colorTheme,
  ]);

  const handleSkillChange = (skill: string, checked: boolean) => {
    setSkills((prev) => ({ ...prev, [skill]: checked }));
  };

  const handleCustomSkillAdd = (skill: CustomSkill) => {
    setCustomSkills((prev) => ({ ...prev, [skill.name]: skill }));
  };

  const handleCustomSkillRemove = (skillName: string) => {
    setCustomSkills((prev) => {
      const newSkills = { ...prev };
      delete newSkills[skillName];
      return newSkills;
    });
  };

  const handleProficiencyChange = (skill: string, level: ProficiencyLevel) => {
    setSkillProficiency((prev) => ({ ...prev, [skill]: level }));
  };

  const handleLoadProfile = (data: any) => {
    resetProfile(data.profile);
    resetLinks(data.links);
    resetSocial(data.social);
    setSkills(data.skills);
    setCustomSkills(data.customSkills);
    setSelectedTemplate(data.template);
    setSkillProficiency(data.skillProficiency);
    setSectionOrder(data.sectionOrder || defaultSectionOrder);
    setColorTheme(data.colorTheme || 'default');
  };

  const handleGitHubAutoFill = (data: {
    profile: Partial<ProfileFormData>;
    links: Partial<LinksFormData>;
    social: Partial<SocialFormData>;
    skills: string[];
  }) => {
    if (data.profile.title) {
      resetProfile((prev) => ({ ...prev, ...data.profile }));
    }

    if (data.links.blog) {
      resetLinks((prev) => ({ ...prev, ...data.links }));
    }

    if (data.social.github || data.social.twitter) {
      resetSocial((prev) => ({ ...prev, ...data.social }));
    }

    if (data.skills.length > 0) {
      const newSkills = { ...skills };
      data.skills.forEach((skill) => {
        if (skill in newSkills) {
          newSkills[skill] = true;
        }
      });
      setSkills(newSkills);
    }
  };

  const hasAnyData = useMemo(() => {
    const hasProfileData = Object.entries(profileData).some(([key, value]) => {
      if (key === 'subtitle' && value === '') return false;
      return typeof value === 'string' ? value.trim() !== '' : value !== false && value !== null;
    });

    const hasLinksData = Object.values(linksData).some((value) => value && value.trim() !== '');

    const hasSocialData = Object.values(socialData).some((value) =>
      typeof value === 'string' ? value.trim() !== '' : value === true
    );

    const hasSkillsData = Object.values(skills).some((selected) => selected === true);

    return hasProfileData || hasLinksData || hasSocialData || hasSkillsData;
  }, [profileData, linksData, socialData, skills]);

  const handleClearAll = useCallback(() => {
    showConfirm({
      title: 'Clear All Data',
      message:
        'Are you sure you want to clear all data? This will reset all form fields, skills, and settings. This action cannot be undone.',
      confirmText: 'Clear All',
      cancelText: 'Cancel',
      variant: 'warning',
      onConfirm: () => {
        clearFormData();
        resetProfile(DEFAULT_DATA);
        resetLinks(DEFAULT_LINK);
        resetSocial(DEFAULT_SOCIAL);
        setSkills(initialSkillState);
        setCustomSkills({});
        setSkillProficiency({});
        setSectionOrder(defaultSectionOrder);
        setColorTheme('default');
        setLastSaved(null);
        setSaveStatus('idle');
        showSuccess('All data cleared successfully', 'Form has been reset to default values');
      },
    });
  }, [showConfirm, resetProfile, resetLinks, resetSocial, setSkills, setCustomSkills, setSkillProficiency, setSectionOrder, setColorTheme, showSuccess]);

  const handleDownloadJSON = () => {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile: profileData,
      links: linksData,
      social: socialData,
      support: DEFAULT_SUPPORT,
      skills: Object.entries(skills)
        .filter(([_, selected]) => selected)
        .map(([skill]) => skill),
      customSkills,
      skillProficiency,
      sectionOrder,
      colorTheme,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `github-profile-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();

    trackFileExported('json_export', 'json');
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);

        if (imported.profile) {
          resetProfile({ ...DEFAULT_DATA, ...imported.profile } as ProfileFormData);
        }
        if (imported.links) {
          resetLinks({ ...DEFAULT_LINK, ...imported.links } as LinksFormData);
        }
        if (imported.social) {
          resetSocial({ ...DEFAULT_SOCIAL, ...imported.social } as SocialFormData);
        }
        if (imported.skills && Array.isArray(imported.skills)) {
          const newSkills = { ...initialSkillState };
          imported.skills.forEach((skill: string) => {
            if (skill in newSkills) {
              newSkills[skill] = true;
            }
          });
          setSkills(newSkills);
        }

        alert('Profile data imported successfully!');
      } catch (error) {
        alert('Error importing JSON: ' + (error as Error).message);
      }
    };
    reader.readAsText(file);

    event.target.value = '';
  };

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const validateCurrentStep = async (): Promise<boolean> => {
    let isValid = true;
    const errorMessages: string[] = [];

    switch (currentStep) {
      case 'basic':
        const profileValid = await triggerProfile();
        if (!profileValid) {
          isValid = false;
          if (profileErrors.title) {
            errorMessages.push(`Name: ${profileErrors.title.message}`);
          }
          Object.entries(profileErrors).forEach(([field, error]) => {
            if (field !== 'title' && error?.message) {
              errorMessages.push(`${field}: ${error.message}`);
            }
          });
        }
        break;

      case 'links':
        const linksValid = await triggerLinks();
        if (!linksValid) {
          isValid = false;
          Object.entries(linksErrors).forEach(([field, error]) => {
            if (error?.message) {
              errorMessages.push(`${field}: ${error.message}`);
            }
          });
        }
        break;

      case 'social':
        const socialValid = await triggerSocial();
        if (!socialValid) {
          isValid = false;
          Object.entries(socialErrors).forEach(([field, error]) => {
            if (error?.message) {
              errorMessages.push(`${field}: ${error.message}`);
            }
          });
        }
        break;

      case 'skills':
        // Skills don't have validation requirements
        break;

      case 'preview':
        // Preview doesn't need validation
        break;
    }

    if (!isValid) {
      const stepName = steps.find((s) => s.id === currentStep)?.title || 'current step';
      showError(
        `Please fix errors in ${stepName}`,
        errorMessages.length > 0 ? errorMessages.join(', ') : 'Please check all required fields'
      );
    }

    return isValid;
  };

  const goToNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      return;
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);

      const currentStepName = steps[currentStepIndex].title;
      showSuccess(`${currentStepName} completed!`, 'Moving to next step');

      if (steps[nextIndex].id === 'preview') {
        const socialData = watchSocial();
        const linksData = watchLinks();
        const selectedSkillsCount = Object.values(skills).filter(Boolean).length;

        trackReadmeGenerated({
          hasSkills: selectedSkillsCount > 0,
          hasSocial: Object.values(socialData).some(
            (value) => typeof value === 'string' && value.trim() !== ''
          ),
          hasLinks: Object.values(linksData).some(
            (value) => typeof value === 'string' && value.trim() !== ''
          ),
          stepCount: currentStepIndex + 1,
        });
      }
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with Save Status */}
      <Header saveStatus={saveStatus} lastSaved={lastSaved} />

      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Progress Steps - Responsive */}
          <nav aria-label="Form progress" className="mb-8">
            <div className="flex items-center justify-center overflow-x-auto px-4">
              <div className="flex min-w-max items-center">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`flex flex-col items-center gap-1 px-2 py-1 ${
                        currentStep === step.id
                          ? 'text-primary'
                          : index < currentStepIndex
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                      }`}
                      aria-label={`Step ${index + 1}: ${step.title}`}
                      aria-current={currentStep === step.id ? 'step' : undefined}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors sm:h-10 sm:w-10 ${
                          currentStep === step.id
                            ? 'border-primary bg-primary text-primary-foreground'
                            : index < currentStepIndex
                              ? 'border-primary bg-primary/20'
                              : 'border-border'
                        }`}
                      >
                        <span className="text-xs font-medium sm:text-sm">{index + 1}</span>
                      </div>
                      <div className="hidden text-center sm:block">
                        <p className="text-xs font-medium whitespace-nowrap">{step.title}</p>
                        <p className="text-muted-foreground text-xs whitespace-nowrap">
                          {step.description}
                        </p>
                      </div>
                    </button>
                    {index < steps.length - 1 && (
                      <div
                        className={`mx-2 h-0.5 w-8 sm:mx-4 sm:w-12 ${
                          index < currentStepIndex ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Screen reader announcement for step changes */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              Current step: {steps[currentStepIndex].title} - {steps[currentStepIndex].description}
            </div>
          </nav>

          {/* Form Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="border-border bg-card rounded-lg border p-6 shadow-sm md:p-8"
          >
            {currentStep === 'basic' && (
              <BasicInfoSection
                register={registerProfile}
                errors={profileErrors}
                socialRegister={registerSocial}
                watchSocial={watchSocial}
                onGitHubAutoFill={handleGitHubAutoFill}
                onImportJSON={handleImportJSON}
                onClearAll={handleClearAll}
                hasClearableData={hasAnyData}
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
                currentData={{
                  profile: profileData,
                  links: linksData,
                  social: socialData,
                  skills,
                  customSkills,
                  template: selectedTemplate,
                  skillProficiency,
                  sectionOrder,
                  colorTheme,
                }}
                onLoadProfile={handleLoadProfile}
                sectionOrder={sectionOrder}
                onSectionOrderChange={setSectionOrder}
                colorTheme={colorTheme}
                onColorThemeChange={setColorTheme}
              />
            )}
            {currentStep === 'links' && (
              <LinksSection register={registerLinks} errors={linksErrors} />
            )}
            {currentStep === 'social' && (
              <SocialSection register={registerSocial} errors={socialErrors} watch={watchSocial} />
            )}
            {currentStep === 'skills' && (
              <Suspense
                fallback={
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 rounded bg-gray-200"></div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="h-12 rounded bg-gray-200"></div>
                      ))}
                    </div>
                  </div>
                }
              >
                <SkillsSection
                  selectedSkills={skills}
                  onSkillChange={handleSkillChange}
                  registerProfile={registerProfile}
                  customSkills={customSkills}
                  onCustomSkillAdd={handleCustomSkillAdd}
                  onCustomSkillRemove={handleCustomSkillRemove}
                  skillProficiency={skillProficiency}
                  onProficiencyChange={handleProficiencyChange}
                />
              </Suspense>
            )}
            {currentStep === 'preview' && (
              <div className="space-y-6">
                <div className="border-border border-b pb-4">
                  {/* Mobile: Stack vertically, Desktop: Side by side */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold sm:text-2xl">Preview & Generate</h2>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Your README is ready! Copy or download it below.
                      </p>
                    </div>
                    {/* Export Button - With text */}
                    <button
                      onClick={handleDownloadJSON}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                      title="Export profile data as JSON"
                      aria-label="Export profile data as JSON"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                <Suspense
                  fallback={
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 rounded bg-gray-200"></div>
                      <div className="h-96 rounded bg-gray-200"></div>
                    </div>
                  }
                >
                  <MarkdownPreview
                    markdown={markdown}
                    title="Your GitHub Profile README"
                    previewTheme={previewTheme}
                    onPreviewThemeChange={setPreviewTheme}
                    template={selectedTemplate}
                    colorTheme={colorTheme}
                  />
                </Suspense>
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <nav className="mt-6 flex justify-between" aria-label="Form navigation">
            <button
              onClick={goToPrevStep}
              disabled={currentStepIndex === 0}
              className="border-border hover:bg-accent rounded-lg border px-6 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Go to previous step${currentStepIndex > 0 ? `: ${steps[currentStepIndex - 1].title}` : ''}`}
            >
              Previous
            </button>
            {/* Hide Next button at preview step since we're already at the end */}
            {currentStepIndex < steps.length - 1 && (
              <button
                onClick={goToNextStep}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2 font-medium transition-colors"
                aria-label={`Go to next step: ${steps[currentStepIndex + 1].title}`}
              >
                Next
              </button>
            )}
          </nav>
        </div>
      </main>
      <Footer />

      {/* Confirmation Dialog */}
      <ConfirmDialog />
    </div>
  );
}
