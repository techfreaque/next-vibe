/**
 * Path utilities
 * Common path manipulation functions
 */

/**
 * Split path by slashes and filter out empty segments
 * Common pattern used across routing and path parsing
 */
export function splitPath(path: string): string[] {
  return path.split("/").filter(Boolean);
}
