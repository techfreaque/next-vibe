/**
 * Path utilities
 * Common path manipulation functions
 */

import type { CreateApiEndpointAny } from "../types/endpoint-base";

/**
 * Lazy-loaded alias map. The generated file may not exist during bootstrap
 * (e.g. first run of generators). We load it on first use so that path
 * utilities that don't need the map (pathSegmentsToToolName, etc.) remain
 * importable even before generation.
 */
let _aliasMap: Record<string, string> | null = null;

function getAliasMap(): Record<string, string> {
  if (_aliasMap === null) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- Lazy bootstrap: alias-map is a generated file that may not exist yet during first generator run. Using require() so we can catch the missing-module error gracefully.
      _aliasMap = require("@/app/api/[locale]/system/generated/alias-map")
        .pathToAliasMap as Record<string, string>;
    } catch {
      _aliasMap = {};
    }
  }
  return _aliasMap;
}

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
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Build-time validation: This throw is intentional to catch developer configuration errors early during endpoint definition. Invalid paths would break AI tool calling, so we fail fast at build time rather than runtime.
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
  return segment.replaceAll(/\[|\]/g, "");
}

/**
 * Build a canonical tool name from raw path segments and method.
 * This is the single place that defines how canonical names are formed.
 */
export function pathSegmentsToToolName(
  path: readonly string[],
  method: string,
): string {
  const sanitizedPath = path.map(sanitizePathSegment);
  return `${joinPath(sanitizedPath)}${PATH_SEPARATOR}${method}`;
}

/**
 * Convert endpoint definition to full toolName path
 * Format: "v1_core_agent_brave-search_GET"
 */
export function endpointToToolName(endpoint: CreateApiEndpointAny): string {
  return pathSegmentsToToolName(endpoint.path, endpoint.method);
}

/**
 * Get the preferred tool name for an endpoint object.
 * First alias if any, otherwise the canonical full path.
 */
export function getPreferredToolName(endpoint: CreateApiEndpointAny): string {
  if (endpoint.aliases && endpoint.aliases.length > 0) {
    return endpoint.aliases[0];
  }
  return endpointToToolName(endpoint);
}

/**
 * Resolve an alias or canonical path to the canonical full path.
 * Returns null if not found in the map.
 */
export function getFullPath(aliasOrPath: string): string | null {
  return getAliasMap()[aliasOrPath] ?? null;
}

/**
 * Resolve any tool name (alias or canonical) to the preferred name.
 * Preferred name = the canonical value stored in the alias map for this key.
 * The alias map stores each key → canonical, where canonical IS the preferred
 * name (it is the value that appears in capability snapshots and route matching).
 * Use this when you only have a string, not a full endpoint object.
 */
export function getPreferredName(nameOrAlias: string): string {
  return getAliasMap()[nameOrAlias] ?? nameOrAlias;
}
