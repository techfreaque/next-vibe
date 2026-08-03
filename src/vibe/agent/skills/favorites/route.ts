/**
 * Chat Favorites API Route Handler
 * Handles GET (list) requests for favorites
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
        platform,
        data.userId,
        data.query,
        data.page,
        data.pageSize,
      ),
  },
});
