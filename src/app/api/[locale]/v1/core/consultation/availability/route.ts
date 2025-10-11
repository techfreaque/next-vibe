/**
 * Consultation Availability Route Handler
 * Enhanced route handler for checking consultation availability
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import availabilityEndpoints from "./definition";
import { consultationAvailabilityRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: availabilityEndpoints,
  [Methods.GET]: {
    handler: async ({ data, user, locale, logger }) => {
      return await consultationAvailabilityRepository.getAvailableSlots(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
