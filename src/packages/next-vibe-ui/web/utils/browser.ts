/**
 * Platform-agnostic browser utilities (Web implementation)
 */

/**
 * Get current URL
 */
export function getCurrentUrl(): string {
  return window.location.href;
}

/**
 * Get referrer URL
 */
export function getReferrer(): string {
  return document.referrer;
}

/**
 * Get user agent
 */
export function getUserAgent(): string {
  return navigator.userAgent;
}

/**
 * Open URL (for mailto, tel, external links, etc.)
 */
export function openUrl(url: string): void {
  window.location.href = url;
}
