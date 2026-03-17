/**
 * Remote Connection Disconnect Route Handler
 * DELETE — remove the connection record
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definition from "./definition";
import { disconnectConnection } from "./repository";

export const { DELETE, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ user, logger, t, urlPathParams, locale }) =>
      disconnectConnection(user, logger, t, urlPathParams.instanceId, locale),
  },
});
