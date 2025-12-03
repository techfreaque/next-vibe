/**
 * Pulse Execute API Route
 * Handles pulse health check execution
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import pulseExecuteEndpoints from "./definition";
import { pulseExecuteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: pulseExecuteEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      pulseExecuteRepository.executePulse(data, user, locale, logger),
  },
});
