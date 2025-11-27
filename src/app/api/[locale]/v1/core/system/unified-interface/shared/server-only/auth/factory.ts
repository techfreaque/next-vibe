import "server-only";

import type { BaseAuthHandler } from "./base-auth-handler";
import { Platform } from "../../types/platform";
import { cliAuthHandler } from "../../../cli/auth/cli-handler";
import { webAuthHandler } from "../../../next-api/auth-handler";

/**
 * Platform Authentication Handler Factory
 * Returns the appropriate auth handler based on platform
 *
 * Platform mapping:
 * - TRPC, NEXT_PAGE, NEXT_API -> WebAuthHandler (cookies)
 * - CLI, AI, MCP -> CliAuthHandler (.vibe.session file)
 */
export function getPlatformAuthHandler(platform: Platform): BaseAuthHandler {
  switch (platform) {
    case Platform.TRPC:
    case Platform.NEXT_PAGE:
    case Platform.NEXT_API:
    case Platform.AI:
      return webAuthHandler;

    case Platform.CLI:
    case Platform.MCP:
      return cliAuthHandler;

    default: {
      const _exhaustiveCheck: never = platform;
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Auth factory exhaustiveness check requires throwing for unsupported platforms
      throw new Error(`Unsupported platform: ${String(_exhaustiveCheck)}`);
    }
  }
}

/**
 * Check if platform uses session file storage
 */
export function usesSessionFile(platform: Platform): boolean {
  return (
    platform === Platform.CLI ||
    platform === Platform.AI ||
    platform === Platform.MCP
  );
}

/**
 * Check if platform uses cookie storage
 */
export function usesCookies(platform: Platform): boolean {
  return (
    platform === Platform.TRPC ||
    platform === Platform.NEXT_PAGE ||
    platform === Platform.NEXT_API ||
    platform === Platform.AI
  );
}
