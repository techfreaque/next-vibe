/**
 * Rebuild & Restart Route
 * API route for rebuilding and hot-restarting the server
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import rebuildEndpoints from "./definition";
import { RebuildRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: rebuildEndpoints,
  [Methods.POST]: {
    handler: ({ data, locale, logger, t, streamContext }) =>
      RebuildRepository.execute(
        data,
        locale,
        logger,
        t,
        streamContext.abortSignal,
      ),
  },
});
