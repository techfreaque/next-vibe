/**
 * Get Estimate Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
