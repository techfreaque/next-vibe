import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import signupEndpoints from "./definition";
import { renderAdminSignupNotification, renderRegisterMail } from "./email";
import { signupRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
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
    handler: async ({ data, user, locale, logger, request, platform }) => {
      return await signupRepository.registerUser(data, user, locale, logger, request, platform);
    },
  },
});
