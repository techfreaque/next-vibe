/**
 * Guard Start Route Handler
 * Handles POST requests for starting guard environments
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import guardStartEndpoints from "./definition";
import { guardStartRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: guardStartEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger }) => {
      return guardStartRepository.startGuard(data, logger);
    },
  },
});
