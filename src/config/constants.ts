export const DEFAULT_PROJECT_URL = "https://unbottled.ai"; // eslint-disable-line i18next/no-literal-string

export const LOCALE_COOKIE_NAME = "locale";

/**
 * Returns a port suffix string like "_3001" in non-production when
 * NEXT_PUBLIC_APP_URL has a non-standard port, otherwise "".
 * Used to scope cookies so dev (3000) and local (3001) don't clobber each other.
 */
function getPortSuffix(): string {
  if (process.env.NODE_ENV === "production") {
    return "";
  }
  try {
    const url = process.env.NEXT_PUBLIC_APP_URL;
    if (url) {
      const port = new URL(url).port;
      if (port && port !== "80" && port !== "443") {
        return `_${port}`;
      }
    }
  } catch {
    // ignore — fall through to no suffix
  }
  return "";
}

const PORT_SUFFIX = getPortSuffix();

export const LEAD_ID_COOKIE_NAME = `lead_id${PORT_SUFFIX}`;

export const AUTH_TOKEN_COOKIE_MAX_AGE_DAYS = 90;
export const AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS =
  60 * 60 * 24 * AUTH_TOKEN_COOKIE_MAX_AGE_DAYS; // AUTH_TOKEN_COOKIE_MAX_AGE_DAYS days
/**
 * Auth token cookie name — port-scoped in non-production to prevent
 * dev (3000) and local (3001) from clobbering each other's sessions.
 * In production there's only one port so no suffix is needed.
 */
export const AUTH_TOKEN_COOKIE_NAME = `token${PORT_SUFFIX}`;
export const RESET_TOKEN_EXPIRY = 4; // hours

/**
 * CSRF double-submit cookie name.
 * Non-HttpOnly so JS can read and echo it as the X-CSRF-Token header.
 * The server validates header === cookie to confirm the request originated
 * from the same origin (cross-origin pages cannot read cookies).
 */
export const CSRF_TOKEN_COOKIE_NAME = "csrf_token";
export const CSRF_TOKEN_HEADER_NAME = "x-csrf-token";
