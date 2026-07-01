/**
 * Favorites Reorder API Route Handler
 * Handles POST requests for batch reordering favorites
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { ChatFavoritesRepository } from "../repository";
import definitions from "./definition";
import { FavoritesReorderRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t }) =>
      FavoritesReorderRepository.reorderFavorites(data, user, logger, t),
    // Cross-instance applier — a peer relayed new favorite positions (gated by
    // syncScope["favorites"]); apply the same reorder here, scoped to the user.
    onRemoteEvent: {
      "favorites-reordered": (props) =>
        ChatFavoritesRepository.applyRemoteFavoriteReorder(props),
    },
  },
});
