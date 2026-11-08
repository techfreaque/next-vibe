/**
 * Refusal Index - Leaderboard Route Handler (public)
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { RefusalPublicRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ logger, locale }) =>
      RefusalPublicRepository.leaderboard(logger, locale),
  },
});
