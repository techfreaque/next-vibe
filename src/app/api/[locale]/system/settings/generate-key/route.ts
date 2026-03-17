/**
 * Generate Key Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { GenerateKeyRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ logger, t }) => GenerateKeyRepository.generate(logger, t),
  },
});
