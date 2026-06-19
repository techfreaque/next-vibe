/**
 * Remote Connection Self Rename Route Handler
 * PATCH - update the friendly name of the current instance's own identity
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definition from "./definition";
import { RemoteConnectionSelfRenameRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ user, logger, t, data, locale }) =>
      RemoteConnectionSelfRenameRepository.renameSelf(
        user,
        logger,
        t,
        data.newInstanceId,
        locale,
        data.propagate ?? true,
      ),
  },
});
