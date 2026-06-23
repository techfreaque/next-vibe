/**
 * Chat Favorites API Route Handler
 * Handles GET (list) requests for favorites
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ChatFavoritesRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger, t, locale, data, platform }) =>
      ChatFavoritesRepository.getFavorites(
        user,
        logger,
        t,
        locale,
        data.userId,
        data.query,
        data.page,
        data.pageSize,
        platform,
      ),
    // The list is a pure read endpoint with no events of its own. Each CRUD op
    // (create, [id] PATCH/DELETE, reorder) owns and applies its own remote event;
    // their client onEvent handlers patch this list's cache. Clients still
    // subscribe to the user channel to receive those relayed op events.
    canSubscribe: ({ user }) => !!user.id,
  },
});
