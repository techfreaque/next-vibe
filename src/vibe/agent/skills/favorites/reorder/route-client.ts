/**
 * Favorites Reorder Client-Side Route Handler
 * Mirrors server route.ts structure but uses client repository (localStorage)
 * Handles POST (reorder) requests for public/unauthenticated users
 */

import { Methods } from "next-vibe/core/definition/enums";
import { clientEndpointsHandler } from "next-vibe/core/route/client-multi";

import { ChatFavoritesRepositoryClient } from "../repository-client";
import definitions from "./definition";

/**
 * Client-side handlers - mirrors server route structure exactly
 */
export const { POST } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, logger, locale }) =>
      ChatFavoritesRepositoryClient.reorderFavorites(data, logger, locale),
  },
});
