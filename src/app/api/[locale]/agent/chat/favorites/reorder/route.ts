/**
 * Favorites Reorder API Route Handler
 * Handles POST requests for batch reordering favorites
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { FavoritesReorderRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger }) =>
      FavoritesReorderRepository.reorderFavorites(data, user, logger),
  },
});
