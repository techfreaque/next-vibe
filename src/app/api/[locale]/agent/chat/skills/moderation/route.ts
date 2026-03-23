/**
 * Skill Moderation Route Handler
 * GET  /agent/chat/skills/moderation - list reported skills
 * PATCH /agent/chat/skills/moderation - hide or clear reports
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { SkillModerationRepository } from "./repository";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      SkillModerationRepository.listReported(data, logger, locale),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      SkillModerationRepository.moderate(data, logger, locale),
  },
});
