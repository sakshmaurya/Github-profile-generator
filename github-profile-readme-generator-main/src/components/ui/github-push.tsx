'use client';

import { useState } from 'react';
import { Github, Loader2, Check, AlertCircle, ExternalLink } from 'lucide-react';

interface GitHubPushProps {
  content: string;
  defaultUsername?: string;
}

export function GitHubPush({ content, defaultUsername = '' }: GitHubPushProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ message: string; url?: string } | null>(null);
  
  const [formData, setFormData] = useState({
    token: '',
    owner: defaultUsername,
    repo: '',
    filename: 'README.md',
    message: 'Update README.md via Profile Generator',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(null);

    try {
      const response = await fetch('/api/push-to-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: formData.token,
          owner: formData.owner,
          repo: formData.repo,
          content,
          filename: formData.filename,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to push to GitHub');
      }

      setSuccess({
        message: data.message,
        url: data.url,
      });
      
      // Clear token for security
      setFormData(prev => ({ ...prev, token: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
      >
        <Github className="h-4 w-4" />
        Push to GitHub
      </button>
    );
  }

  return (
    <div className="border-border bg-card rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-semibold">Push to GitHub Repository</h4>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>

      {success ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            <span>{success.message}</span>
          </div>
          {success.url && (
            <a
              href={success.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              View on GitHub
            </a>
          )}
          <button
            onClick={() => {
              setSuccess(null);
              setIsOpen(false);
            }}
            className="w-full rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">
              GitHub Personal Access Token
              <a
                href="https://github.com/settings/tokens/new"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-xs text-blue-600 hover:underline"
              >
                (Get Token)
              </a>
            </label>
            <input
              type="password"
              value={formData.token}
              onChange={(e) => setFormData({ ...formData, token: e.target.value })}
              placeholder="ghp_xxxxxxxxxxxx"
              className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm"
              required
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Token needs &apos;repo&apos; scope for private repos or &apos;public_repo&apos; for public repos
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Repository Owner</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="username"
                className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Repository Name</label>
              <input
                type="text"
                value={formData.repo}
                onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                placeholder="my-repo"
                className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Filename</label>
            <input
              type="text"
              value={formData.filename}
              onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
              placeholder="README.md"
              className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Commit Message</label>
            <input
              type="text"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Update README.md"
              className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Pushing...
                </>
              ) : (
                <>
                  <Github className="h-4 w-4" />
                  Push
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
