/**
 * Server Development Route
 * Handles development server management operations
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, locale, logger }) =>
      (await import("./repository")).DevRepository.execute(
        data,
        locale,
        logger,
      ),
  },
});
