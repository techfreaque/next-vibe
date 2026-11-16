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
    handler: ({
      user,
      logger,
      t,
      locale,
      data,
      platform,
      toolExecutionContext,
    }) =>
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
        // Inside a stream the active favorite is the one the AI runs on; only
        // stream-less calls (web page, CLI) fall back to chat_settings.
        toolExecutionContext.favoriteId,
      ),
  },
});
