/**
 * Skill Vote Route Handler
 * POST /agent/skills/[id]/vote
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
