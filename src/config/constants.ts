export const DEFAULT_PROJECT_URL = "https://unbottled.ai"; // eslint-disable-line i18next/no-literal-string
export const GITHUB_REPO_URL = "https://github.com/techfreaque/next-vibe"; // eslint-disable-line i18next/no-literal-string

/**
 * Canonical list of platforms that every next-vibe endpoint automatically becomes.
 * Add a new entry here when a new platform is supported - all platform counts across
 * the app derive from this array's length via PLATFORM_COUNT.
 */
export const ENDPOINT_PLATFORMS = [
  "webApi",
  "reactUi",
  "cli",
  "aiTool",
  "mcpServer",
  "reactNative",
  "cron",
  "websocket",
  "electron",
  "adminPanel",
  "vibeFrame",
  "remoteSkill",
  "vibeBoard",
] as const;

export type EndpointPlatformKey = (typeof ENDPOINT_PLATFORMS)[number];

/** Derived count - use this instead of the magic number 13. */
export const PLATFORM_COUNT = ENDPOINT_PLATFORMS.length;

export const LOCALE_COOKIE_NAME = "locale";

/**
 * Returns a port suffix string like "_3001" in non-production when
 * NEXT_PUBLIC_APP_URL has a non-standard port, otherwise "".
 * Used to scope cookies so different local projects on different ports
 * don't clobber each other's sessions.
 *
 * In production NODE_ENV the suffix is always empty - production servers
 * don't expose a port in the public URL.
 *
 * Port 80 and 443 map to the standard HTTP/HTTPS defaults and need no suffix.
 * Any other port (3000, 3001, 3002 …) gets a suffix so cookie names are unique
 * per running instance, even when port-collision detection bumps a project to
 * an unexpected port.
 */
function getPortSuffix(): string {
  if (process.env.NODE_ENV === "production") {
    return "";
  }
  try {
    const url = process.env.NEXT_PUBLIC_APP_URL;
    if (url) {
      const parsed = new URL(url);
      const port = parsed.port;
      // Explicit non-standard port → isolate with a suffix
      if (port && port !== "80" && port !== "443") {
        return `_${port}`;
      }
      // No explicit port but hostname is localhost → default HTTP port 80
      // which means no real port isolation is possible; return empty suffix.
    }
  } catch {
    // ignore - fall through to no suffix
  }
  return "";
}

const PORT_SUFFIX = getPortSuffix();

export const LEAD_ID_COOKIE_NAME = `lead_id${PORT_SUFFIX}`;

export const AUTH_TOKEN_COOKIE_MAX_AGE_DAYS = 90;
export const AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS =
  60 * 60 * 24 * AUTH_TOKEN_COOKIE_MAX_AGE_DAYS; // AUTH_TOKEN_COOKIE_MAX_AGE_DAYS days
/**
 * Auth token cookie name - port-scoped in non-production to prevent
 * different local instances from clobbering each other's sessions.
 * In production there's only one port so no suffix is needed.
 */
export const AUTH_TOKEN_COOKIE_NAME = `token${PORT_SUFFIX}`;
export const RESET_TOKEN_EXPIRY = 4; // hours

/**
 * CSRF double-submit cookie name - port-scoped like the auth cookies so
 * two projects running on different ports don't mix up CSRF tokens.
 * Non-HttpOnly so JS can read and echo it as the X-CSRF-Token header.
 * The server validates header === cookie to confirm the request originated
 * from the same origin (cross-origin pages cannot read cookies).
 */
export const CSRF_TOKEN_COOKIE_NAME = `csrf_token${PORT_SUFFIX}`;
export const CSRF_TOKEN_HEADER_NAME = "x-csrf-token";
