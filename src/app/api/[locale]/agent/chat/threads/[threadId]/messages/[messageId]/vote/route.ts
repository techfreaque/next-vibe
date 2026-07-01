/**
 * Vote Message Route Handler
 * Handles POST requests for voting on messages
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { voteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, data, user, t, logger }) =>
      voteRepository.voteMessage(urlPathParams, data, user, t, logger),
  },
});
