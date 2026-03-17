/**
 * Single Skill API Route Handler
 * Handles GET, PATCH (update), and DELETE requests for a single skill
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { SkillsRepository } from "../repository";
import definitions from "./definition";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      SkillsRepository.getSkillById(urlPathParams, user, logger, locale),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      SkillsRepository.updateSkill(data, urlPathParams, user, logger, locale),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      SkillsRepository.deleteSkill(urlPathParams, user, logger, locale),
  },
});
