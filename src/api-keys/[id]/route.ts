import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { ApiKeysRepository } from "../repository";
import apiKeyRevokeEndpoints from "./definition";

export const { DELETE, tools } = endpointsHandler({
  endpoint: apiKeyRevokeEndpoints,
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ user, urlPathParams, logger, t }) =>
      ApiKeysRepository.revoke(user, urlPathParams.id, logger, t),
  },
});
