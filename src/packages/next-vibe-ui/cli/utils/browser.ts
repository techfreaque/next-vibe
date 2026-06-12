/**
 * Platform-agnostic browser utilities (CLI implementation)
 * Terminal has no browser — all functions return sensible defaults or no-op.
 */

/**
 * Get current URL — not applicable in terminal
 */
export function getCurrentUrl(): string {
  return "";
}

/**
 * Get referrer URL — not applicable in terminal
 */
export function getReferrer(): string {
  return "";
}

/**
 * Get user agent — not applicable in terminal
 */
export function getUserAgent(): string {
  return "CLI";
}

/**
 * Open URL — no-op in terminal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function openUrl(_url: string): void {
  // No browser to open in terminal
}

/**
 * Open URL in a new tab — no-op in terminal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function openInNewTab(_url: string): void {
  // No browser tabs in terminal
}

/**
 * Get viewport width — terminal columns (defaults to 80)
 */
export function getScreenWidth(): number {
  return process.stdout?.columns ?? 80;
}

/**
 * Push URL to history — no-op in terminal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function silentPushState(_url: string): void {
  // No browser history in terminal
}

/**
 * Replace URL in history — no-op in terminal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function silentReplaceState(_url: string): void {
  // No browser history in terminal
}
