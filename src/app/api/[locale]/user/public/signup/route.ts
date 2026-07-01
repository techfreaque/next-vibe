import { endpointsHandler } from "next-vibe/core/route/multi";
import { Methods } from "next-vibe/core/definition/enums";

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
    handler: async ({ data, user, locale, logger, request, platform, t }) =>
      SignupRepository.registerUser(
        data,
        user,
        locale,
        logger,
        request,
        platform,
        t,
      ),
  },
});
