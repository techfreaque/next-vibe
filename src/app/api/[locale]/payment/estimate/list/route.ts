/**
 * List Estimates Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
