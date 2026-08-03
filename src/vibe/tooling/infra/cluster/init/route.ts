import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";

import clusterInitEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: clusterInitEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (await import("./repository")).ClusterInitRepository.init(
        data,
        logger,
        t,
      ),
  },
});
