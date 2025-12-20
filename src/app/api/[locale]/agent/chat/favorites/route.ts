/**
 * Chat Favorites API Route Handler
 * Handles GET (list) and POST (create) requests for favorites
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { chatFavoritesRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      chatFavoritesRepository.getFavorites(data, user, locale, logger),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      chatFavoritesRepository.createFavorite(data, user, locale, logger),
  },
});
