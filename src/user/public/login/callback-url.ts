/**
 * Post-auth return path ("callbackUrl") shared by the login and signup pages
 * and their widgets. Only same-site absolute paths pass: anything else would
 * be an open redirect (or a javascript: URL in assignUrl).
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

export const CALLBACK_URL_PARAM = "callbackUrl";

export function safeCallbackPath(
  value: string | null | undefined,
): string | null {
  if (
    !value ||
    !value.startsWith("/") ||
    /[\t\r\n]/.test(value) ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.includes("://")
  ) {
    return null;
  }
  return value;
}

/**
 * Locale-prefixed link to another auth page that keeps the return path, so
 * "Already have an account? Sign in" (and the reverse) still lands the user
 * where they were headed, e.g. the referral dashboard.
 */
export function authPageHref(
  locale: CountryLanguage,
  page: "login" | "signup" | "reset-password",
  callbackUrl: string | null | undefined,
): string {
  const base = `/${locale}/user/${page}`;
  const safe = safeCallbackPath(callbackUrl);
  return safe
    ? `${base}?${CALLBACK_URL_PARAM}=${encodeURIComponent(safe)}`
    : base;
}
