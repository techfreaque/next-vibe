/**
 * Favorites Reorder API Route Handler
 * Handles POST requests for batch reordering favorites
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
      "favorites-reordered": (payload, ctx) =>
        ChatFavoritesRepository.applyRemoteFavoriteReorder(
          payload.positions,
          ctx.user.id,
          ctx.logger,
        ),
    },
  },
});
