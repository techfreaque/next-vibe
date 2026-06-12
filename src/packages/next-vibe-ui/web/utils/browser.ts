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

/**
 * Open URL in a new tab/window
 */
export function openInNewTab(url: string): void {
  window.open(url, "_blank");
}

/**
 * Get viewport width in pixels (synchronous, non-hook)
 * Returns 0 during SSR.
 */
export function getScreenWidth(): number {
  return typeof window !== "undefined" ? window.innerWidth : 0;
}

/**
 * Push a URL to browser history without triggering navigation.
 * Non-hook version for use in Zustand stores and plain functions.
 */
export function silentPushState(url: string): void {
  if (typeof window !== "undefined") {
    window.history.pushState(null, "", url);
  }
}

/**
 * Replace the current URL in browser history without triggering navigation.
 * Non-hook version for use in Zustand stores and plain functions.
 */
export function silentReplaceState(url: string): void {
  if (typeof window !== "undefined") {
    window.history.replaceState(null, "", url);
  }
}
