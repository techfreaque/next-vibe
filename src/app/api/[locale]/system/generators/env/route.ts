/**
 * Env Generator API Route
 * Route handler for environment configuration generation
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { EnvGeneratorRepository } from "./repository";

export const { tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger, t }) => {
      return EnvGeneratorRepository.generateEnv(data, logger, t);
    },
  },
});
