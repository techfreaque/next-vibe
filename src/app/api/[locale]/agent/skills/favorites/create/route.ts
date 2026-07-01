/**
 * Favorites Create API Route Handler
 * Handles POST requests for creating favorites
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { FavoritesCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t, locale }) =>
      FavoritesCreateRepository.createFavorite(data, user, logger, t, locale),
    // Cross-instance applier — a peer relayed the create request the user
    // submitted (gated by syncScope["favorites"]); re-run create here so the
    // favorite exists on this instance too. Reuses the one create code path.
    onRemoteEvent: {
      "favorite-created": (props) =>
        FavoritesCreateRepository.applyRemoteFavoriteCreate(props),
    },
  },
});
