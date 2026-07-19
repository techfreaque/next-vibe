/**
 * Single Skill API Route Handler
 * Handles GET, PATCH (update), and DELETE requests for a single skill
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { SkillsRepository } from "../repository";
import definitions from "./definition";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      SkillsRepository.getSkillById(urlPathParams, user, logger, locale),
    resolveChannel: (ctx) => SkillsRepository.resolveSubscriptionChannel(ctx),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({
      data,
      urlPathParams,
      user,
      logger,
      locale,
      toolExecutionContext,
    }) =>
      SkillsRepository.updateSkill(
        data,
        urlPathParams,
        user,
        logger,
        locale,
        toolExecutionContext,
      ),
    resolveChannel: (ctx) => SkillsRepository.resolveSubscriptionChannel(ctx),
    onRemoteEvent: {
      "skill-updated": (props) =>
        SkillsRepository.applyRemoteSkillPartialUpdate(props),
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      SkillsRepository.deleteSkill(urlPathParams, user, logger, locale),
    resolveChannel: (ctx) => SkillsRepository.resolveSubscriptionChannel(ctx),
    onRemoteEvent: {
      "skill-deleted": (props) =>
        SkillsRepository.applyRemoteSkillDeleteById(props),
    },
  },
});
