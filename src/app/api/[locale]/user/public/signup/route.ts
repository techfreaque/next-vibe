import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import signupEndpoints from "./definition";
import {
  adminSignupNotificationEmailTemplate,
  signupWelcomeEmailTemplate,
} from "./email";
import { SignupRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: signupEndpoints,
  [Methods.POST]: {
    email: [
      {
        template: signupWelcomeEmailTemplate,
        ignoreErrors: false,
      },
      {
        template: adminSignupNotificationEmailTemplate,
        ignoreErrors: true, // Don't fail signup if admin notification fails
      },
    ],
    handler: async ({ data, user, locale, logger, request, platform, t }) => {
      return await SignupRepository.registerUser(
        data,
        user,
        locale,
        logger,
        request,
        platform,
        t,
      );
    },
  },
});
