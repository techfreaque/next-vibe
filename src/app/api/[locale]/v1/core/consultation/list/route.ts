/**
 * List Consultations Route Handler
 * Handles GET requests for listing consultations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import consultationListEndpoint from "./definition";
import { consultationListRepository } from "./repository";

/**
 * Export handlers using endpointHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: consultationListEndpoint,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, logger }) => {
      return await consultationListRepository.getConsultations(
        user.id,
        data,
        logger,
      );
    },
  },
});
