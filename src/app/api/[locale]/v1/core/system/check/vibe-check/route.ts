/**
 * Vibe Check Route Handler
 * Handles POST requests for comprehensive code quality checks
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import vibeCheckEndpoints from "./definition";
import { vibeCheckRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: vibeCheckEndpoints,
  [Methods.POST]: {
    handler: ({ data, locale, logger }) => {
      return vibeCheckRepository.execute(data, locale, logger);
    },
  },
});
