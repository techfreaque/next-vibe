import type { NextRequest } from "next-vibe/ui/lib/request";

import { AUTH_TOKEN_COOKIE_NAME } from "@/env/constants";

export const DEGRADED_PUBLIC_DOCUMENT_HEADER = "x-vibe-leadless-document";

const markedResponses = new WeakSet<Response>();

/** Pages with a single, read-only loader. Token and account routes stay closed. */
const publicPages = new Set([
  "docs/api",
  "models",
  "story",
  "story/abliterated-ai-chat",
  "story/about-us",
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

export function isPublicDocumentPath(path: string): boolean {
  const route = path.match(/^\/[a-z]{2}-[A-Z]+\/(.+?)\/?$/)?.[1] ?? "";
  return (
    publicPages.has(route) ||
    /^models\/[\w.-]+$/.test(route) ||
    /^models\/compare\/[\w.-]+\/[\w.-]+$/.test(route) ||
    /^story\/(?:blog|compare)\/[\w-]+$/.test(route)
  );
}

export function canRenderWithoutLead(request: NextRequest): boolean {
  return (
    (request.method === "GET" || request.method === "HEAD") &&
    isPublicDocumentPath(request.nextUrl.pathname) &&
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
