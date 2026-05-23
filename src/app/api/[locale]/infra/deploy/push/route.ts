import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import deployPushEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: deployPushEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) => {
      const { DeployPushRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return DeployPushRepository.push(data, logger, t);
    },
  },
});
