/**
 * Skill Publish Route Handler
 * PATCH /agent/chat/skills/[id]/publish
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { SkillPublishRepository } from "./repository";
import definitions from "./definition";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      SkillPublishRepository.publish(urlPathParams, data, user, logger, locale),
  },
});
