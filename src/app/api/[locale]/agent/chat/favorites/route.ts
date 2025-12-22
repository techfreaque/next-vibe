/**
 * Chat Favorites API Route Handler
 * Handles GET (list) and POST (create) requests for favorites
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ChatFavoritesRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger }) =>
      ChatFavoritesRepository.getFavorites(user, logger),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger }) =>
      ChatFavoritesRepository.createFavorite(data, user, logger),
  },
});
