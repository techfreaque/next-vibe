/**
 * List Estimates Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import estimateListDefinitions from "./definition";
import { EstimateListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: estimateListDefinitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      EstimateListRepository.listEstimates(user.id, data, logger, locale),
  },
});
