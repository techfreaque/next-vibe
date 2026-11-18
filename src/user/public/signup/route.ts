import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import signupEndpoints from "./definition";
import {
  adminSignupNotificationEmailTemplate,
  signupWelcomeEmailTemplate,
} from "./email";
import { SignupRepository } from "./repository";

export const { POST, PATCH, tools } = endpointsHandler({
  endpoint: signupEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, platform, t, request }) =>
      SignupRepository.registerUser(
        data,
        user,
        locale,
        logger,
        platform,
        t,
        request,
      ),
  },
  [Methods.PATCH]: {
    email: [
      { template: signupWelcomeEmailTemplate, ignoreErrors: true },
      { template: adminSignupNotificationEmailTemplate, ignoreErrors: true },
    ],
    handler: ({ data, user, locale, logger, platform, t, request }) =>
      SignupRepository.confirmation(
        data,
        user,
        locale,
        logger,
        platform,
        t,
        request,
      ),
  },
});
