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

/**
 * Get current URL origin (protocol + host).
 * Returns empty string during SSR.
 */
export function getCurrentOrigin(): string {
  return typeof window !== "undefined" ? window.location.origin : "";
}

/**
 * Get current pathname (e.g. "/en-US/tools/chat"). Returns "/" during SSR.
 */
export function getCurrentPathname(): string {
  return typeof window !== "undefined" ? window.location.pathname : "/";
}

/**
 * Get current search string (e.g. "?q=hello"). Returns "" during SSR.
 */
export function getCurrentSearch(): string {
  return typeof window !== "undefined" ? window.location.search : "";
}

/**
 * Get the current hostname.
 * Returns empty string during SSR.
 */
export function getCurrentHostname(): string {
  return typeof window !== "undefined" ? window.location.hostname : "";
}

/**
 * Reload the current page.
 */
export function reloadPage(): void {
  if (typeof window !== "undefined") {
    window.location.reload();
  }
}

/**
 * Navigate to a URL, replacing the current history entry.
 */
export function assignUrl(url: string): void {
  if (typeof window !== "undefined") {
    window.location.assign(url);
  }
}

/**
 * Scroll the page to the top.
 */
export function scrollToTop(behavior: ScrollBehavior = "smooth"): void {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior });
  }
}

/**
 * Trigger the browser's print dialog.
 */
export function triggerPrint(): void {
  if (typeof window !== "undefined") {
    window.print();
  }
}

/**
 * Copy text to the clipboard. Returns true on success.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Trigger a file download in the browser.
 */
export function downloadFile(
  filename: string,
  content: string,
  mimeType = "text/plain",
): void {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: mimeType }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * Read a CSS custom property from :root.
 */
export function getRootCssVar(name: string): string {
  if (typeof document === "undefined") {
    return "";
  }
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/**
 * Set a CSS custom property on :root.
 */
export function setRootCssVar(name: string, value: string): void {
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty(name, value);
  }
}

/**
 * Remove a CSS custom property from :root (restores cascade default).
 */
export function removeRootCssVar(name: string): void {
  if (typeof document !== "undefined") {
    document.documentElement.style.removeProperty(name);
  }
}

/**
 * Check if :root has a CSS class.
 */
export function rootHasClass(className: string): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains(className)
  );
}

/**
 * Add a class to :root.
 */
export function addRootClass(className: string): void {
  if (typeof document !== "undefined") {
    document.documentElement.classList.add(className);
  }
}

/**
 * Remove a class from :root.
 */
export function removeRootClass(className: string): void {
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove(className);
  }
}

/**
 * Get the full scroll height of the document.
 */
export function getDocumentScrollHeight(): number {
  return typeof document !== "undefined"
    ? document.documentElement.scrollHeight
    : 0;
}

/**
 * Get the document body element (for React portals, etc.).
 */
export function getDocumentBody(): HTMLElement | null {
  return typeof document !== "undefined" ? document.body : null;
}

/**
 * Get an element by ID.
 */
export function getElementById(id: string): HTMLElement | null {
  return typeof document !== "undefined" ? document.getElementById(id) : null;
}

/**
 * Query a single element by CSS selector.
 */
export function querySelector<T extends Element = Element>(
  selector: string,
): T | null {
  return typeof document !== "undefined"
    ? document.querySelector<T>(selector)
    : null;
}

/**
 * Add a document-level event listener. Returns a cleanup function.
 */
export function addDocumentListener<K extends keyof DocumentEventMap>(
  event: K,
  handler: (e: DocumentEventMap[K]) => void,
): () => void {
  if (typeof document === "undefined") {
    return (): void => undefined;
  }
  document.addEventListener(event, handler);
  return (): void => document.removeEventListener(event, handler);
}

/**
 * Add a window-level event listener. Returns a cleanup function.
 */
export function addWindowListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
): () => void {
  if (typeof window === "undefined") {
    return (): void => undefined;
  }
  window.addEventListener(event, handler);
  return (): void => window.removeEventListener(event, handler);
}

/**
 * Observe mutations on :root (e.g. for dark mode class changes).
 * Returns a cleanup function.
 */
export function observeRootMutations(
  callback: MutationCallback,
  options: MutationObserverInit,
): () => void {
  if (typeof document === "undefined") {
    return (): void => undefined;
  }
  const mo = new MutationObserver(callback);
  mo.observe(document.documentElement, options);
  return (): void => mo.disconnect();
}

/**
 * Get the current geolocation. Returns a Promise resolving to coordinates or null.
 */
export function getGeolocation(): Promise<GeolocationCoordinates | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      () => resolve(null),
    );
  });
}

/**
 * Request microphone access and return a MediaStream, or null if denied/unavailable.
 */
export async function getMicrophoneStream(): Promise<MediaStream | null> {
  try {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      return null;
    }
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    return null;
  }
}

/**
 * Check if the clipboard API is available.
 */
export function hasClipboardAccess(): boolean {
  return typeof navigator !== "undefined" && "clipboard" in navigator;
}
