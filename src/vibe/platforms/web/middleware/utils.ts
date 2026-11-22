/**
 * Middleware Utilities
 *
 * Shared utilities for middleware functions
 */

import { AUTH_TOKEN_COOKIE_NAME, LEAD_ID_COOKIE_NAME } from "@/env/constants";

/** Make identities set by middleware visible to the render of this request. */
export function applyResponseIdentityCookies(
  requestHeaders: Headers,
  setCookies: readonly string[],
): void {
  const replacements = new Map<string, string>();
  for (const setCookie of setCookies) {
    const pair = setCookie.split(";", 1)[0] ?? "";
    const equals = pair.indexOf("=");
    if (equals < 0) {
      continue;
    }
    const name = pair.slice(0, equals);
    if (name === LEAD_ID_COOKIE_NAME || name === AUTH_TOKEN_COOKIE_NAME) {
      replacements.set(name, pair);
    }
  }
  if (replacements.size === 0) {
    return;
  }
  const remainingCookies = (requestHeaders.get("cookie") ?? "")
    .split(";")
    .map((pair) => pair.trim())
    .filter((pair) => pair && !replacements.has(pair.split("=", 1)[0] ?? ""));
  requestHeaders.set(
    "cookie",
    [...remainingCookies, ...replacements.values()].join("; "),
  );
}

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
    path === "/llms.txt" ||
    path === "/llms-full.txt" ||
    path === "/sitemap.xml" ||
    path.endsWith("/sitemap.xml") ||
    path.endsWith("/sitemap.xml.gz") ||
    path.includes("/sitemap-") ||
    // Skip webhook routes - they handle their own authentication
    path.includes("/payment/providers/stripe/webhook") ||
    path.includes("/payment/providers/nowpayments/webhook") ||
    // Skip AI skill manifests - public read-only docs, no identity required
    (path.includes("/ai/skills/") && path.endsWith(".md"))
  );
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

/**
 * OpenAI-compatible API mount: /api/<locale>/v1/... - called server-to-server
 * with an API key, no cookies and no lead identity.
 */
export const V1_API_PATH_REGEX = /^\/api\/[a-z]{2}-[A-Z]+\/v1(\/|$)/;
