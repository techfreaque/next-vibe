import { Methods } from "next-vibe/core/definition/enums";
import { getClientAvailability } from "../../env-availability-store";
import { clientEndpointsHandler } from "next-vibe/core/route/client-multi";

import definitions from "./definition";
import { ChatFavoritesRepositoryClient } from "./repository-client";

export const { GET } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ logger, locale, user }) =>
      ChatFavoritesRepositoryClient.getFavorites(
        logger,
        locale,
        user,
        getClientAvailability(),
      ),
  },
});
