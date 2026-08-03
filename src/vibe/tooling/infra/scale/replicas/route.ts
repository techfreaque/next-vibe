import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";

import scaleReplicasEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: scaleReplicasEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (await import("./repository")).ScaleReplicasRepository.scale(
        data,
        logger,
        t,
      ),
  },
});
