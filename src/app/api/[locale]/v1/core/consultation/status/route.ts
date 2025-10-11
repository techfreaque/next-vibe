/**
 * Consultation Status Route Handler
 * Handles GET requests for getting consultation status
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import statusEndpoints from "./definition";
import { consultationStatusRepository } from "./repository";

/**
 * Export handlers using endpointHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: statusEndpoints,
  [Methods.GET]: {
    handler: ({ user, logger }) => {
      return consultationStatusRepository.getConsultationStatus(
        user.id,
        logger,
      );
    },
  },
});
