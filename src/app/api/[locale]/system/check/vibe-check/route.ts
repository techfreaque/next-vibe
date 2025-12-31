/**
 * Vibe Check Route Handler
 * Handles POST requests for comprehensive code quality checks
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import vibeCheckEndpoints from "./definition";
import { VibeCheckRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: vibeCheckEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger, platform }) => {
      return VibeCheckRepository.execute(data, logger, platform);
    },
  },
});
