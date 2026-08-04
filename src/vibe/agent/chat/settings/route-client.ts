import { Methods } from "next-vibe/core/definition/enums";
import { clientEndpointsHandler } from "next-vibe/core/route/client-multi";

import { getClientAvailability } from "../../env-availability-store";
import definitions from "./definition";
import { ChatSettingsRepositoryClient } from "./repository-client";

export const { GET, POST } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ logger, user }) =>
      ChatSettingsRepositoryClient.getSettings(
        logger,
        user,
        getClientAvailability(),
      ),
  },
  [Methods.POST]: {
    handler: ({ data, logger, user }) =>
      ChatSettingsRepositoryClient.updateSettings(
        data,
        logger,
        user,
        getClientAvailability(),
      ),
  },
});
