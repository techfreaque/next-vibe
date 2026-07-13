import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import scaleReplicasEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: scaleReplicasEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).ScaleReplicasRepository.scale(data, logger, t),
  },
});
