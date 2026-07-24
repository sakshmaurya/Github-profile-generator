'use client';

import { useState, useMemo } from 'react';
import { Download, Copy, RefreshCw } from 'lucide-react';

interface QRCodeGeneratorProps {
  githubUsername?: string;
}

export function QRCodeGenerator({ githubUsername }: QRCodeGeneratorProps) {
  const [qrSize, setQrSize] = useState(150);
  const [copied, setCopied] = useState(false);

  const qrCodeUrl = useMemo(() => {
    if (!githubUsername) return '';
    const githubUrl = `https://github.com/${githubUsername}`;
    // Using a free QR code API
    return `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(githubUrl)}`;
  }, [githubUsername, qrSize]);

  const handleCopyImage = async () => {
    if (!qrCodeUrl) return;
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy QR code:', err);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `github-qr-${githubUsername}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getMarkdownCode = () => {
    if (!githubUsername) return '';
    const githubUrl = `https://github.com/${githubUsername}`;
    return `<a href="${githubUrl}"><img src="${qrCodeUrl}" alt="GitHub Profile QR Code" width="${qrSize}" /></a>`;
  };

  const handleCopyMarkdown = async () => {
    const markdown = getMarkdownCode();
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  if (!githubUsername) {
    return (
      <div className="border-border bg-muted/50 rounded-lg border p-6 text-center">
        <p className="text-muted-foreground text-sm">
          Enter your GitHub username to generate a QR code
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">QR Code Generator</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm">Size:</label>
          <select
            value={qrSize}
            onChange={(e) => setQrSize(Number(e.target.value))}
            className="border-border bg-background rounded border px-2 py-1 text-sm"
          >
            <option value={100}>100px</option>
            <option value={150}>150px</option>
            <option value={200}>200px</option>
            <option value={300}>300px</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-lg border p-6">
        <div className="relative">
          <img
            src={qrCodeUrl}
            alt="GitHub Profile QR Code"
            width={qrSize}
            height={qrSize}
            className="rounded-lg border"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={handleCopyImage}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-accent"
            title="Copy QR code image"
          >
            <Copy className="h-4 w-4" />
            Copy Image
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-accent"
            title="Download QR code"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-accent"
            title="Copy markdown code"
          >
            <Copy className="h-4 w-4" />
            Copy Markdown
          </button>
        </div>

        {copied && (
          <p className="text-green-600 text-sm">Copied to clipboard!</p>
        )}

        <div className="w-full">
          <p className="mb-2 text-sm font-medium">Markdown Code:</p>
          <pre className="border-border bg-muted max-h-32 overflow-auto rounded border p-3 text-xs">
            {getMarkdownCode()}
          </pre>
        </div>
      </div>

      <p className="text-muted-foreground text-xs">
        Add this QR code to your README to let others quickly scan and visit your GitHub profile.
      </p>
    </div>
  );
}
