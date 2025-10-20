/**
 * Shared Formatting Utilities
 *
 * Common formatting functions used across the chat application.
 */

/**
 * Format timestamp as relative time (e.g., "5m ago", "2h ago")
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) {
    // eslint-disable-next-line i18next/no-literal-string -- Technical time format, not user-facing
    return `${days}d ago`;
  }
  if (hours > 0) {
    // eslint-disable-next-line i18next/no-literal-string -- Technical time format, not user-facing
    return `${hours}h ago`;
  }
  if (minutes > 0) {
    // eslint-disable-next-line i18next/no-literal-string -- Technical time format, not user-facing
    return `${minutes}m ago`;
  }
  // eslint-disable-next-line i18next/no-literal-string -- Technical time format, not user-facing
  return "just now";
}
