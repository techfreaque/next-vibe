import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import generateEndpoints from "./definition";
import { DatabaseGenerateRepository } from "./repository";

export const { tools } = endpointsHandler({
  endpoint: generateEndpoints,
  [Methods.POST]: {
    handler: ({ logger }) => {
      return DatabaseGenerateRepository.runGenerate(logger);
    },
  },
});
