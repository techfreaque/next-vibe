import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import clusterStatusEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: clusterStatusEndpoints,
  [Methods.GET]: {
    handler: async ({ logger, t }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).ClusterStatusRepository.get(logger, t),
  },
});
