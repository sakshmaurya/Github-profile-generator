'use client';

import { ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import type { SectionType } from '@/types/section-order';
import { sectionLabels } from '@/types/section-order';

interface SectionOrderSelectorProps {
  sectionOrder: SectionType[];
  onSectionOrderChange: (order: SectionType[]) => void;
}

export function SectionOrderSelector({ sectionOrder, onSectionOrderChange }: SectionOrderSelectorProps) {
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionOrder];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newOrder.length) {
      [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
      onSectionOrderChange(newOrder);
    }
  };

  const resetToDefault = () => {
    const { defaultSectionOrder } = require('@/types/section-order');
    onSectionOrderChange([...defaultSectionOrder]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Section Order</h3>
        <button
          type="button"
          onClick={resetToDefault}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
          title="Reset to default order"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
      
      <div className="border-border bg-muted/30 rounded-lg border p-4 space-y-2">
        {sectionOrder.map((section, index) => (
          <div
            key={section}
            className="bg-card flex items-center justify-between rounded-lg border p-3"
          >
            <span className="text-sm font-medium">{sectionLabels[section]}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => moveSection(index, 'up')}
                disabled={index === 0}
                className="text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30 rounded p-1 transition-colors"
                title="Move up"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => moveSection(index, 'down')}
                disabled={index === sectionOrder.length - 1}
                className="text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30 rounded p-1 transition-colors"
                title="Move down"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-muted-foreground text-xs">
        Reorder sections to customize your README layout. Changes will be reflected in the generated markdown.
      </p>
    </div>
  );
}
