import "server-only";

import type { AuthPlatform, BaseAuthHandler } from "./base-auth-handler";
import { cliAuthHandler } from "./cli-handler";
import { webAuthHandler } from "./web-handler";

/**
 * Platform Authentication Handler Factory
 * Returns the appropriate auth handler based on platform
 *
 * Platform mapping:
 * - next, trpc, web -> WebAuthHandler (cookies)
 * - cli, ai, mcp -> CliAuthHandler (.vibe.session file)
 * - mobile -> Native handler (AsyncStorage) - to be implemented
 */
export function getPlatformAuthHandler(
  platform: AuthPlatform,
): BaseAuthHandler {
  switch (platform) {
    case "next":
    case "trpc":
    case "web":
      return webAuthHandler;

    case "cli":
    case "ai":
    case "mcp":
      return cliAuthHandler;

    case "mobile":
      // TODO: Implement native auth handler
      // For now, fall back to web handler
      return webAuthHandler;

    default: {
      const _exhaustiveCheck: never = platform;
      // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string
      throw new Error(`Unsupported platform: ${String(_exhaustiveCheck)}`);
    }
  }
}

/**
 * Check if platform uses session file storage
 */
export function usesSessionFile(platform: AuthPlatform): boolean {
  return platform === "cli" || platform === "ai" || platform === "mcp";
}

/**
 * Check if platform uses cookie storage
 */
export function usesCookies(platform: AuthPlatform): boolean {
  return platform === "next" || platform === "trpc" || platform === "web";
}

/**
 * Check if platform uses AsyncStorage
 */
export function usesAsyncStorage(platform: AuthPlatform): boolean {
  return platform === "mobile";
}
