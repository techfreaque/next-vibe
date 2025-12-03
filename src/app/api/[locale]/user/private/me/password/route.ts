import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import passwordEndpoints from "./definition";
import { passwordUpdateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: passwordEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ user, data, locale, logger }) => {
      // Verify 2FA code if 2FA is enabled for the user
      // The data object should include twoFactorCode if 2FA is enabled
      return await passwordUpdateRepository.updatePassword(
        user.id,
        data,
        locale,
        logger,
      );
    },
  },
});
