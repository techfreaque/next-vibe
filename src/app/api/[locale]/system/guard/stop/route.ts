/**
 * Guard Stop Route Handler
 * Handles POST requests for stopping guard environments
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import guardStopEndpoints from "./definition";
import { guardStopRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: guardStopEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger }) => {
      return guardStopRepository.stopGuard(data, logger);
    },
  },
});
