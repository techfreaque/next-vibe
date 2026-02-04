/**
 * Single Favorite Client-Side Route Handler
 * Mirrors server route.ts structure but uses client repository (localStorage)
 * Handles GET, PATCH, DELETE for individual favorites
 */

import { clientEndpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/client-multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { ChatFavoritesRepositoryClient } from "../repository-client";
import definitions from "./definition";

/**
 * Client-side handlers - mirrors server route structure exactly
 */
export const { GET, PATCH, DELETE } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, logger }) =>
      ChatFavoritesRepositoryClient.getFavoriteById(urlPathParams.id, logger),
  },
  [Methods.PATCH]: {
    handler: ({ data, urlPathParams, logger }) =>
      ChatFavoritesRepositoryClient.updateFavorite(
        urlPathParams.id,
        data,
        logger,
      ),
  },
  [Methods.DELETE]: {
    handler: ({ urlPathParams, logger }) =>
      ChatFavoritesRepositoryClient.deleteFavorite(urlPathParams.id, logger),
  },
});
