/**
 * Add Estimate Line Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import estimateLineDefinitions from "./definition";
import { EstimateLineAddRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: estimateLineDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      EstimateLineAddRepository.addLine(user.id, data, logger, locale),
  },
});
