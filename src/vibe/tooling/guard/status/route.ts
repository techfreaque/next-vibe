/**
 * Guard Status Route Handler
 * Handles GET requests for checking guard status
 */

import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

import guardStatusEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: guardStatusEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger, t }) =>
      (await import("./repository")).GuardStatusRepository.getStatus(
        data,
        logger,
        t,
      ),
  },
});
