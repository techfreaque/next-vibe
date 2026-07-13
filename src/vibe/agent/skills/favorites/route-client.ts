import { Methods } from "next-vibe/core/definition/enums";
import { clientEndpointsHandler } from "next-vibe/core/route/client-multi";

import definitions from "./definition";
import { ChatFavoritesRepositoryClient } from "./repository-client";

export const { GET } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ logger, locale, user, availability }) =>
      ChatFavoritesRepositoryClient.getFavorites(
        logger,
        locale,
        user,
        availability,
      ),
  },
});
