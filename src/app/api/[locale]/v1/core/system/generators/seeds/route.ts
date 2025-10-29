/**
 * Seeds Generator API Route
 * Route handler for database seed generation
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { seedsGeneratorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      return seedsGeneratorRepository.generateSeeds(data, user, locale, logger);
    },
  },
});
