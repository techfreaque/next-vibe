/**
 * Pulse Execute API Route
 * Handles pulse health check execution
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import pulseExecuteEndpoints from "./definition";
import { PulseExecuteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: pulseExecuteEndpoints,
  [Methods.POST]: {
    handler: ({ data, locale, logger, t }) =>
      PulseExecuteRepository.executePulse(data, locale, logger, t),
  },
});
