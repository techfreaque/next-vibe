/**
 * Skill Import Route Handler
 * POST /vibe/agent/skills/import
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SkillImportRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale, t, toolExecutionContext }) =>
      SkillImportRepository.importFromLink(
        data,
        user,
        logger,
        locale,
        t,
        toolExecutionContext,
      ),
  },
});
