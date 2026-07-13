/**
 * Format byte count as human-readable string.
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format byte count for CLI display (fixed-width).
 */
export function formatBytesCli(bytes: number | null): string {
  if (bytes === null) {
    return "  -  ";
  }
  if (bytes < 1024) {
    return `${bytes}B`.padStart(5);
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)}K`.padStart(5);
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}M`.padStart(5);
}
