/**
 * Credits Usage With Feature - Route
 * Server-only.
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { QueryCreditsUsageWithFeatureRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data }) =>
      QueryCreditsUsageWithFeatureRepository.queryCreditsUsageWithFeature(data),
  },
});
