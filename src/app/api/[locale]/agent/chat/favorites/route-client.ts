import { clientEndpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/client-multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
