/**
 * Skill Report Route Handler
 * POST /agent/skills/[id]/report
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SkillReportRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      SkillReportRepository.submitReport(
        urlPathParams,
        data,
        user,
        logger,
        locale,
      ),
  },
});
