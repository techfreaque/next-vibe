/**
 * Browser context attached to every client error report.
 *
 * Kept free of React and server imports so the client logger, the global
 * window error listeners and the error boundaries can all share it.
 * No PII: paths are sanitized (ids/tokens -> ":id"), no query string, no
 * referrer, no user input.
 */

import { rootHasClass } from "next-vibe/ui/lib/css-vars";
import { getVisibilityState } from "next-vibe/ui/lib/dom";
import { getCurrentPathname } from "next-vibe/ui/lib/location";
import { getUserAgent, isOnline } from "next-vibe/ui/lib/media";
import { getViewportLabel } from "next-vibe/ui/lib/screen";

/** A path segment that is an id or a secret (uuid, numeric id, long token). */
function isIdLikeSegment(segment: string): boolean {
  if (/^\d+$/.test(segment)) {
    return true;
  }
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      segment,
    )
  ) {
    return true;
  }
  // Reset-password / verification tokens and other opaque ids. Real route
  // segments are short slugs; anything this long and slug-less is an id.
  return segment.length >= 20 && /^[A-Za-z0-9_.~%-]+$/.test(segment);
}

/**
 * Pathname with id/token segments replaced by ":id" so reports group by route
 * and never carry a reset-password token or similar secret from the URL.
 */
export function sanitizeRoutePath(pathname: string): string {
  return pathname
    .split("/")
    .map((segment) => (isIdLikeSegment(segment) ? ":id" : segment))
    .join("/");
}

export type ClientReportPlatform = "web" | "native" | "server";

export function detectClientPlatform(): ClientReportPlatform {
  if (typeof document !== "undefined") {
    return "web";
  }
  return getUserAgent() === "React Native" ? "native" : "server";
}

/** Current sanitized route, or null outside a browser. */
export function getClientRoute(): string | null {
  if (detectClientPlatform() !== "web") {
    return null;
  }
  return sanitizeRoutePath(getCurrentPathname());
}

/**
 * Context fields every client report carries. Values are primitives so they
 * pass the client-log endpoint's metadata schema untouched.
 */
export function getClientReportContext(): Record<
  string,
  string | number | boolean | null
> {
  const platform = detectClientPlatform();
  if (platform !== "web") {
    return { platform };
  }
  return {
    platform,
    route: getClientRoute(),
    userAgent: getUserAgent().slice(0, 300),
    viewport: getViewportLabel(),
    online: isOnline(),
    visibility: getVisibilityState(),
    // Google Translate & co. rewrite React's DOM -> insertBefore/removeChild errors
    pageTranslated:
      rootHasClass("translated-ltr") || rootHasClass("translated-rtl"),
  };
}

/**
 * Errors already sent by a boundary/handler. React re-throws boundary errors
 * in dev and an uncaught one also fires window "error"; without this the
 * same crash would be reported twice from two places.
 */
const reportedErrors = new WeakSet<Error>();

/** Returns true the first time it sees `error`, false on every repeat. */
export function claimErrorReport(error: Error): boolean {
  if (reportedErrors.has(error)) {
    return false;
  }
  reportedErrors.add(error);
  return true;
}
