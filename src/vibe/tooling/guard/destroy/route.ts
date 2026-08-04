/**
 * Guard Destroy Route Handler
 * Handles POST requests for destroying guard environments
 */

import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";
import guardDestroyEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: guardDestroyEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger, t }) =>
      (await import("./repository")).GuardDestroyRepository.destroyGuard(
        data,
        logger,
        t,
      ),
  },
});
