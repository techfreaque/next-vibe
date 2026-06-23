/**
 * Skill Publish Route Handler
 * PATCH /agent/skills/[id]/publish
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { SkillPublishRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      SkillPublishRepository.publish(urlPathParams, data, user, logger, locale),
    onRemoteEvent: {
      "skill-updated": (payload, ctx) =>
        SkillPublishRepository.applyRemotePublish(
          payload,
          ctx.urlPathParams.id,
          ctx.user,
          ctx.logger,
        ),
    },
  },
});
