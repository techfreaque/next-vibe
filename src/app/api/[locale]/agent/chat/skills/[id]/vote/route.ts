/**
 * Skill Vote Route Handler
 * POST /agent/chat/skills/[id]/vote
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { SkillVoteRepository } from "./repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      SkillVoteRepository.toggleVote(urlPathParams, user, logger, locale),
  },
});
