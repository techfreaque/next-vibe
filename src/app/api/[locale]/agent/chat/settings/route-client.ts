/**
 * Chat Settings Client-Side Route Handler
 * Mirrors server route.ts structure but uses client repository (localStorage)
 * Handles GET/POST requests for public/unauthenticated users
 */

import { clientEndpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/client-multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ChatSettingsRepositoryClient } from "./repository-client";

/**
 * Client-side handlers - mirrors server route structure exactly
 */
export const { GET, POST } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ logger }) => ChatSettingsRepositoryClient.getSettings(logger),
  },
  [Methods.POST]: {
    handler: ({ data, logger }) =>
      ChatSettingsRepositoryClient.updateSettings(data, logger),
  },
});
