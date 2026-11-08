/**
 * Verify Email route handler.
 * Resend (no token, logged in) mails a fresh link via the template below.
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import verifyEmailEndpoints from "./definition";
import { verifyEmailResendEmailTemplate } from "./email";
import { VerifyEmailRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: verifyEmailEndpoints,
  [Methods.POST]: {
    email: [{ template: verifyEmailResendEmailTemplate, ignoreErrors: true }],
    handler: ({ data, user, logger, t }) =>
      VerifyEmailRepository.handle(data, user, logger, t),
  },
});
