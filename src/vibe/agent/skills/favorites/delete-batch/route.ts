/**
 * Favorites Batch-Delete API Route Handler
 * Handles POST requests that remove several favorites in one atomic call.
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { FavoritesDeleteBatchRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t }) =>
      FavoritesDeleteBatchRepository.deleteFavorites(data, user, logger, t),
    // Cross-instance applier — a peer relayed a batch delete (gated by
    // syncScope["favorites"]); remove the same ids here, scoped to the user.
    onRemoteEvent: {
      "favorites-deleted-batch": (props) =>
        FavoritesDeleteBatchRepository.applyRemoteFavoritesDeleteBatch(props),
    },
  },
});
