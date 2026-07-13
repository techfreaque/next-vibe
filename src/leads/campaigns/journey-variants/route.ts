/**
 * Journey Variants Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
