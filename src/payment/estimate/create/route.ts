/**
 * Create Estimate Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import estimateCreateDefinitions from "./definition";
import { EstimateCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: estimateCreateDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      EstimateCreateRepository.createEstimate(user.id, data, logger, locale),
  },
});
