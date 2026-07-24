'use client';

import { useState, useEffect } from 'react';
import { templates, type TemplateType } from '@/types/template';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Choose Template</h3>
          <p className="text-muted-foreground text-sm">Select a template to customize your profile style</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.values(templates).map((template) => (
            <div
              key={template.id}
              className="relative rounded-lg border-2 border-border p-4"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{template.icon}</div>
                <h4 className="font-semibold">{template.name}</h4>
                <p className="text-muted-foreground mt-1 text-xs">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Choose Template</h3>
        <p className="text-muted-foreground text-sm">Select a template to customize your profile style</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.values(templates).map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onTemplateChange(template.id)}
            className={`relative rounded-lg border-2 p-4 transition-all hover:scale-105 ${
              selectedTemplate === template.id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{template.icon}</div>
              <h4 className="font-semibold">{template.name}</h4>
              <p className="text-muted-foreground mt-1 text-xs">{template.description}</p>
            </div>
            {selectedTemplate === template.id && (
              <div className="bg-primary absolute top-2 right-2 h-3 w-3 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
