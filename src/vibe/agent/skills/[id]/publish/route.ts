/**
 * Skill Publish Route Handler
 * PATCH /agent/skills/[id]/publish
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
