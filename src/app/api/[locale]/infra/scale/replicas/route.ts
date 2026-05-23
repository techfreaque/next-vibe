import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import scaleReplicasEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: scaleReplicasEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) => {
      const { ScaleReplicasRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return ScaleReplicasRepository.scale(data, logger, t);
    },
  },
});
