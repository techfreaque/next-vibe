/**
 * CSRF validation for mutating browser requests (double-submit cookie plus
 * Fetch Metadata). Kept free of handler state so every rule is unit-tested.
 */

import type { NextRequest } from "next-vibe/ui/lib/request";

import {
  AUTH_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_HEADER_NAME,
  LEAD_ID_COOKIE_NAME,
} from "@/env/constants";

import { Methods } from "../definition/enums";

const MUTATING_METHODS = new Set([
  Methods.POST,
  Methods.PUT,
  Methods.DELETE,
  Methods.PATCH,
]);

/**
 * Only this prefix makes WebAuthHandler ignore the cookies. Any other
 * Authorization value (`Basic x`, `foo`) still authenticates by cookie, so it
 * must not skip the CSRF check either.
 */
const BEARER_PREFIX = "Bearer ";

export type CsrfReason =
  | "csrf_header_missing"
  | "csrf_token_mismatch"
  | "csrf_cross_site";

export type CsrfCheckResult =
  | {
      valid: true;
      /** The double-submit token was compared (or the fallback applied). */
      checked: boolean;
      /** Set when the token failed but Fetch Metadata proved same-origin. */
      fetchMetadataFallback?: CsrfReason;
    }
  | { valid: false; reason: CsrfReason };

/**
 * Rules, in order:
 * 1. GET/HEAD/OPTIONS: nothing to check.
 * 2. `Sec-Fetch-Site: cross-site` carrying our auth or lead cookie: reject,
 *    even with a Bearer header (an invalid bearer falls back to the lead
 *    cookie). Those cookies only ride along cross-site when they were set
 *    `SameSite=None` (vibe-frame embeds), and the strict csrf cookie never
 *    does, so without this rule such a request would skip every check. None
 *    of our own callers send cookies cross-site (the frame's own requests are
 *    same-origin; the embed mount call sends no credentials).
 * 3. `Authorization: Bearer ...` (native, CLI, server-to-server): the auth
 *    layer then ignores the session cookie, so there is nothing to forge.
 * 4. No csrf cookie: non-browser client or first request. Allow.
 * 5. csrf cookie present: the X-CSRF-Token header must echo it, UNLESS the
 *    browser itself sent `Sec-Fetch-Site: same-origin`. That header is a
 *    forbidden request header (page script cannot set or change it), a
 *    cross-site or same-site (subdomain) initiator, or any redirect chain that
 *    crossed a site, can never produce it. A non-browser can send it, but a
 *    non-browser only holds its own cookies, so there is no victim. Browsers
 *    without Fetch Metadata send no header and still need the token.
 */
export function validateCsrf(
  request: Pick<NextRequest, "headers" | "cookies">,
  method: Methods,
): CsrfCheckResult {
  if (!MUTATING_METHODS.has(method)) {
    return { valid: true, checked: false };
  }
  const fetchSite = request.headers.get("sec-fetch-site");
  if (
    fetchSite === "cross-site" &&
    (request.cookies.has(AUTH_TOKEN_COOKIE_NAME) ||
      request.cookies.has(LEAD_ID_COOKIE_NAME))
  ) {
    return { valid: false, reason: "csrf_cross_site" };
  }
  if (request.headers.get("authorization")?.startsWith(BEARER_PREFIX)) {
    return { valid: true, checked: false };
  }
  const cookieToken = request.cookies.get(CSRF_TOKEN_COOKIE_NAME)?.value;
  if (!cookieToken) {
    return { valid: true, checked: false };
  }
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER_NAME);
  const reason: CsrfReason | null = !headerToken
    ? "csrf_header_missing"
    : headerToken !== cookieToken
      ? "csrf_token_mismatch"
      : null;
  if (!reason) {
    return { valid: true, checked: true };
  }
  if (fetchSite === "same-origin") {
    return { valid: true, checked: true, fetchMetadataFallback: reason };
  }
  return { valid: false, reason };
}
