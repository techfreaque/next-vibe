/**
 * Pulse Execute API Route
 * Handles pulse health check execution
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import pulseExecuteEndpoints from "./definition";
import { PulseExecuteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: pulseExecuteEndpoints,
  [Methods.POST]: {
    handler: ({ data, locale, logger }) =>
      PulseExecuteRepository.executePulse(data, locale, logger),
  },
});
