/**
 * Character Card Import Route Handler
 * POST /vibe/agent/skills/import/card
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SkillCardImportRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale, t, toolExecutionContext }) =>
      SkillCardImportRepository.importCard(
        data,
        user,
        logger,
        locale,
        t,
        toolExecutionContext,
      ),
  },
});
