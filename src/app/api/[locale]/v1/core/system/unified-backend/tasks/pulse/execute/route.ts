/**
 * Pulse Execute API Route
 * Handles pulse health check execution
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import pulseExecuteEndpoints from "./definition";
import { pulseExecuteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: pulseExecuteEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      pulseExecuteRepository.executePulse(data, user, locale, logger),
  },
});
