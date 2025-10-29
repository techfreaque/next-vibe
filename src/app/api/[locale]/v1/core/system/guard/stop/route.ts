/**
 * Guard Stop Route Handler
 * Handles POST requests for stopping guard environments
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import guardStopEndpoints from "./definition";
import { guardStopRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: guardStopEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      return guardStopRepository.stopGuard(data, user, locale, logger);
    },
  },
});
