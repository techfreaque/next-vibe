/**
 * Remote Connection Self Instance ID Route Handler
 * GET - read the instanceId of the current instance's own identity on this machine
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definition from "./definition";
import { RemoteConnectionSelfInstanceIdRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger }) =>
      RemoteConnectionSelfInstanceIdRepository.getSelfInstanceId(user, logger),
  },
});
