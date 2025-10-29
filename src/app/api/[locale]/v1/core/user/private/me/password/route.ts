import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import passwordEndpoints from "./definition";
import { passwordUpdateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: passwordEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ user, data, locale, logger }) => {
      // TODO has to ask for 2fa code if 2fa is enabled
      return await passwordUpdateRepository.updatePassword(
        user.id,
        data,
        locale,
        logger,
      );
    },
  },
});
