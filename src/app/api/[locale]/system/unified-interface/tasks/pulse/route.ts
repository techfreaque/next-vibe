/**
 * Pulse Route
 * API routes for pulse health monitoring system
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { pulseExecuteRepository } from "./execute/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, locale, logger }) => {
      return await pulseExecuteRepository.executePulse(
        data,
        locale,
        logger,
      );
    },
  },
});
