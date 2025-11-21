/**
 * Interactive Mode Route Handler
 * Handles POST requests for starting interactive CLI mode
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import interactiveEndpoints from "./definition";
import { interactiveRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: interactiveEndpoints,
  [Methods.POST]: {
    handler: ({ user, locale, logger }) => {
      return interactiveRepository.startInteractiveMode(user, locale, logger);
    },
  },
});
