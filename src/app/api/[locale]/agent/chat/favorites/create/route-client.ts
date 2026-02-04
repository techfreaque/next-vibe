/**
 * Chat Favorites Create Client-Side Route Handler
 * Mirrors server route.ts structure but uses client repository (localStorage)
 * Handles POST (create) requests for public/unauthenticated users
 */

import { clientEndpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/client-multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { ChatFavoritesRepositoryClient } from "../repository-client";
import definitions from "./definition";

/**
 * Client-side handlers - mirrors server route structure exactly
 */
export const { POST } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, logger }) =>
      ChatFavoritesRepositoryClient.createFavorite(data, logger),
  },
});
