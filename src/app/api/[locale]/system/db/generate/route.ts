import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import generateEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: generateEndpoints,
  [Methods.POST]: {
    handler: async ({ logger }) => {
      const { DatabaseGenerateRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return DatabaseGenerateRepository.runGenerate(logger);
    },
  },
});
