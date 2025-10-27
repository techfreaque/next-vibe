import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import signupEndpoints from "./definition";
import { renderAdminSignupNotification, renderRegisterMail } from "./email";
import { signupRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: signupEndpoints,
  [Methods.POST]: {
    email: [
      {
        render: renderRegisterMail,
        ignoreErrors: false,
      },
      {
        render: renderAdminSignupNotification,
        ignoreErrors: true, // Don't fail signup if admin notification fails
      },
    ],
    handler: async ({ data, user, locale, logger }) => {
      return await signupRepository.registerUser(data, user, locale, logger);
    },
  },
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return await signupRepository.checkEmailAvailability(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
