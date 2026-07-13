/**
 * Skill Vote Route Handler
 * POST /agent/skills/[id]/vote
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { SkillsRepository } from "../../repository";
import definitions from "./definition";
import { SkillVoteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, data, user, logger, locale }) =>
      SkillVoteRepository.vote(urlPathParams, data, user, logger, locale),
    resolveChannel: (ctx) => SkillsRepository.resolveSubscriptionChannel(ctx),
  },
});
