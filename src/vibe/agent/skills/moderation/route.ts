/**
 * Skill Moderation Route Handler
 * GET  /agent/skills/moderation - list reported skills
 * PATCH /agent/skills/moderation - hide or clear reports
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
