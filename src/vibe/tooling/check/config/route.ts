/**
 * Config Create Route Handler
 * Handles POST requests for creating check.config.ts
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import configCreateEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: configCreateEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t, platform, locale }) =>
      (await import("./repository")).ConfigCreateRepository.execute(
        data,
        logger,
        t,
        platform,
        locale,
      ),
  },
});
