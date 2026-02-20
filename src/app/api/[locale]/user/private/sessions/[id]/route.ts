import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { SessionManagementRepository } from "../repository";
import sessionRevokeEndpoints from "./definition";

export const { DELETE, tools } = endpointsHandler({
  endpoint: sessionRevokeEndpoints,

  [Methods.DELETE]: {
    email: undefined,
    handler: ({ user, urlPathParams, logger }) =>
      SessionManagementRepository.revoke(user, urlPathParams.id, logger),
  },
});
