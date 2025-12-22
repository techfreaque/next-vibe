/**
 * Pulse Route
 * API routes for pulse health monitoring system
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { PulseExecuteRepository } from "./execute/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, locale, logger }) => {
      return await PulseExecuteRepository.executePulse(data, locale, logger);
    },
  },
});
