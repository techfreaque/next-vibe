/**
 * Middleware Utilities
 *
 * Shared utilities for middleware functions
 */

/**
 * Check if a path should be skipped by middleware
 * @param path The request path
 * @returns true if the path should be skipped
 */
export function shouldSkipPath(path: string): boolean {
  // Skip for static files, images, and Next.js internals
  return (
    path.includes("/_next/") ||
    path.includes("/static/") ||
    path.includes("/images/") ||
    path.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/) !==
      null ||
    path === "/favicon.ico" ||
    path === "/robots.txt" ||
    path === "/sitemap.xml"
  );
}

/**
 * Check if a path is an API route
 * @param path The request path
 * @returns true if the path is an API route
 */
export function isApiRoute(path: string): boolean {
  return path.startsWith("/api/");
}

/**
 * Extract locale from path
 * Handles both regular paths (/en-GLOBAL/...) and API paths (/api/en-GLOBAL/...)
 * @param path The request path
 * @returns The locale if found, undefined otherwise
 */
export function extractLocaleFromPath(path: string): string | undefined {
  // Try API route pattern first: /api/[locale]/...
  const apiLocaleMatch = path.match(/^\/api\/([a-z]{2}-[A-Z]+)/);
  if (apiLocaleMatch) {
    return apiLocaleMatch[1];
  }

  // Try regular path pattern: /[locale]/...
  const localeMatch = path.match(/^\/([a-z]{2}-[A-Z]+)/);
  return localeMatch?.[1];
}
