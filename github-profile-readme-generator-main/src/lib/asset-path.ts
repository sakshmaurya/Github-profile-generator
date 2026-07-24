/**
 * Get the correct asset path with basePath for GitHub Pages
 * Uses NEXT_PUBLIC_BASE_PATH environment variable if set
 */

export function getAssetPath(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return `${basePath}${normalizedPath}`;
}
