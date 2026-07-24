'use client';

import { useState, memo, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { trackFileExported } from '@/lib/analytics';
import { PreviewThemeSelector } from '@/components/ui/preview-theme-selector';
import { GitHubPush } from '@/components/ui/github-push';
import type { PreviewThemeType } from '@/types/preview-theme';
import { previewThemes } from '@/types/preview-theme';
import type { TemplateType } from '@/types/template';
import { templates } from '@/types/template';
import type { ColorThemeType } from '@/types/color-theme';
import { colorThemes } from '@/types/color-theme';

interface MarkdownPreviewProps {
  markdown: string;
  title?: string;
  previewTheme?: PreviewThemeType;
  onPreviewThemeChange?: (theme: PreviewThemeType) => void;
  template?: TemplateType;
  colorTheme?: ColorThemeType;
}

export const MarkdownPreview = memo(function MarkdownPreview({
  markdown,
  title = 'Preview',
  previewTheme = 'auto',
  onPreviewThemeChange,
  template = 'professional',
  colorTheme = 'default',
}: MarkdownPreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview');
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = previewThemes[previewTheme];
  const currentTemplate = templates[template];
  const currentColorTheme = colorThemes[colorTheme];

  const markdownComponents = useMemo(
    () => ({
      p: ({ children }: any) => <p className="my-2">{children}</p>,
      h1: ({ children }: any) => <h1 className="mb-4 text-center text-xl font-bold">{children}</h1>,
      h3: ({ children }: any) => <h3 className="mb-2 text-lg font-semibold">{children}</h3>,
      img: ({ src, alt, width }: any) => {
        if (width === '40' || width === 40) {
          return (
            <img src={src} alt={alt} className="mr-4 mb-4 inline-block h-6 w-6 sm:h-10 sm:w-10" />
          );
        }
        return <img src={src} alt={alt} className="inline-block" />;
      },
      a: ({ href, children }: any) => (
        <a
          href={href}
          className="text-blue-600 no-underline hover:underline dark:text-blue-400"
          target="_blank"
          rel="noreferrer"
        >
          {children}
        </a>
      ),
    }),
    [] // Empty deps - components never change
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      trackFileExported('copy', 'markdown');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    trackFileExported('download', 'markdown');
  };

  if (!mounted) {
    return (
      <div className="space-y-4" role="region" aria-label="Markdown preview and export">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold" id="preview-title">
            {title}
          </h3>
        </div>
        <div className="border-border bg-card min-h-[400px] rounded-lg border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 rounded bg-muted"></div>
            <div className="h-4 rounded bg-muted"></div>
            <div className="h-4 rounded bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="region" aria-label="Markdown preview and export">
      {/* Header with actions - Aligned layout */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold" id="preview-title">
            {title}
          </h3>
          {/* Template & Color Theme Badges */}
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
              style={{
                backgroundColor: currentColorTheme.colors.background,
                color: currentColorTheme.colors.text,
                border: `1px solid ${currentColorTheme.colors.primary}`,
              }}
              title={`Template: ${currentTemplate.name}`}
            >
              {currentTemplate.icon} {currentTemplate.name}
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
              style={{
                backgroundColor: currentColorTheme.colors.background,
                color: currentColorTheme.colors.text,
                border: `1px solid ${currentColorTheme.colors.primary}`,
              }}
              title={`Color Theme: ${currentColorTheme.name}`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: currentColorTheme.colors.primary }}
              />
              {currentColorTheme.name}
            </span>
          </div>
        </div>
        <div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          role="toolbar"
          aria-label="Preview actions"
        >
          {onPreviewThemeChange && (
            <PreviewThemeSelector
              selectedTheme={previewTheme}
              onThemeChange={onPreviewThemeChange}
            />
          )}
          {/* View Mode Toggle - With border */}
          <div
            className="border-border inline-flex rounded-lg border"
            role="group"
            aria-label="View mode toggle"
          >
            <button
              onClick={() => setViewMode('preview')}
              className={`rounded-l-lg px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'preview' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
              aria-pressed={viewMode === 'preview'}
              aria-label="Show rendered preview"
            >
              Preview
            </button>
            <button
              onClick={() => setViewMode('markdown')}
              className={`border-border rounded-r-lg border-l px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'markdown' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
              aria-pressed={viewMode === 'markdown'}
              aria-label="Show raw markdown"
            >
              Markdown
            </button>
          </div>

          {/* Action buttons - Aligned to end */}
          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="border-border hover:bg-accent rounded-lg border p-2 transition-colors"
              aria-label="Copy markdown to clipboard"
              title="Copy markdown to clipboard"
            >
              {copied ? (
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg p-2 transition-colors"
              aria-label="Download README.md file"
              title="Download README.md file"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Push to GitHub */}
      <div className="flex justify-end">
        <GitHubPush content={markdown} />
      </div>

      {/* Content */}
      <div
        className="min-h-[400px] rounded-lg border p-6"
        style={{
          backgroundColor: currentTheme.backgroundColor,
          color: currentTheme.textColor,
          borderColor: currentTheme.borderColor,
        }}
      >
        {/* Copy success announcement for screen readers */}
        {copied && (
          <div className="sr-only" role="status" aria-live="polite">
            Markdown copied to clipboard successfully
          </div>
        )}

        {viewMode === 'preview' ? (
          <div className="markdown-preview" role="document" aria-labelledby="preview-title">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={markdownComponents}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <pre
            className="overflow-x-auto text-sm break-words whitespace-pre-wrap"
            style={{
              backgroundColor: currentTheme.codeBackgroundColor,
              color: currentTheme.textColor,
            }}
          >
            {markdown}
          </pre>
        )}
      </div>
    </div>
  );
});
