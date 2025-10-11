/**
 * Guard Stop Route Handler
 * Handles POST requests for stopping guard environments
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

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
