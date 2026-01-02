/**
 * Single Favorite API Route Handler
 * Handles GET, PATCH, and DELETE requests for individual favorites
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { SingleFavoriteRepository } from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger }) =>
      SingleFavoriteRepository.getFavorite(urlPathParams, user, logger),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger }) =>
      SingleFavoriteRepository.updateFavorite(data, urlPathParams, user, logger),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger }) =>
      SingleFavoriteRepository.deleteFavorite(urlPathParams, user, logger),
  },
});
