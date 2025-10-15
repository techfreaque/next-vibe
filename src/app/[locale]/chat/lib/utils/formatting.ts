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
    return `${days}d ago`;
  }
  if (hours > 0) {
    return `${hours}h ago`;
  }
  if (minutes > 0) {
    return `${minutes}m ago`;
  }
  return "just now";
}

/**
 * Format timestamp in 4chan style (MM/DD/YY(Day)HH:MM:SS)
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted timestamp string
 */
export function format4chanTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).substring(2);
  const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    date.getDay()
  ];
  const hours = String(date.getHours()).padStart(2, "0");
  const mins = String(date.getMinutes()).padStart(2, "0");
  const secs = String(date.getSeconds()).padStart(2, "0");

  return `${month}/${day}/${year}(${dayName})${hours}:${mins}:${secs}`;
}

/**
 * Generate a short ID from a message ID (first 8 characters)
 *
 * @param messageId - Full message ID
 * @returns Short ID (8 characters)
 */
export function getShortId(messageId: string): string {
  return messageId.substring(0, 8);
}

/**
 * Generate a consistent color for an ID using hash
 *
 * @param id - ID string to hash
 * @returns HSL color string
 */
export function getIdColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360);
  const saturation = 60 + (Math.abs(hash) % 20); // 60-80%
  const lightness = 45 + (Math.abs(hash >> 8) % 15); // 45-60%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Extract >>references from message content
 * Now supports both post numbers (>>1234567) and legacy short IDs (>>abc123)
 *
 * @param content - Message content
 * @returns Array of referenced IDs (post numbers or short IDs as strings)
 */
export function extractReferences(content: string): string[] {
  const regex = />>\s*([0-9]+)/g; // Match >>1234567 style post numbers
  const matches = content.matchAll(regex);
  return Array.from(matches, (m) => m[1]);
}
