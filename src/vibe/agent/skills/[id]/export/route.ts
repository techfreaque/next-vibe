/**
 * Skill Export Route Handler
 * GET /vibe/agent/skills/[id]/export
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SkillExportRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale, t }) =>
      SkillExportRepository.exportCard(urlPathParams, user, logger, locale, t),
  },
});
