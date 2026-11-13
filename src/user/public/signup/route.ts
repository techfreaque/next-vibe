import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { verifyEmailSignupEmailTemplate } from "../verify-email/email";
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
        template: verifyEmailSignupEmailTemplate,
        ignoreErrors: true, // Verification mail failing must never block signup
      },
      {
        template: adminSignupNotificationEmailTemplate,
        ignoreErrors: true, // Don't fail signup if admin notification fails
      },
    ],
    handler: async ({ data, user, locale, logger, platform, t, request }) =>
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
});
