/**
 * Favorites Batch-Delete Client-Side Route Handler
 * Mirrors server route.ts but uses the client repository (localStorage) so
 * public/unauthenticated users remove every id in one atomic write.
 */

import { Methods } from "next-vibe/core/definition/enums";
import { clientEndpointsHandler } from "next-vibe/core/route/client-multi";

import { ChatFavoritesRepositoryClient } from "../repository-client";
import definitions from "./definition";

export const { POST } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, logger, locale }) =>
      ChatFavoritesRepositoryClient.deleteFavorites(data.ids, logger, locale),
  },
});
