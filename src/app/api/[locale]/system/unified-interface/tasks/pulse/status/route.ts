/**
 * Pulse Status API Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { PulseHealthRepository } from "../repository";
import pulseStatusEndpoint from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: pulseStatusEndpoint,
  [Methods.GET]: {
    handler: async ({ locale }) => {
      return await PulseHealthRepository.getHealthStatus(locale);
    },
  },
});
