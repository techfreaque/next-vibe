/**
 * Favorites Create API Route Handler
 * Handles POST requests for creating favorites
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
      "favorite-created": (payload, ctx) =>
        FavoritesCreateRepository.applyRemoteFavoriteCreate(
          payload,
          ctx.user,
          ctx.logger,
        ),
    },
  },
});
