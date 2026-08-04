/**
 * Pulse Status API Route Handler
 */

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";
import { PulseHealthRepository } from "../repository";
import pulseStatusEndpoint from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: pulseStatusEndpoint,
  [Methods.GET]: {
    handler: ({ locale }) => PulseHealthRepository.getHealthStatus(locale),
  },
});
