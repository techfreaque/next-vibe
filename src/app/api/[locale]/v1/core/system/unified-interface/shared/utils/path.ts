/**
 * Path utilities
 * Common path manipulation functions
 */

import type { CreateApiEndpointAny } from "../types/endpoint";

/**
 * Path separator - underscore used consistently across entire codebase
 * AI providers require: ^[a-zA-Z0-9_-]{1,128}$
 * We use underscore as the ONLY separator
 */
export const PATH_SEPARATOR = "_";

/**
 * Split path by separator and filter out empty segments
 */
export function splitPath(path: string): string[] {
  return path.split(PATH_SEPARATOR).filter(Boolean);
}

/**
 * Join path segments with separator
 * Validates that segments don't contain underscores (would conflict with separator)
 */
function joinPath(path: readonly string[]): string {
  // Validate no segments contain underscores
  for (const segment of path) {
    if (segment.includes("_")) {
      throw new Error(
        `Path segment contains underscore which conflicts with separator: "${segment}". ` +
          `Full path: ${[...path].join(" / ")}. ` +
          `Underscores are reserved as separators. Use hyphens in file/folder names instead.`,
      );
    }
  }

  return [...path].join(PATH_SEPARATOR);
}

/**
 * Sanitize a path segment to meet AI provider requirements
 * AI providers require tool names to match: ^[a-zA-Z0-9_-]{1,128}$
 * This removes square brackets from dynamic routes like [id]
 */
function sanitizePathSegment(segment: string): string {
  // Remove square brackets to handle dynamic routes like [id]
  // Example: "[id]" becomes "id", "[threadId]" becomes "threadId"
  return segment.replace(/\[|\]/g, "");
}

/**
 * Convert endpoint definition to full toolName path
 * Format: "v1_core_agent_brave-search_GET"
 * Note: Hyphens are allowed within segment names (e.g., "brave-search")
 * Dynamic route segments have brackets removed (e.g., "[id]" becomes "id")
 */
export function endpointToToolName(endpoint: CreateApiEndpointAny): string {
  // Sanitize each path segment to remove invalid characters
  const sanitizedPath = endpoint.path.map(sanitizePathSegment);
  return `${joinPath(sanitizedPath)}${PATH_SEPARATOR}${endpoint.method}`;
}
