/**
 * Click-tracking redirect guard.
 * /track?url=… redirects to `url` — unchecked, that is an open redirect any
 * phishing mail could use under our domain. Same-origin targets are always
 * safe; external targets only when the link we generated carries
 * sig = HMAC-SHA256(JWT_SECRET_KEY, url).
 */

import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { identityEnv } from "next-vibe/identity/env";

/** Signature for an external redirect target, carried as `sig` on tracking links. */
export function signRedirectUrl(url: string): string {
  return createHmac("sha256", identityEnv.JWT_SECRET_KEY)
    .update(`redirect:${url}`)
    .digest("hex");
}

function isValidSignature(url: string, sig: string): boolean {
  const expected = signRedirectUrl(url);
  return (
    expected.length === sig.length &&
    timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(sig, "utf8"))
  );
}

/**
 * Where the tracking page may send the visitor: `url` when it is same-origin
 * or validly signed, else the locale home.
 */
export function resolveSafeRedirect(
  url: string | undefined,
  sig: string | undefined,
  locale: CountryLanguage,
): string {
  const home = `/${locale}`;
  if (!url) {
    return home;
  }
  const appOrigin = new URL(coreEnv.NEXT_PUBLIC_APP_URL).origin;
  let target: URL;
  try {
    target = new URL(url, appOrigin);
  } catch {
    return home;
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return home;
  }
  // "/path" and same-origin absolute URLs; "//evil.com" resolves cross-origin
  if (target.origin === appOrigin) {
    return url;
  }
  return sig && isValidSignature(url, sig) ? url : home;
}
