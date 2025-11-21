/**
 * Shared Route Path Normalization Utility
 * Converts various path formats to the generated index format: "core/system/help"
 */

/**
 * Normalize route path to generated index format
 *
 * Converts:
 * - Absolute filesystem paths: /home/user/project/src/app/api/[locale]/v1/core/system/help/route.ts
 * - Module paths: @/app/api/[locale]/v1/core/system/help/route
 * - Already normalized: core/system/help
 *
 * To: core/system/help
 *
 * @param routePath - The route path to normalize
 * @returns Normalized path in format "core/segment1/segment2"
 */
export function normalizeRoutePath(routePath: string): string {
  // Remove leading slash: /core/system/help -> core/system/help, /c -> c
  if (routePath.startsWith("/")) {
    routePath = routePath.slice(1);
  }

  // If it doesn't start with "core/", it's likely an alias - return as-is
  if (!routePath.startsWith("core/") && !routePath.includes("/v1/")) {
    return routePath;
  }

  // Already in correct format (starts with "core/" and has no other markers)
  if (routePath.startsWith("core/") && !routePath.includes("/v1/")) {
    return routePath;
  }

  // Extract from filesystem path or module path: .../v1/core/system/help/route.ts -> core/system/help
  const match = routePath.match(
    /\/v1\/(.+?)(?:\/(?:definition|route)(?:\.ts)?)?$/,
  );
  if (match) {
    return match[1];
  }

  // Fallback: return as-is and let generated index handle it
  return routePath;
}
