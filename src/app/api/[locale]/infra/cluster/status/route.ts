import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import clusterStatusEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: clusterStatusEndpoints,
  [Methods.GET]: {
    handler: async ({ logger, t }) => {
      const { ClusterStatusRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return ClusterStatusRepository.get(logger, t);
    },
  },
});
