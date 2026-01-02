/**
 * Shared URL Utilities
 * Reusable URL processing functions
 * Used by both React and CLI implementations
 */

/**
 * Check if URL is external (starts with http:// or https://)
 * Used by: link, link-card
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Determine if link should open in new tab
 * Used by: link, link-card
 */
export function shouldOpenInNewTab(url: string, openInNewTab?: boolean): boolean {
  if (openInNewTab !== undefined) {
    return openInNewTab;
  }
  return isExternalUrl(url);
}

/**
 * Extract domain from URL
 * Used by: link-card
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
