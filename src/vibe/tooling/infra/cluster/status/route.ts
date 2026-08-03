import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";

import clusterStatusEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: clusterStatusEndpoints,
  [Methods.GET]: {
    handler: async ({ logger, t }) =>
      (await import("./repository")).ClusterStatusRepository.get(logger, t),
  },
});
