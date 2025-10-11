/**
 * Consultation by ID API Route Handler
 * Handles GET requests for individual consultations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { consultationUpdateAdminRepository } from "./repository";

/**
 * Export handlers using endpointHandler
 */
export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ urlVariables, user, locale, logger }) => {
      return await consultationUpdateAdminRepository.getConsultationById(
        urlVariables.id,
        user,
        locale,
        logger,
      );
    },
  },
  [Methods.PATCH]: {
    handler: async ({ urlVariables, data, user, locale, logger }) => {
      return await consultationUpdateAdminRepository.updateConsultation(
        urlVariables.id,
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
