/**
 * Builder Route
 * API route for building and bundling packages for npm distribution
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import builderEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: builderEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (await import("./repository")).builderRepository.execute(data, logger, t),
  },
});
