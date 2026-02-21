import "server-only";

import { cliAuthHandler } from "../../../cli/auth/cli-handler";
import { webAuthHandler } from "../../../next-api/auth-handler";
import { Platform } from "../../types/platform";
import type { BaseAuthHandler } from "./base-auth-handler";

/**
 * Platform Authentication Handler Factory
 * Returns the appropriate auth handler based on platform
 *
 * Platform mapping:
 * - TRPC, NEXT_PAGE, NEXT_API -> WebAuthHandler (cookies)
 * - CLI, CLI_PACKAGE, AI, MCP -> CliAuthHandler (.vibe.session file)
 */
export function getPlatformAuthHandler(platform: Platform): BaseAuthHandler {
  switch (platform) {
    case Platform.TRPC:
    case Platform.NEXT_PAGE:
    case Platform.NEXT_API:
    case Platform.REMOTE_SKILL:
    case Platform.AI:
      return webAuthHandler;

    case Platform.CLI:
    case Platform.CLI_PACKAGE:
    case Platform.MCP:
      return cliAuthHandler;

    default: {
      const _exhaustiveCheck: never = platform;
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Auth factory exhaustiveness check requires throwing for unsupported platforms
      throw new Error(`Unsupported platform: ${String(_exhaustiveCheck)}`);
    }
  }
}
