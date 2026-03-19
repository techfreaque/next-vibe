/**
 * Journey Variants Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { JourneyVariantsRepository } from "./repository";

export const { GET, POST, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ logger, t }) => JourneyVariantsRepository.getAll(logger, t),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      JourneyVariantsRepository.register(data, logger, t),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      JourneyVariantsRepository.update(data, logger, t),
  },
});
