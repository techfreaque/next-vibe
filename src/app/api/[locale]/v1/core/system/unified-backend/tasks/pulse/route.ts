/**
 * Pulse Route
 * API routes for pulse health monitoring system
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import definitions from "./definition";
import { pulseExecuteRepository } from "./execute/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return await pulseExecuteRepository.executePulse(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
