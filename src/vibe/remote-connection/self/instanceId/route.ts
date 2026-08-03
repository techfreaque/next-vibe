/**
 * Remote Connection Self Instance ID Route Handler
 * GET - read the instanceId of the current instance's own identity on this machine
 */

import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

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
