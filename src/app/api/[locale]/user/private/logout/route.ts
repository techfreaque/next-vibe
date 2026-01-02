import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import logoutEndpoints from "./definition";
import { LogoutRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: logoutEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ user, logger, platform }) => LogoutRepository.logout(user, logger, platform),
  },
});
