/**
 * Skill Report Route Handler
 * POST /agent/chat/skills/[id]/report
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { SkillReportRepository } from "./repository";
import definitions from "./definition";

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
