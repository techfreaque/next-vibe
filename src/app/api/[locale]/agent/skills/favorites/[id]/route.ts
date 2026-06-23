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
    handler: ({ urlPathParams, user, logger, t, locale }) =>
      SingleFavoriteRepository.getFavorite(
        urlPathParams,
        user,
        logger,
        t,
        locale,
      ),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, t, locale }) =>
      SingleFavoriteRepository.updateFavorite(
        data,
        urlPathParams,
        user,
        logger,
        t,
        locale,
      ),
    // Cross-instance applier — a peer relayed the edit the user submitted (gated
    // by syncScope["favorites"]); re-run the update here, keyed by the slug on the
    // event's urlPathParams. Reuses updateFavorite.
    onRemoteEvent: {
      "favorite-updated": (props) =>
        SingleFavoriteRepository.applyRemoteFavoriteUpdate(props),
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, t }) =>
      SingleFavoriteRepository.deleteFavorite(urlPathParams, user, logger, t),
    // Cross-instance applier — a peer relayed a delete (gated by
    // syncScope["favorites"]); remove the favorite here, keyed by the slug on the
    // event's urlPathParams, scoped to the user.
    onRemoteEvent: {
      "favorite-deleted": (props) =>
        SingleFavoriteRepository.applyRemoteFavoriteDelete(props),
    },
  },
});
