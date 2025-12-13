/**
 * Pulse Status API Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import pulseStatusEndpoint from "./definition";
import { pulseHealthRepository } from "../repository";

export const { GET, tools } = endpointsHandler({
  endpoint: pulseStatusEndpoint,
  [Methods.GET]: {
    handler: async () => {
      return await pulseHealthRepository.getHealthStatus();
    },
  },
});
