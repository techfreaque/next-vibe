/**
 * Chat Settings API Route Handler
 * Handles GET and POST requests for chat settings
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ChatSettingsRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger }) =>
      ChatSettingsRepository.getSettings(user, logger),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger }) =>
      ChatSettingsRepository.upsertSettings(data, user, logger),
  },
});
