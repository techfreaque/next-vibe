import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { SessionManagementRepository } from "../repository";
import sessionRevokeEndpoints from "./definition";

export const { DELETE, tools } = endpointsHandler({
  endpoint: sessionRevokeEndpoints,

  [Methods.DELETE]: {
    email: undefined,
    handler: ({ user, urlPathParams, logger, t }) =>
      SessionManagementRepository.revoke(user, urlPathParams.id, logger, t),
  },
});
