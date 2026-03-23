/**
 * Remote Connection Rename Route Handler
 * PATCH - update the friendly name
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definition from "./definition";
import { RemoteConnectionRenameRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ user, logger, t, data, urlPathParams, locale }) =>
      RemoteConnectionRenameRepository.renameConnection(
        user,
        logger,
        t,
        urlPathParams.instanceId,
        data.newInstanceId,
        locale,
        data.propagate ?? true,
      ),
  },
});
