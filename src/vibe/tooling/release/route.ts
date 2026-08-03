/**
 * Release Tool Route
 * API route for managing package releases
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";

import releaseToolEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: releaseToolEndpoints,
  [Methods.POST]: {
    handler: async ({ data, locale, logger }) =>
      (await import("./repository")).releaseToolRepository.execute(
        data,
        locale,
        logger,
      ),
  },
});
