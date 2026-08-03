/**
 * Guard Start Route Handler
 * Handles POST requests for starting guard environments
 */

import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

import guardStartEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: guardStartEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (await import("./repository")).GuardStartRepository.startGuard(
        data,
        logger,
        t,
      ),
  },
});
