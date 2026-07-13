/**
 * Chat Settings API Route Handler
 * Handles GET and POST requests for chat settings
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ChatSettingsRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger, t }) =>
      ChatSettingsRepository.getSettings(user, logger, t),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t }) =>
      ChatSettingsRepository.upsertSettings(data, user, logger, t),
  },
});
