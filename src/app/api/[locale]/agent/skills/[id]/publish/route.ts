/**
 * Skill Publish Route Handler
 * PATCH /agent/skills/[id]/publish
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { SkillsRepository } from "../../repository";
import definitions from "./definition";
import { SkillPublishRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      SkillPublishRepository.publish(urlPathParams, data, user, logger, locale),
    resolveChannel: (ctx) => SkillsRepository.resolveSubscriptionChannel(ctx),
    onRemoteEvent: {
      "skill-updated": (props) =>
        SkillPublishRepository.applyRemotePublish(props),
    },
  },
});
