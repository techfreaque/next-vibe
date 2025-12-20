/**
 * Single Favorite API Route Handler
 * Handles GET, PATCH, and DELETE requests for individual favorites
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { singleFavoriteRepository } from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      singleFavoriteRepository.getFavorite(data, user, locale, logger),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      singleFavoriteRepository.updateFavorite(data, user, locale, logger),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      singleFavoriteRepository.deleteFavorite(data, user, locale, logger),
  },
});
