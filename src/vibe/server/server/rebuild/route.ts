/**
 * Rebuild & Restart Route
 * API route for rebuilding and hot-restarting the server
 */

import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

import rebuildEndpoints from "./definition";
import { RebuildRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: rebuildEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger, t, user, toolExecutionContext }) =>
      RebuildRepository.execute(
        data,
        logger,
        t,
        user,
        toolExecutionContext.abortSignal,
      ),
  },
});
