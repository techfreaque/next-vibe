/**
 * Build the application Route
 * API route for build the application
 */

import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";

import buildEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: buildEndpoints,
  [Methods.POST]: {
    handler: async ({ data, locale, logger, t }) =>
      (await import("./repository")).BuildRepository.execute(
        data,
        locale,
        logger,
        t,
      ),
  },
});
