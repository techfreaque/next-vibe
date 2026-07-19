/**
 * Server Start Route Handler
 * Handles POST requests for starting the production server
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import startEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: startEndpoints,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) =>
      (await import("./repository")).ServerStartRepository.startServer(
        data,
        user,
        locale,
        logger,
      ),
  },
});
