import type { NextRequest } from "next-vibe/ui/lib/request";

import { AUTH_TOKEN_COOKIE_NAME } from "@/env/constants";

export const DEGRADED_PUBLIC_DOCUMENT_HEADER = "x-vibe-leadless-document";
export const VERIFIED_CRAWLER_HEADER = "x-vibe-verified-crawler";

const markedResponses = new WeakSet<Response>();
const verifiedCrawlerResponses = new WeakSet<Response>();
const localeIndexPath = /^\/[a-z]{2}-[A-Z]+\/?$/;

/** Public pages whose loaders can render without a visitor identity. */
const publicPages = new Set([
  "docs/api",
  "models",
  "story",
  "story/abliterated-ai-chat",
  "story/about-us",
  "story/business",
  "story/blog",
  "story/careers",
  "story/earn",
  "story/framework",
  "story/imprint",
  "story/invest",
  "story/newsletter",
  "story/partners",
  "story/privacy-policy",
  "story/refusal-index",
  "story/self-host",
  "story/terms-of-service",
  "story/uncensored-ai",
]);

export function isPublicDocumentPath(
  path: string,
  includeSkillPages = true,
): boolean {
  // The locale index only chooses a destination. Identity can be established
  // there when the anonymous entry request could not provision a lead.
  if (localeIndexPath.test(path)) {
    return true;
  }
  const route = path.match(/^\/[a-z]{2}-[A-Z]+\/(.+?)\/?$/)?.[1] ?? "";
  return (
    publicPages.has(route) ||
    /^models\/[\w.-]+$/.test(route) ||
    /^models\/compare\/[\w.-]+\/[\w.-]+$/.test(route) ||
    (includeSkillPages && /^skill\/[\w.-]+$/.test(route)) ||
    /^story\/(?:blog|compare)\/[\w-]+$/.test(route)
  );
}

export function canRenderWithoutLead(
  request: NextRequest,
  { includeSkillPages = false } = {},
): boolean {
  return (
    (request.method === "GET" || request.method === "HEAD") &&
    isPublicDocumentPath(request.nextUrl.pathname, includeSkillPages) &&
    // The locale index's redirect drops query parameters. Let a failed
    // provisioning attempt surface when the request carries attribution.
    (!localeIndexPath.test(request.nextUrl.pathname) ||
      !request.nextUrl.search) &&
    !request.headers.has("authorization") &&
    !request.headers.has("next-action") &&
    !request.cookies.has(AUTH_TOKEN_COOKIE_NAME) &&
    !["id", "et", "token"].some((key) => request.nextUrl.searchParams.has(key))
  );
}

export function markDegradedPublicDocument(response: Response): void {
  markedResponses.add(response);
}

export function forwardDegradedPublicDocument(
  headers: Headers,
  response: Response,
): boolean {
  if (markedResponses.has(response)) {
    headers.set(DEGRADED_PUBLIC_DOCUMENT_HEADER, "1");
    return true;
  }
  if (headers.has(DEGRADED_PUBLIC_DOCUMENT_HEADER)) {
    headers.delete(DEGRADED_PUBLIC_DOCUMENT_HEADER);
  }
  return false;
}

/**
 * Mark a middleware response as a verified search/social crawler document read.
 * Unlike degraded public documents, verified crawlers still receive full SSR
 * HTML (refusal stats, leaderboards, structured data) while skipping guest lead
 * creation and lead cookies.
 */
export function markVerifiedCrawlerDocument(response: Response): void {
  verifiedCrawlerResponses.add(response);
}

export function forwardVerifiedCrawlerDocument(
  headers: Headers,
  response: Response,
): boolean {
  if (verifiedCrawlerResponses.has(response)) {
    headers.set(VERIFIED_CRAWLER_HEADER, "1");
    return true;
  }
  if (headers.has(VERIFIED_CRAWLER_HEADER)) {
    headers.delete(VERIFIED_CRAWLER_HEADER);
  }
  return false;
}
