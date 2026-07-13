/**
 * Guard Stop Route Handler
 * Handles POST requests for stopping guard environments
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import guardStopEndpoints from "./definition";
import { GuardStopRepository } from "./repository";

export const { tools } = endpointsHandler({
  endpoint: guardStopEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger, t }) =>
      GuardStopRepository.stopGuard(data, logger, t),
  },
});
