/**
 * Get Estimate Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import estimateGetDefinitions from "./definition";
import { EstimateGetRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: estimateGetDefinitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      EstimateGetRepository.getEstimate(user.id, urlPathParams, logger, locale),
  },
});
