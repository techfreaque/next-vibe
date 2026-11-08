/**
 * Chat Moderation Route Handler
 * GET   /agent/chat/moderation - list reported / hidden threads
 * PATCH /agent/chat/moderation - dismiss, remove, or ban the author
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ChatModerationRepository } from "./repository";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      ChatModerationRepository.listReported(data, logger, locale),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      ChatModerationRepository.moderate(data, logger, locale),
  },
});
