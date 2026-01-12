/**
 * Interactive Mode Route Handler
 * Handles POST requests for starting interactive CLI mode
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { CliCompatiblePlatform } from "@/app/api/[locale]/system/unified-interface/cli/runtime/route-executor";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";

import interactiveEndpoints from "./definition";
import { interactiveRepository } from "./repository";

const CLI_PLATFORMS: readonly Platform[] = [
  Platform.CLI,
  Platform.CLI_PACKAGE,
  Platform.AI,
  Platform.MCP,
];

function isCliCompatiblePlatform(
  platform: Platform,
): platform is CliCompatiblePlatform {
  return CLI_PLATFORMS.includes(platform);
}

export const { POST, tools } = endpointsHandler({
  endpoint: interactiveEndpoints,
  [Methods.POST]: {
    handler: ({ user, locale, logger, platform }) => {
      if (!isCliCompatiblePlatform(platform)) {
        return fail({
          message: "app.api.system.help.interactive.errors.cliOnly.title",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      return interactiveRepository.startInteractiveMode(
        user,
        locale,
        logger,
        platform,
      );
    },
  },
});
