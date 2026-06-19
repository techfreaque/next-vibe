import { clientEndpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/client-multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ChatSettingsRepositoryClient } from "./repository-client";

export const { GET, POST } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ logger, user, availability }) =>
      ChatSettingsRepositoryClient.getSettings(logger, user, availability),
  },
  [Methods.POST]: {
    handler: ({ data, logger, user, availability }) =>
      ChatSettingsRepositoryClient.updateSettings(
        data,
        logger,
        user,
        availability,
      ),
  },
});
