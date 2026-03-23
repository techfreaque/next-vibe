/**
 * Remote Connection Re-authenticate Route Handler
 * POST - refresh credentials for an existing connection
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definition from "./definition";
import { RemoteConnectionReauthRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.POST]: {
    email: undefined,
    handler: ({ user, logger, t, data, urlPathParams, locale }) =>
      RemoteConnectionReauthRepository.reauthConnection(
        user,
        logger,
        t,
        urlPathParams.instanceId,
        data,
        locale,
      ),
  },
});
