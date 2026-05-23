import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import clusterInitEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: clusterInitEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) => {
      const { ClusterInitRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return ClusterInitRepository.init(data, logger, t);
    },
  },
});
